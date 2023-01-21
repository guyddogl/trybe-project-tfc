import { Request, Response } from 'express';
import teamsService from '../services/teamsService';

const getTeams = async (req: Request, res: Response):Promise<void> => {
  const { status, teamsFound } = await teamsService.getTeams();

  if (status === 200) {
    res.status(status).json(teamsFound);
  } else res.status(status).json({ message: 'Error' });
};

const findTeam = async (req: Request, res: Response):Promise<void> => {
  const { id } = req.params;
  const { status, message, teamFound } = await teamsService.findTeam(id);

  if (status === 200) {
    res.status(status).json(teamFound);
  } else res.status(status).json({ message });
};

export default {
  getTeams,
  findTeam,
};
