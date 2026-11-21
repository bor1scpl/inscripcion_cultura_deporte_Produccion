import { describe, expect, it } from 'vitest';
import { validarPostulacion } from './index';

const esquema = validarPostulacion('unicartagena.edu.co');
const datos = {
  nombre: 'Andrea Pérez',
  documento: '00123',
  correo: 'a.perez@unicartagena.edu.co',
  campus: 'Claustro San Agustín',
  programa: 'Ingeniería',
  promedio: 0,
  disciplinaId: '4ea2a20e-eba1-4993-8766-ebe3e95d886f',
};

describe('Validación de la postulación', () => {
  it('acepta 0 y conserva ceros iniciales del código', () => {
    expect(esquema.parse(datos).documento).toBe('00123');
  });

  it.each(Object.keys(datos) as (keyof typeof datos)[])('requiere %s', (campo) => {
    expect(esquema.safeParse({ ...datos, [campo]: undefined }).success).toBe(false);
  });

  it.each([{ nombre: ' ' }, { correo: 'a@externo.edu.co' }, { promedio: 2.999 }, { promedio: 5.01 }, { campus: '' }, { campus: 'Campus desconocido' }])(
    'rechaza datos inválidos %o',
    (cambios) => expect(esquema.safeParse({ ...datos, ...cambios }).success).toBe(false),
  );

  it('acepta 2,99 en la fase de recepción', () => {
    expect(esquema.safeParse({ ...datos, promedio: 2.99 }).success).toBe(true);
  });
});
