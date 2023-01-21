import { Router } from 'express';
import matchesController from '../controllers/matchesController';

const routers = Router();

routers.patch('/:id/finish', matchesController.finishMatch);
routers.get('/', matchesController.getMatches);
routers.post('/', matchesController.createMatch);

export default routers;
