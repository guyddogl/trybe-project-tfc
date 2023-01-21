import { Request, Response } from 'express';
import matchesService from '../services/matchesService';

const getMatches = async (req: Request, res: Response):Promise<void> => {
  const { inProgress } = req.query;
  if (inProgress) {
    const booleanConvert: boolean = [inProgress].includes('true');
    const { status, matchesFound } = await matchesService.getMatchesInProgress(booleanConvert);
    res.status(status).json(matchesFound);
  } else {
    const { status, matchesFound } = await matchesService.getMatches();
    res.status(status).json(matchesFound);
  }
};

export default {
  getMatches,
};