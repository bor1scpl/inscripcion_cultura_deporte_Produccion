interface HorarioCultural {
  dias: number[];
  inicio: string;
  fin: string;
}

interface DisciplinaCultural {
  nombre: string;
  horarios: HorarioCultural[];
  descripcion?: string;
}

// Días ISO: lunes = 1, domingo = 7. Horas locales en formato de 24 horas.
export const ofertaCultural: DisciplinaCultural[] = [
  {
    nombre: 'Banda sabanera',
    horarios: [
      { dias: [1, 2, 3, 4], inicio: '14:00', fin: '18:00' },
    ],
  },
  {
    nombre: 'Cine club Babel',
    horarios: [
      { dias: [1], inicio: '09:00', fin: '11:00' },
    ],
  },
  {
    nombre: 'Cine club Comité de Cine',
    horarios: [
      { dias: [3], inicio: '14:00', fin: '16:30' },
    ],
  },
  {
    nombre: 'Cine club La Facultad de Medicina',
    horarios: [
      { dias: [3], inicio: '12:00', fin: '14:00' },
    ],
  },
  {
    nombre: 'Cine club Sendai',
    horarios: [
      { dias: [1], inicio: '12:00', fin: '13:00' },
      { dias: [2], inicio: '12:00', fin: '13:50' },
    ],
  },
  {
    nombre: 'Club de lectura y escritura Clio',
    horarios: [
      { dias: [2, 3], inicio: '17:00', fin: '18:30' },
    ],
  },
  {
    nombre: 'Coral societas',
    horarios: [
      { dias: [1, 3, 4, 5], inicio: '16:00', fin: '20:00' },
    ],
  },
  {
    nombre: 'Coro San Agustín',
    horarios: [
      { dias: [1, 2, 3], inicio: '11:00', fin: '16:00' },
    ],
  },
  {
    nombre: 'Danzas modernas y urbanas grupo base y semillero',
    horarios: [
      { dias: [2], inicio: '17:00', fin: '21:00' },
      { dias: [6], inicio: '14:00', fin: '18:00' },
    ],
  },
  {
    nombre: 'Danzas y música folclóricas de la UdeC',
    horarios: [
      { dias: [2, 4], inicio: '16:00', fin: '18:00' },
      { dias: [3], inicio: '17:00', fin: '19:00' },
    ],
  },
  {
    nombre: 'Grupo de danzas internacionales y contemporánea',
    horarios: [
      { dias: [2, 3], inicio: '18:00', fin: '20:00' },
      { dias: [5], inicio: '18:00', fin: '20:00' },
    ],
  },
  {
    nombre: 'Grupo de porrismo',
    horarios: [
      { dias: [1, 3], inicio: '12:50', fin: '16:10' },
      { dias: [4], inicio: '08:40', fin: '12:00' },
      { dias: [5], inicio: '12:40', fin: '16:10' },
    ],
  },
  {
    nombre: 'Grupo de teatro TEUC',
    horarios: [
      { dias: [1, 2, 3], inicio: '18:00', fin: '21:00' },
      { dias: [6], inicio: '09:00', fin: '12:00' },
    ],
  },
  {
    nombre: 'Grupo de teatro Utopía',
    horarios: [
      { dias: [1, 4, 5], inicio: '17:30', fin: '21:00' },
    ],
  },
  {
    nombre: 'Grupo Gaita, Maraca y Tambó',
    descripcion: 'Música folclórica.',
    horarios: [
      { dias: [1, 2, 4, 5], inicio: '14:00', fin: '18:00' },
      { dias: [3], inicio: '18:00', fin: '20:00' },
    ],
  },
  {
    nombre: 'Grupo multimedia Eclectiva',
    horarios: [
      { dias: [2], inicio: '16:00', fin: '18:30' },
      { dias: [4], inicio: '10:30', fin: '12:00' },
      { dias: [4], inicio: '15:00', fin: '18:00' },
      { dias: [6], inicio: '08:40', fin: '11:00' },
      { dias: [6], inicio: '13:30', fin: '16:00' },
    ],
  },
  {
    nombre: 'Grupo musical folclórico Corinche',
    horarios: [
      { dias: [2, 4], inicio: '17:00', fin: '21:00' },
      { dias: [3], inicio: '17:00', fin: '21:00' },
    ],
  },
  {
    nombre: 'Grupo Vallenato UdeC',
    horarios: [
      { dias: [2], inicio: '19:00', fin: '22:00' },
    ],
  },
  {
    nombre: 'Orquesta tropical UdeC',
    horarios: [
      { dias: [3], inicio: '18:00', fin: '22:00' },
    ],
  },
];
