import { z } from 'zod';

function requerido(etiqueta: string, maximo: number) {
  return z.string({ error: `${etiqueta} es obligatorio.` })
    .trim().min(1, `${etiqueta} es obligatorio.`).max(maximo, `Máximo ${maximo} caracteres.`);
}

export const campusDisponibles = [
  'Claustro San Agustín',
  'Claustro de la Merced',
  'Campus Piedra de Bolívar',
  'Campus Zaragocilla',
  'Campus San Pablo',
] as const;

export const esquemaPostulacion = z.object({
  nombre: requerido('El nombre', 120),
  documento: requerido('El documento o código estudiantil', 40),
  correo: requerido('El correo institucional', 254).pipe(z.email('Escribe un correo válido.')),
  campus: z.enum(campusDisponibles, { error: 'Selecciona un campus de la lista.' }),
  programa: requerido('El programa académico', 120),
  promedio: z.number({ error: 'Escribe el promedio.' }).min(0, 'El promedio debe ser mayor o igual a 0.')
    .max(5, 'El promedio debe ser menor o igual a 5.').multipleOf(0.01, 'Usa hasta dos decimales.'),
  disciplinaId: z.uuid('Selecciona una disciplina.'),
});

export function validarPostulacion(dominio: string) {
  return esquemaPostulacion.superRefine(({ correo }, ctx) => {
    if (correo.split('@').at(-1)?.toLowerCase() !== dominio.toLowerCase()) {
      ctx.addIssue({ code: 'custom', path: ['correo'], message: `Usa tu correo institucional (@${dominio}).` });
    }
  });
}

export type Postulacion = z.infer<typeof esquemaPostulacion>;

export interface Disciplina {
  id: string;
  nombre: string;
  tipo: 'DEPORTE' | 'CULTURA';
  descripcion: string;
  cupoMaximo: number;
  cuposDisponibles: number;
  horarios: { dia: string; inicio: string; fin: string }[];
}

export interface Oferta {
  disciplinas: Disciplina[];
  dominioInstitucional: string;
}

export interface Comprobante {
  id: string;
  estado: 'RECIBIDA';
  creadaEn: string;
  cuposDisponibles: number;
}
