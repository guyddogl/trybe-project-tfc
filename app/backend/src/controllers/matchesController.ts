import { Request, Response } from 'express';
import matchesService from '../services/matchesService';

const getMatches = async (req: Request, res: Response):Promise<void> => {
  const { status, matchesFound } = await matchesService.getMatches();
  res.status(status).json(matchesFound);
};

export default {
  getMatches,
};
