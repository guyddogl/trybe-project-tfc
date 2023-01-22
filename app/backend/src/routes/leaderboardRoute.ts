import { Router } from 'express';
import leaderboardController from '../controllers/leaderboardController';

const routers = Router();

routers.get('/home', leaderboardController.getLeaderboard);
routers.get('/away', leaderboardController.getLeaderboard);
// routers.get('/', leaderboardController.getGeneralLeaderboard);

export default routers;
