import type { ErrorRequestHandler } from 'express';

export const gestionarErrores: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
  if (error && typeof error === 'object' && 'type' in error) {
    if (error.type === 'entity.parse.failed') {
      res.status(400).json({ mensaje: 'El cuerpo de la solicitud debe ser JSON válido.' });
      return;
    }
    if (error.type === 'entity.too.large') {
      res.status(413).json({ mensaje: 'La solicitud supera el tamaño permitido.' });
      return;
    }
  }
  console.error('Error al procesar la solicitud:', error instanceof Error ? error.name : 'Desconocido');
  res.status(500).json({ mensaje: 'Ocurrió un error al procesar la solicitud. Intenta nuevamente.' });
};
