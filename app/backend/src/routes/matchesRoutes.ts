import { Router } from 'express';
import matchesController from '../controllers/matchesController';

const routers = Router();

// routers.get('/:id', matchesController.findTeam);
routers.get('/', matchesController.getMatches);

export default routers;
