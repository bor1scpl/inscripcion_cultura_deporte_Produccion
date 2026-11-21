import type { Comprobante, Oferta, Postulacion } from '@bienestar/compartido';

export type Errores = Record<string, string>;

export class ErrorApi extends Error {
  constructor(mensaje: string, readonly errores: Errores = {}, readonly estado?: number) {
    super(mensaje);
  }
}

async function solicitar<T>(url: string, opciones?: RequestInit): Promise<T> {
  let respuesta: Response;
  try {
    respuesta = await fetch(url, opciones);
  } catch {
    throw new ErrorApi('No se pudo conectar con el portal. Intenta nuevamente.');
  }
  const datos = await respuesta.json().catch(() => null);
  if (!respuesta.ok || datos === null) {
    throw new ErrorApi(datos?.mensaje ?? 'El servicio no está disponible. Intenta nuevamente.', datos?.errores, respuesta.status);
  }
  return datos as T;
}

export function cargarOferta(signal: AbortSignal) {
  return solicitar<Oferta>('/api/disciplinas', { signal });
}

export function enviarPostulacion(datos: Postulacion) {
  return solicitar<Comprobante>('/api/postulaciones', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
}
