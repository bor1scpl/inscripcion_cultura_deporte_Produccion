import type { Request, Response } from 'express';
import { obtenerOferta, registrarPostulacion } from '../servicios/tps';

export async function listar(_req: Request, res: Response) {
  res.set('Cache-Control', 'no-store').json(await obtenerOferta());
}

export async function postular(req: Request, res: Response) {
  const resultado = await registrarPostulacion(req.body);
  if ('errores' in resultado) {
    res.status(resultado.cupoAgotado ? 409 : 422).json({
      mensaje: resultado.cupoAgotado ? 'No quedan cupos en esta disciplina.' : 'Revisa los datos de la postulación.',
      errores: resultado.errores,
    });
    return;
  }
  res.status(201).json(resultado.comprobante);
}
