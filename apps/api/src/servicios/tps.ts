import { validarPostulacion } from '@bienestar/compartido';
import type { Comprobante, Oferta, Postulacion } from '@bienestar/compartido';
import { entorno } from '../config/entorno';
import { consultarDisciplinas, guardarPostulacion } from '../repositorios/tps';

const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const esquema = validarPostulacion(entorno.dominioInstitucional);

export async function obtenerOferta(): Promise<Oferta> {
  const disciplinas = await consultarDisciplinas();
  disciplinas.sort((a, b) =>
    Number(a.tipo === 'CULTURA') - Number(b.tipo === 'CULTURA')
    || (a.tipo === 'CULTURA' ? a.nombre.localeCompare(b.nombre, 'es-CO') : 0),
  );
  return {
    dominioInstitucional: entorno.dominioInstitucional,
    disciplinas: disciplinas.map(({ horarios, _count, ...disciplina }) => ({
      ...disciplina,
      cuposDisponibles: Math.max(0, disciplina.cupoMaximo - _count.postulaciones),
      horarios: horarios.map(({ dia, inicio, fin }) => ({
        dia: dias[dia - 1],
        inicio: inicio.toISOString().slice(11, 16),
        fin: fin.toISOString().slice(11, 16),
      })),
    })),
  };
}

async function enviarAGoogleSheets(datos: Postulacion, radicado: string, nombreDisciplina: string) {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
  const token = process.env.WEBHOOK_TOKEN?.trim();
  if (!url && !token) return;

  if (!url || !token || !/^https:\/\/script\.google\.com\/(?:a\/macros\/[\w.-]+\/|macros\/)s\/[\w-]+\/exec$/.test(url)) {
    console.warn('Google Sheets: revisa GOOGLE_SHEETS_WEBHOOK_URL y WEBHOOK_TOKEN.');
    return;
  }

  try {
    const respuesta = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // El Apps Script publicado lee disciplinaId para llenar la columna Disciplina.
      body: JSON.stringify({ ...datos, disciplinaId: nombreDisciplina, radicado, token }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!respuesta.ok || (await respuesta.json())?.ok !== true) {
      console.warn('Google Sheets rechazó la postulación', radicado);
    }
  } catch {
    console.warn('No se pudo confirmar el envío a Google Sheets', radicado);
  }
}

export async function registrarPostulacion(entrada: unknown): Promise<
  { comprobante: Comprobante } | { errores: Record<string, string>; cupoAgotado?: true }
> {
  const validacion = esquema.safeParse(entrada);
  if (!validacion.success) {
    const errores: Record<string, string> = {};
    for (const { path, message } of validacion.error.issues) {
      errores[String(path[0] ?? 'formulario')] ??= path.length ? message : 'Envía los datos del formulario.';
    }
    return { errores };
  }

  const guardado = await guardarPostulacion(validacion.data);
  if (guardado.resultado === 'inexistente') {
    return { errores: { disciplinaId: 'La disciplina seleccionada ya no está disponible.' } };
  }
  if (guardado.resultado === 'agotado') {
    return { cupoAgotado: true, errores: { disciplinaId: 'No quedan cupos en esta disciplina. Elige otra.' } };
  }
  const { registro, nombreDisciplina, cuposDisponibles } = guardado;
  await enviarAGoogleSheets(validacion.data, registro.id, nombreDisciplina);
  return { comprobante: { ...registro, creadaEn: registro.creadaEn.toISOString(), cuposDisponibles } };
}
