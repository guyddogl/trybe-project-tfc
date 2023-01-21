import { Router } from 'express';
import teamsController from '../controllers/teamsController';

const routers = Router();

routers.get('/:id', teamsController.findTeam);
routers.get('/', teamsController.getTeams);

export default routers;
