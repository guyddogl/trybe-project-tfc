import { Request, Response } from 'express';
import { IFullMatch } from '../interfaces/IMatch';
import matchesService from '../services/matchesService';
import teamsService from '../services/teamsService';

const calculatePoints = (totalPoints: number, match: IFullMatch): number => {
  if (match.homeTeamGoals > match.awayTeamGoals) return totalPoints + 3;
  if (match.homeTeamGoals < match.awayTeamGoals) return totalPoints + 0;
  return totalPoints + 1;
};

const calculateTeamStats = (teamMatchesFound: any) => {
  const teamStats = {
    totalPoints: 0,
    totalGames: teamMatchesFound.length,
    totalVictories: teamMatchesFound.filter((e: any) => e.homeTeamGoals > e.awayTeamGoals).length,
    totalDraws: teamMatchesFound.filter((e: any) => e.homeTeamGoals === e.awayTeamGoals).length,
    totalLosses: teamMatchesFound.filter((e: any) => e.homeTeamGoals < e.awayTeamGoals).length,
    goalsFavor: 0,
    goalsOwn: 0,
  };
  teamMatchesFound.map((match: any) => {
    const points = calculatePoints(teamStats.totalPoints, match);
    teamStats.totalPoints = points;
    teamStats.goalsFavor += match.homeTeamGoals;
    teamStats.goalsOwn += match.awayTeamGoals;
    return true;
  });
  return teamStats;
};

const calculateEfficiency = (matches: number, points: number) => {
  const efficiency = ((points * 100) / (matches * 3)).toFixed(2);
  return efficiency;
};

const getHomeTeamMatches = async (id: number) => {
  const { matchesFound } = await matchesService.getMatches();
  const teamMatches = matchesFound.filter((e) => e.homeTeamId === id && e.inProgress === false);
  const teamStats = calculateTeamStats(teamMatches);
  return {
    name: teamMatches[0].homeTeam.teamName,
    ...teamStats,
    goalsBalance: teamStats.goalsFavor - teamStats.goalsOwn,
    efficiency: calculateEfficiency(teamMatches.length, teamStats.totalPoints),
  };
};

const getMatches = async (req: Request, res: Response):Promise<void> => {
  const { teamsFound } = await teamsService.getTeams();
  const teamsId = teamsFound.map((e) => e.id);
  const homeTeamMatches = await Promise.all(teamsId.map((team) => getHomeTeamMatches(team)));
  const pointsOrder = homeTeamMatches.sort((a, b) => (
    b.totalPoints - a.totalPoints
    || b.totalVictories - a.totalVictories
    || b.goalsBalance - a.goalsBalance
    || b.goalsFavor - a.goalsFavor
    || a.goalsOwn - b.goalsOwn
  ));
  // const tiebreakerVictories = pointsOrder.sort((a, b) => a.totalVictories - b.totalVictories);
  // const tiebreakerGoalsBalance = tiebreakerVictories
  //   .sort((a, b) => b.goalsBalance - a.goalsBalance);
  // const tiebreakerGoalsFavor = tiebreakerGoalsBalance
  //   .sort((a, b) => b.goalsFavor - a.goalsFavor);
  // const tiebreakerGoalsOwn = tiebreakerGoalsFavor
  //   .sort((a, b) => b.goalsOwn - a.goalsOwn);
  res.status(200).json(pointsOrder);
};

export default {
  getMatches,
};
