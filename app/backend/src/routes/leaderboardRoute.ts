import { Router } from 'express';
import leaderboardController from '../controllers/leaderboardController';

const routers = Router();

routers.get('/home', leaderboardController.getMatches);
// routers.get('/away', leaderboardController.getTeams);

export default routers;
