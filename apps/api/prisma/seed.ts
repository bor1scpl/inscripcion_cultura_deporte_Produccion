import { PrismaClient } from '@prisma/client';
import { ofertaCultural } from './oferta-cultural';

const prisma = new PrismaClient();
const ofertaDeportiva = [
  { nombre: 'Fútbol', tipo: 'DEPORTE', descripcion: 'Practica fundamentos técnicos y juego en equipo en la cancha universitaria.', cupoMaximo: 24, dias: [2, 4], inicio: '16:00', fin: '18:00' },
  { nombre: 'Baloncesto', tipo: 'DEPORTE', descripcion: 'Entrena pases, lanzamientos y estrategias de juego colectivo.', cupoMaximo: 18, dias: [1, 3], inicio: '15:00', fin: '17:00' },
  { nombre: 'Voleibol', tipo: 'DEPORTE', descripcion: 'Desarrolla técnica de saque, recepción y ataque en equipo.', cupoMaximo: 18, dias: [2, 5], inicio: '14:00', fin: '16:00' },
] as const;

const deportesSinHorario = [
  'Ajedrez',
  'Atletismo',
  'Bádminton',
  'Fútbol Sala',
  'Karate-do',
  'Kickball',
  'Levantamiento de pesas',
  'Softbol',
  'Taekwondo',
  'Tenis',
  'Tenis de mesa',
  'Rugby',
];

const cupoInicial = 20;
const danzasModernas = 'Danzas modernas y urbanas grupo base y semillero';
const fichasAnteriores = ['Danzas modernas base', 'Danzas modernas semillero'];

function hora(valor: string) {
  return new Date(`1970-01-01T${valor}:00Z`);
}

async function unificarDanzasModernas() {
  const fichas = await prisma.disciplina.findMany({
    where: { tipo: 'CULTURA', nombre: { in: [danzasModernas, ...fichasAnteriores] } },
    select: { id: true, nombre: true },
  });
  const fichaPrincipal = [danzasModernas, ...fichasAnteriores]
    .map((nombre) => fichas.find((ficha) => ficha.nombre === nombre)).find(Boolean);
  if (!fichaPrincipal) return;

  for (const ficha of fichas) {
    if (ficha.id === fichaPrincipal.id) continue;
    await prisma.postulacion.updateMany({
      where: { disciplinaId: ficha.id },
      data: { disciplinaId: fichaPrincipal.id },
    });
    await prisma.horario.deleteMany({ where: { disciplinaId: ficha.id } });
    await prisma.disciplina.delete({ where: { id: ficha.id } });
  }
  if (fichaPrincipal.nombre !== danzasModernas) {
    await prisma.disciplina.update({ where: { id: fichaPrincipal.id }, data: { nombre: danzasModernas } });
  }
}

async function cargarCultura() {
  await unificarDanzasModernas();
  await prisma.disciplina.updateMany({
    where: { tipo: 'CULTURA', publicada: true, nombre: { notIn: ofertaCultural.map(({ nombre }) => nombre) } },
    data: { publicada: false },
  });
  for (const { nombre, descripcion, horarios } of ofertaCultural) {
    const disciplina = await prisma.disciplina.upsert({
      where: { nombre },
      update: { publicada: true },
      create: {
        nombre, tipo: 'CULTURA',
        descripcion: descripcion ?? 'Actividad cultural de Bienestar Universitario.',
        cupoMaximo: cupoInicial,
      },
      select: { id: true, horarios: { select: { dia: true, inicio: true, fin: true } } },
    });

    const nuevos = horarios.flatMap(({ dias, inicio, fin }) =>
      dias.map((dia) => ({ dia, inicio: hora(inicio), fin: hora(fin) })),
    );
    if (disciplina.horarios.length === nuevos.length && nuevos.every((nuevo) =>
      disciplina.horarios.some((actual) => actual.dia === nuevo.dia
        && actual.inicio.getTime() === nuevo.inicio.getTime()
        && actual.fin.getTime() === nuevo.fin.getTime()),
    )) continue;

    await prisma.horario.deleteMany({ where: { disciplinaId: disciplina.id } });
    if (nuevos.length > 0) {
      await prisma.horario.createMany({ data: nuevos.map((horario) => ({ ...horario, disciplinaId: disciplina.id })) });
    }
  }
}

async function cargarOferta() {
  for (const { dias, inicio, fin, ...datos } of ofertaDeportiva) {
    await prisma.disciplina.upsert({
      where: { nombre: datos.nombre },
      update: {},
      create: {
        ...datos,
        horarios: { create: dias.map((dia) => ({ dia, inicio: hora(inicio), fin: hora(fin) })) },
      },
    });
  }

  await prisma.disciplina.createMany({
    data: [
      ...deportesSinHorario.map((nombre) => ({
        nombre, tipo: 'DEPORTE' as const, descripcion: 'Disciplina deportiva de Bienestar Universitario.', cupoMaximo: cupoInicial,
      })),
    ],
    skipDuplicates: true,
  });

  await cargarCultura();
  console.log('Oferta de disciplinas disponible.');
}

cargarOferta().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => prisma.$disconnect());