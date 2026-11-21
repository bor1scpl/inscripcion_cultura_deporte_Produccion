import { useId } from 'react';
import type { Disciplina } from '@bienestar/compartido';

interface Props {
  disciplinas: Disciplina[];
  disciplinaResaltada?: string;
  seleccionar: (id: string) => void;
  filtro: Filtro;
  filtrar: (filtro: Filtro) => void;
}

export const filtros = [
  { valor: 'TODAS', etiqueta: 'Todas' },
  { valor: 'CULTURA', etiqueta: 'Cultura' },
  { valor: 'DEPORTE', etiqueta: 'Deporte' },
] as const;

export type Filtro = (typeof filtros)[number]['valor'];

export function Catalogo({ disciplinas, disciplinaResaltada, seleccionar, filtro, filtrar }: Props) {
  const grupo = useId();
  const visibles = filtro === 'TODAS' ? disciplinas : disciplinas.filter(({ tipo }) => tipo === filtro);

  return <>
    <fieldset className="mb-4">
      <legend className="mb-2 font-semibold">Filtrar por grupo</legend>
      <div className="flex flex-wrap gap-2">
        {filtros.map(({ valor, etiqueta }) => (
          <label key={valor} className="cursor-pointer">
            <input
              className="peer sr-only"
              type="radio"
              name={grupo}
              value={valor}
              checked={filtro === valor}
              onChange={() => filtrar(valor)}
            />
            <span className="inline-block rounded-lg border border-teal-800 bg-white px-4 py-2 font-semibold text-teal-900 hover:bg-teal-50 peer-checked:bg-teal-800 peer-checked:text-white peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#b75313]">
              {etiqueta}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
    <p role="status" className={visibles.length ? 'sr-only' : undefined}>
      {visibles.length === 0
        ? (filtro === 'TODAS' ? 'Por ahora no hay disciplinas disponibles.' : 'Por ahora no hay disciplinas en este grupo.')
        : `Disciplinas disponibles: ${visibles.length}.`}
    </p>
    {visibles.length > 0 && <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {visibles.map(({ id, nombre, descripcion, tipo, horarios, cuposDisponibles, cupoMaximo }) => (
        <li key={id} id={`disciplina-${id}`} tabIndex={-1} className={`flex flex-col items-start rounded-2xl border p-5 ${id === disciplinaResaltada ? 'border-teal-400 bg-teal-100' : 'border-slate-200 bg-white'}`}>
          <p className={`rounded-full px-3 py-1 text-sm font-semibold ${tipo === 'DEPORTE' ? 'bg-teal-100 text-teal-950' : 'bg-indigo-100 text-indigo-950'}`}>
            {tipo === 'DEPORTE' ? 'Deporte' : 'Cultura'}
          </p>
          <h3 className="mt-3 text-2xl font-bold">{nombre}</h3>
          <p className="mt-2 text-slate-700">{descripcion}</p>
          <p className="mt-4 text-sm font-bold">Horarios</p>
          {horarios.length ? <ul aria-label={`Horarios de ${nombre}`} className="mb-5 mt-1 space-y-1 text-sm text-slate-700">
            {horarios.map(({ dia, inicio, fin }) => <li key={`${dia}-${inicio}`}>{dia} · {inicio} a {fin}</li>)}
          </ul> : <p className="mb-5 text-sm text-slate-700">Por definir</p>}
          <p className="mb-4 text-sm font-semibold">
            {cuposDisponibles > 0 ? `${cuposDisponibles} de ${cupoMaximo} cupos disponibles` : 'Sin cupos disponibles'}
          </p>
          <button type="button" disabled={cuposDisponibles === 0} className="secundario mt-auto disabled:cursor-not-allowed disabled:opacity-60" aria-label={`Postularme a ${nombre}`} onClick={() => seleccionar(id)}>Postularme</button>
        </li>
      ))}
    </ul>}
  </>;
}
