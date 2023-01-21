import teamsModel from '../database/models/teamsModel';

const getTeams = async () => {
  const teamsFound = await teamsModel.findAll();
  if (!teamsFound) {
    return { status: 401, message: 'Result not found' };
  }
  return { status: 200, teamsFound };
};

const findTeam = async (id: string) => {
  const teamFound = await teamsModel.findOne({ where: { id } });
  if (!teamFound) {
    return { status: 401, message: 'Result not found' };
  }
  return { status: 200, teamFound };
};

export default {
  getTeams,
  findTeam,
};
