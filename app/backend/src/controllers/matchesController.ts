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

const createMatch = async (req: Request, res: Response):Promise<void> => {
  const { body } = req;
  if (body.homeTeamId === body.awayTeamId) {
    res.status(422).json({ message: 'It is not possible to create a match with two equal teams' });
  } else {
    const { status, matchCreated } = await matchesService.createMatch(body);
    if (status === 404) res.status(status).json({ message: 'There is no team with such id!' });
    else res.status(status).json(matchCreated);
  }
};

const finishMatch = async (req: Request, res: Response):Promise<void> => {
  const { id } = req.params;
  const { status, message } = await matchesService.finishMatch(id);
  res.status(status).json({ message });
};

export default {
  getMatches,
  createMatch,
  finishMatch,
};
