import { useEffect, useRef, useState } from 'react';
import type { Oferta } from '@bienestar/compartido';
import { cargarOferta } from '../api/tps';
import { Catalogo, filtros } from '../catalogo/Catalogo';
import type { Filtro } from '../catalogo/Catalogo';
import { Formulario } from '../postulaciones/Formulario';

export function Portal() {
  const [oferta, setOferta] = useState<Oferta>();
  const [error, setError] = useState('');
  const [intento, setIntento] = useState(0);
  const [disciplinaId, setDisciplinaId] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('TODAS');
  const [grupoAbierto, setGrupoAbierto] = useState<Exclude<Filtro, 'TODAS'>>();
  const [disciplinaResaltada, setDisciplinaResaltada] = useState<string>();
  const temporizadorResaltado = useRef<number | undefined>(undefined);
  const menu = useRef<HTMLDetailsElement>(null);
  const tituloFormulario = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const solicitud = new AbortController();
    cargarOferta(solicitud.signal).then(setOferta).catch((fallo: Error) => {
      if (!solicitud.signal.aborted) setError(fallo.message);
    });
    return () => solicitud.abort();
  }, [intento]);

  useEffect(() => () => window.clearTimeout(temporizadorResaltado.current), []);

  function navegarOferta(grupo: Filtro, id?: string) {
    window.clearTimeout(temporizadorResaltado.current);
    setDisciplinaResaltada(id);
    if (id) {
      temporizadorResaltado.current = window.setTimeout(() => setDisciplinaResaltada(undefined), 3000);
    }
    setFiltro(grupo);
    if (menu.current) menu.current.open = false;
    requestAnimationFrame(() => {
      const destino = document.getElementById(id ? `disciplina-${id}` : 'titulo-oferta');
      destino?.focus();
    });
  }

  function actualizarCupos(id: string, disponibles: number) {
    setOferta((actual) => actual && {
      ...actual,
      disciplinas: actual.disciplinas.map((disciplina) => disciplina.id === id
        ? { ...disciplina, cuposDisponibles: Math.min(disciplina.cuposDisponibles, disponibles) }
        : disciplina),
    });
  }

  return <>
    <a className="sr-only focus:not-sr-only focus:block focus:p-3" href="#contenido">Saltar al contenido</a>
    <header className="relative border-b border-white/20 bg-[#092f33] text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6 lg:px-8">
        <p className="font-bold">Bienestar Universitario</p>
        <nav aria-label="Principal" className="flex flex-wrap gap-5 text-sm font-semibold">
          <details ref={menu} className="sm:relative" onToggle={(evento) => {
            if (!evento.currentTarget.open) setGrupoAbierto(undefined);
          }} onKeyDown={(evento) => {
            if (evento.key === 'Escape' && menu.current?.open) {
              menu.current.open = false;
              menu.current.querySelector('summary')?.focus();
            }
          }}>
            <summary className="cursor-pointer underline-offset-4 hover:underline">Disciplinas</summary>
            <div className="absolute right-5 left-5 z-10 mt-3 max-h-[65vh] overflow-y-auto sm:w-64 rounded-xl border border-teal-100 bg-white p-3 text-teal-950 shadow-lg sm:right-0 sm:left-auto">
              {filtros.map(({ valor, etiqueta }) => {
                if (valor === 'TODAS') return null;
                const desplegado = grupoAbierto === valor;
                const idGrupo = `menu-disciplinas-${valor}`;
                const disciplinas = oferta?.disciplinas.filter(({ tipo }) => tipo === valor) ?? [];

                return <div key={valor} className="border-b border-slate-200 py-1 last:border-0">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left hover:bg-teal-50 aria-expanded:bg-teal-50"
                    aria-expanded={desplegado}
                    aria-controls={idGrupo}
                    onClick={() => {
                      setGrupoAbierto(desplegado ? undefined : valor);
                      if (!desplegado) setFiltro(valor);
                    }}
                  >
                    {etiqueta}
                    <span aria-hidden="true" className={`size-2 border-r-2 border-b-2 ${desplegado ? 'rotate-225' : 'rotate-45'}`} />
                  </button>
                  <div id={idGrupo} hidden={!desplegado}>
                    {disciplinas.length > 0 ? <ul className="max-h-[min(40vh,16rem)] overflow-y-auto py-1 pl-2">
                      {disciplinas.map(({ id, nombre }) => (
                        <li key={id}>
                          <button type="button" className="w-full rounded-md px-2 py-1.5 text-left font-normal hover:bg-teal-50" onClick={() => navegarOferta(valor, id)}>{nombre}</button>
                        </li>
                      ))}
                    </ul> : <p className="px-2 py-1.5 font-normal">No hay disciplinas disponibles en este grupo.</p>}
                  </div>
                </div>;
              })}
            </div>
          </details>
          <a className="underline-offset-4 hover:underline" href="#postulacion">Postulación</a>
        </nav>
      </div>
    </header>
    <main id="contenido">
      <section className="bg-[#092f33] text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-8 gap-y-4 px-4 py-6 sm:px-6 lg:px-8 lg:py-7">
          <div className="min-w-0 lg:flex-1">
            <h1 className="text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
              Portal de Inscripción a Bienestar Universitario
            </h1>
            <p className="mt-2 text-teal-100">Consulta las disciplinas deportivas y culturales, revisa sus horarios y envía tu postulación.</p>
          </div>
          <a className="inline-flex shrink-0 rounded-lg bg-teal-200 px-4 py-2.5 font-bold text-teal-950 hover:bg-teal-100" href="#oferta">Ver disciplinas</a>
        </div>
      </section>
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <section id="oferta" aria-labelledby="titulo-oferta">
          <h2 id="titulo-oferta" tabIndex={-1} className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">Disciplinas</h2>
          {error ? <div className="rounded-xl bg-white p-5">
            <p role="alert" className="mb-3 text-red-800">{error}</p>
            <button type="button" className="secundario" onClick={() => {
              setError('');
              setIntento(intento + 1);
            }}>Reintentar</button>
          </div> : !oferta ? <p role="status">Cargando disciplinas…</p> :
            <Catalogo disciplinas={oferta.disciplinas} disciplinaResaltada={disciplinaResaltada} filtro={filtro} filtrar={setFiltro} seleccionar={(id) => {
              setDisciplinaId(id);
              tituloFormulario.current?.focus();
            }} />}
        </section>
        <section id="postulacion" aria-labelledby="titulo-postulacion" className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8">
          <h2 id="titulo-postulacion" ref={tituloFormulario} tabIndex={-1} className="mb-4 text-3xl font-bold tracking-tight">Postulación</h2>
          {oferta?.disciplinas.length ? <Formulario oferta={oferta} disciplinaId={disciplinaId} seleccionar={setDisciplinaId} actualizarCupos={actualizarCupos} /> :
            <p>El formulario estará disponible cuando se cargue la oferta de disciplinas.</p>}
        </section>
      </div>
    </main>
  </>;
}
