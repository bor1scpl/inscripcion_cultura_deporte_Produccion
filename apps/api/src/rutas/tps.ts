import { Router } from 'express';
import { listar, postular } from '../controladores/tps';

export const tps = Router();
tps.get('/disciplinas', listar);
tps.post('/postulaciones', postular);
