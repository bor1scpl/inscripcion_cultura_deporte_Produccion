import express from 'express';
import { fileURLToPath } from 'node:url';
import { entorno } from './config/entorno';
import { prisma } from './config/prisma';
import { gestionarErrores } from './middleware/errores';
import { tps } from './rutas/tps';

const app = express();
app.disable('x-powered-by');
app.use('/api', express.json({ limit: '16kb' }), tps);
app.use('/api', (_req, res) => {
  res.status(404).json({ mensaje: 'Ruta de API inexistente.' });
});

app.use(express.static(fileURLToPath(new URL('../../web/dist/', import.meta.url))));
app.use(gestionarErrores);

await prisma.$connect();

const puerto = process.env.PORT ? parseInt(process.env.PORT, 10) : (entorno.puerto || 3001);
app.listen(puerto, '0.0.0.0', () => {
  console.log(`Portal de Bienestar disponible en http://0.0.0.0:${puerto}`);
});