import matchModel from '../database/models/matchModel';
import teamsService from './teamsService';
import { IMatch, ICreateMatch } from '../interfaces/IMatch';

const getTeamName = async (match: IMatch) => {
  const homeTeamName = await teamsService.findTeam(match.homeTeam);
  const awayTeamName = await teamsService.findTeam(match.awayTeam);
  return {
    id: match.id,
    homeTeamId: homeTeamName.teamFound?.dataValues.id,
    homeTeamGoals: match.homeTeamGoals,
    awayTeamId: awayTeamName.teamFound?.dataValues.id,
    awayTeamGoals: match.awayTeamGoals,
    inProgress: match.inProgress,
    homeTeam: { teamName: homeTeamName.teamFound?.dataValues.teamName },
    awayTeam: { teamName: awayTeamName.teamFound?.dataValues.teamName },
  };
};

const getMatches = async () => {
  const result = await matchModel.findAll();
  const matchesFound = await Promise.all(result.map((e) => getTeamName(e.dataValues)));
  return { status: 200, matchesFound };
};

const getMatchesInProgress = async (progress: boolean) => {
  const result = await matchModel.findAll({ where: { inProgress: progress } });
  const matchesFound = await Promise.all(result.map((e) => getTeamName(e.dataValues)));
  return { status: 200, matchesFound };
};

const createMatch = async (match: ICreateMatch) => {
  const result = await matchModel.create({
    homeTeam: match.homeTeamId,
    homeTeamGoals: match.homeTeamGoals,
    awayTeam: match.awayTeamId,
    awayTeamGoals: match.awayTeamGoals,
    inProgress: true,
  });
  const matchCreated = {
    id: result.dataValues.id,
    homeTeamId: result.dataValues.homeTeam,
    homeTeamGoals: result.dataValues.homeTeamGoals,
    awayTeamId: result.dataValues.awayTeam,
    awayTeamGoals: result.dataValues.awayTeamGoals,
    inProgress: result.dataValues.inProgress,
  };
  return { status: 201, matchCreated };
};

const finishMatch = async (id: string) => {
  await matchModel.update({ inProgress: false }, { where: { id } });
  return { status: 200, message: 'Finished' };
};

export default {
  getMatches,
  getMatchesInProgress,
  createMatch,
  finishMatch,
};
