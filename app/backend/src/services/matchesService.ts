import matchModel from '../database/models/matchModel';
import teamsService from './teamsService';
// import teamModel from '../database/models/teamsModel';
import { Match } from '../interfaces/IMatch';

// const getTeamName = async (match: Match) => {
//   const homeTeamName = await teamModel.findOne({
//     where: { id: match.homeTeam },
//     attributes: ['teamName'],
//   }).then((res) => res?.teamName);
//   const awayTeamName = await teamModel.findOne({
//     where: { id: match.awayTeam }, attributes: ['teamName'],
//   }).then((res) => res?.teamName);
//   return {
//     id: match.id,
//     homeTeamId: match.homeTeam,
//     homeTeamGoals: match.homeTeamGoals,
//     awayTeamId: match.awayTeam,
//     awayTeamGoals: match.awayTeamGoals,
//     inProgress: match.inProgress,
//     homeTeam: { teamName: homeTeamName },
//     awayTeam: { teamName: awayTeamName },
//   };
// };

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

export default {
  getMatches,
};
