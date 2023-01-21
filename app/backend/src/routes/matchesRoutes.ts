import { Router } from 'express';
import matchesController from '../controllers/matchesController';

const routers = Router();

routers.get('/', matchesController.getMatches);

export default routers;
