import type { Postulacion } from '@bienestar/compartido';
import { prisma } from '../config/prisma';

export function consultarDisciplinas() {
  return prisma.disciplina.findMany({
    where: { publicada: true },
    orderBy: [{ tipo: 'asc' }, { nombre: 'asc' }],
    select: {
      id: true, nombre: true, tipo: true, descripcion: true, cupoMaximo: true,
      _count: { select: { postulaciones: true } },
      horarios: {
        orderBy: [{ dia: 'asc' }, { inicio: 'asc' }],
        select: { dia: true, inicio: true, fin: true },
      },
    },
  });
}

export function guardarPostulacion(datos: Postulacion) {
  return prisma.$transaction(async (tx) => {
    // Serializa las reservas de una misma disciplina antes de contar sus postulaciones.
    const [disciplina] = await tx.$queryRaw<{ cupo_maximo: number; nombre: string }[]>`
      SELECT cupo_maximo, nombre FROM disciplinas WHERE id = ${datos.disciplinaId}::uuid AND publicada = true FOR UPDATE
    `;
    if (!disciplina) return { resultado: 'inexistente' } as const;

    const reservados = await tx.postulacion.count({ where: { disciplinaId: datos.disciplinaId } });
    const disponibles = disciplina.cupo_maximo - reservados;
    if (disponibles <= 0) return { resultado: 'agotado' } as const;

    const registro = await tx.postulacion.create({
      data: datos,
      select: { id: true, estado: true, creadaEn: true },
    });
    return { resultado: 'guardado', registro, nombreDisciplina: disciplina.nombre, cuposDisponibles: disponibles - 1 } as const;
  }, { isolationLevel: 'ReadCommitted' });
}
