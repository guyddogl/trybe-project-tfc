import matchModel from '../database/models/matchModel';
import teamsService from './teamsService';
import { Match } from '../interfaces/IMatch';

const getTeamName = async (match: Match) => {
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

export default {
  getMatches,
  getMatchesInProgress,
};
