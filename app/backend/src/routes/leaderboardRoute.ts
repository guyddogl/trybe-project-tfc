import { Router } from 'express';
import leaderboardController from '../controllers/leaderboardController';

const routers = Router();

routers.get('/:query', leaderboardController.getLeaderboard);

export default routers;
