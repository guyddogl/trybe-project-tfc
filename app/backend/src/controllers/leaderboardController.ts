import { Request, Response } from 'express';
import { IFullMatch, ITeamMatch } from '../interfaces/IMatch';
import matchesService from '../services/matchesService';
import teamsService from '../services/teamsService';

const calculatePoints = (totalPoints: number, match: IFullMatch, query: string): number => {
  if (query === 'home') {
    if (match.homeTeamGoals > match.awayTeamGoals) return totalPoints + 3;
    if (match.homeTeamGoals < match.awayTeamGoals) return totalPoints + 0;
    return totalPoints + 1;
  }
  if (match.homeTeamGoals < match.awayTeamGoals) return totalPoints + 3;
  if (match.homeTeamGoals > match.awayTeamGoals) return totalPoints + 0;
  return totalPoints + 1;
};

const calculateVictories = (teamMatchesFound: IFullMatch[], query: string): number => {
  if (query === 'home') {
    return teamMatchesFound.filter((e: IFullMatch) => e.homeTeamGoals > e.awayTeamGoals).length;
  }
  return teamMatchesFound.filter((e: IFullMatch) => e.awayTeamGoals > e.homeTeamGoals).length;
};

const calculateDraws = (teamMatchesFound: IFullMatch[]): number => {
  const result = teamMatchesFound
    .filter((e: IFullMatch) => e.homeTeamGoals === e.awayTeamGoals).length;
  return result;
};

const calculateLosses = (teamMatchesFound: IFullMatch[], query: string): number => {
  if (query === 'home') {
    return teamMatchesFound.filter((e: IFullMatch) => e.homeTeamGoals < e.awayTeamGoals).length;
  }
  return teamMatchesFound.filter((e: IFullMatch) => e.awayTeamGoals < e.homeTeamGoals).length;
};

const calculateTeamStats = (teamMatchesFound: IFullMatch[], query: string) => {
  const teamStats = {
    totalPoints: 0,
    totalGames: teamMatchesFound.length,
    totalVictories: calculateVictories(teamMatchesFound, query),
    totalDraws: calculateDraws(teamMatchesFound),
    totalLosses: calculateLosses(teamMatchesFound, query),
    goalsFavor: 0,
    goalsOwn: 0,
  };
  teamMatchesFound.map((match: IFullMatch) => {
    console.log(match);
    const points = calculatePoints(teamStats.totalPoints, match, query);
    teamStats.totalPoints = points;
    teamStats.goalsFavor += query === 'home' ? match.homeTeamGoals : match.awayTeamGoals;
    teamStats.goalsOwn += query === 'home' ? match.awayTeamGoals : match.homeTeamGoals;
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
  if (query === 'home') {
    teamMatches = matchesFound.filter((e) => e.homeTeamId === id && e.inProgress === false);
  } else {
    teamMatches = matchesFound.filter((e) => e.awayTeamId === id && e.inProgress === false);
  }
  const teamStats = calculateTeamStats(teamMatches, query);
  return {
    name: query === 'home' ? teamMatches[0].homeTeam.teamName : teamMatches[0].awayTeam.teamName,
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

const getLeaderboard = async (req: Request, res: Response):Promise<void> => {
  const { query } = req.params;
  const { teamsFound } = await teamsService.getTeams();
  const teamsId = teamsFound.map((e) => e.id);
  const teamMatches = await Promise.all(teamsId.map((team) => getTeamMatches(team, query)));
  const pointsOrder = sortLeaderboard(teamMatches);
  res.status(200).json(pointsOrder);
};

// const getGeralLeaderboard = async (req: Request, res: Response):Promise<void> => {
//   const { teamsFound } = await teamsService.getTeams();
//   const teamsId = teamsFound.map((e) => e.id);
//   const teamMatches = await Promise.all(teamsId.map((team) => getTeamMatches(team)));
//   const pointsOrder = sortLeaderboard(teamMatches);
//   res.status(200).json(pointsOrder);
// };

export default {
  getLeaderboard,
  // getGeralLeaderboard,
};
