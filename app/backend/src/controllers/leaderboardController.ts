import { Request, Response } from 'express';
import { IFullMatch, ITeamMatch } from '../interfaces/IMatch';
import matchesService from '../services/matchesService';
import teamsService from '../services/teamsService';

const allPoints = (totalPoints: number, match: IFullMatch, id: number) => {
  if (id === match.homeTeamId) {
    if (match.homeTeamGoals > match.awayTeamGoals) return totalPoints + 3;
    if (match.homeTeamGoals < match.awayTeamGoals) return totalPoints;
    return totalPoints + 1;
  }
  if (match.homeTeamGoals < match.awayTeamGoals) return totalPoints + 3;
  if (match.homeTeamGoals > match.awayTeamGoals) return totalPoints;
  return totalPoints + 1;
};

const calculatePoints = (totalPoints: number, match: IFullMatch, query: string, id: number) => {
  if (query === 'general') {
    return allPoints(totalPoints, match, id);
  }
  if (query === 'home') {
    if (match.homeTeamGoals > match.awayTeamGoals) return totalPoints + 3;
    if (match.homeTeamGoals < match.awayTeamGoals) return totalPoints + 0;
    return totalPoints + 1;
  }
  if (match.homeTeamGoals < match.awayTeamGoals) return totalPoints + 3;
  if (match.homeTeamGoals > match.awayTeamGoals) return totalPoints + 0;
  return totalPoints + 1;
};

const calculateVictories = (teamMatchesFound: IFullMatch[], query: string, id: number): number => {
  if (query === 'general') {
    const homeVictory = teamMatchesFound
      .filter((e: IFullMatch) => e.homeTeamId === id && e.homeTeamGoals > e.awayTeamGoals).length;
    const awayVictory = teamMatchesFound
      .filter((e: IFullMatch) => e.awayTeamId === id && e.awayTeamGoals > e.homeTeamGoals).length;
    return homeVictory + awayVictory;
  } if (query === 'home') {
    return teamMatchesFound.filter((e: IFullMatch) => e.homeTeamGoals > e.awayTeamGoals).length;
  }
  return teamMatchesFound.filter((e: IFullMatch) => e.awayTeamGoals > e.homeTeamGoals).length;
};

const calculateDraws = (teamMatchesFound: IFullMatch[]): number => {
  const result = teamMatchesFound
    .filter((e: IFullMatch) => e.homeTeamGoals === e.awayTeamGoals).length;
  return result;
};

const calculateLosses = (teamMatchesFound: IFullMatch[], query: string, id: number) => {
  if (query === 'general') {
    const homeLosses = teamMatchesFound
      .filter((e: IFullMatch) => e.homeTeamId === id && e.homeTeamGoals < e.awayTeamGoals).length;
    const awayLosses = teamMatchesFound
      .filter((e: IFullMatch) => e.awayTeamId === id && e.awayTeamGoals < e.homeTeamGoals).length;
    return homeLosses + awayLosses;
  } if (query === 'home') {
    return teamMatchesFound.filter((e: IFullMatch) => e.homeTeamGoals < e.awayTeamGoals).length;
  }
  return teamMatchesFound.filter((e: IFullMatch) => e.awayTeamGoals < e.homeTeamGoals).length;
};

const calculateGoalsFavor = (match: IFullMatch, id: number) => {
  if (id === match.homeTeamId) {
    return match.homeTeamGoals;
  }
  return match.awayTeamGoals;
};

const calculateGoalsOwn = (match: IFullMatch, id: number) => {
  if (id === match.homeTeamId) {
    return match.awayTeamGoals;
  }
  return match.homeTeamGoals;
};

const calculateTeamStats = (teamMatchesFound: IFullMatch[], query: string, id: number) => {
  const teamStats = {
    totalPoints: 0,
    totalGames: teamMatchesFound.length,
    totalVictories: calculateVictories(teamMatchesFound, query, id),
    totalDraws: calculateDraws(teamMatchesFound),
    totalLosses: calculateLosses(teamMatchesFound, query, id),
    goalsFavor: 0,
    goalsOwn: 0,
  };
  teamMatchesFound.map((match: IFullMatch) => {
    const points = calculatePoints(teamStats.totalPoints, match, query, id);
    teamStats.totalPoints = points;
    teamStats.goalsFavor += calculateGoalsFavor(match, id);
    teamStats.goalsOwn += calculateGoalsOwn(match, id);
    return true;
  });
  return teamStats;
};

const calculateEfficiency = (matches: number, points: number) => {
  const efficiency = ((points * 100) / (matches * 3)).toFixed(2);
  return efficiency;
};

const getTeamMatches = async (id: number, query: string) => {
  const { matchesFound } = await matchesService.getMatches();
  let teamMatches = [];
  if (query === 'general') {
    teamMatches = matchesFound
      .filter((e) => (e.homeTeamId === id || e.awayTeamId === id) && e.inProgress === false);
  } else if (query === 'home') {
    teamMatches = matchesFound.filter((e) => e.homeTeamId === id && e.inProgress === false);
  } else {
    teamMatches = matchesFound.filter((e) => e.awayTeamId === id && e.inProgress === false);
  }
  const teamStats = calculateTeamStats(teamMatches, query, id);
  const { teamFound } = await teamsService.findTeam(id);
  return {
    name: teamFound?.teamName,
    ...teamStats,
    goalsBalance: teamStats.goalsFavor - teamStats.goalsOwn,
    efficiency: calculateEfficiency(teamMatches.length, teamStats.totalPoints),
  };
};

const getTeamMatchesTeste = async (id: number, query: string, matchesFound: IFullMatch[]) => {
  let teamMatches = [];
  if (query === 'general') {
    teamMatches = matchesFound
      .filter((e) => (e.homeTeamId === id || e.awayTeamId === id) && e.inProgress === false);
  } else if (query === 'home') {
    teamMatches = matchesFound.filter((e) => e.homeTeamId === id && e.inProgress === false);
  } else {
    teamMatches = matchesFound.filter((e) => e.awayTeamId === id && e.inProgress === false);
  }
  const teamStats = calculateTeamStats(teamMatches, query, id);
  const { teamFound } = await teamsService.findTeam(id);
  return {
    name: teamFound?.teamName,
    ...teamStats,
    goalsBalance: teamStats.goalsFavor - teamStats.goalsOwn,
    efficiency: calculateEfficiency(teamMatches.length, teamStats.totalPoints),
  };
};

const sortLeaderboard = (teamMatches: ITeamMatch[]) => teamMatches
  .sort((a: ITeamMatch, b: ITeamMatch) => (
    b.totalPoints - a.totalPoints
    || b.totalVictories - a.totalVictories
    || b.goalsBalance - a.goalsBalance
    || b.goalsFavor - a.goalsFavor
    || a.goalsOwn - b.goalsOwn
  ));

const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
  const { path } = req.route;
  const query = path.substring(1);
  const { teamsFound } = await teamsService.getTeams();
  const teamsId = teamsFound.map((e) => e.id);
  const teamMatches = await Promise.all(teamsId.map((team) => getTeamMatches(team, query)));
  const pointsOrder = sortLeaderboard(teamMatches);
  res.status(200).json(pointsOrder);
};

const getGeneralLeaderboard = async (req: Request, res: Response): Promise<void> => {
  const { teamsFound } = await teamsService.getTeams();
  const teamsId = teamsFound.map((e) => e.id);
  const { matchesFound } = await matchesService.getMatches();
  const teamMatches = await Promise
    .all(teamsId.map((team) => getTeamMatchesTeste(team, 'general', matchesFound)));
  const pointsOrder = sortLeaderboard(teamMatches);
  res.status(200).json(pointsOrder);
};

// const getGeneralLeaderboard = async (req: Request, res: Response): Promise<void> => {
//   const { teamsFound } = await teamsService.getTeams();
//   const teamsId = teamsFound.map((e) => e.id);
//   // const teamMatches = await Promise.all(teamsId.map((team) => getTeamMatches(team, 'general')));
//   // const BRASIL = teamsId.map((team) => getTeamMatches(team, 'general'));
//   const BRASIL: any = [];
//   // await Promise.all(async () => {
//   teamsId.forEach(async (item) => {
//     const teste = await getTeamMatches(item, 'general');
//     BRASIL.push(teste);
//   });
//   // });
//   const pointsOrder = sortLeaderboard(BRASIL);
//   res.status(200).json(pointsOrder);
// };

export default {
  getLeaderboard,
  getGeneralLeaderboard,
};
