import teamsModel from '../database/models/teamsModel';

const getTeams = async () => {
  const teamsFound = await teamsModel.findAll();
  return { status: 200, teamsFound };
};

const findTeam = async (id: string | number) => {
  const teamFound = await teamsModel.findOne({ where: { id } });
  if (!teamFound) {
    return { status: 401, message: 'There is no team with such id!' };
  }
  return { status: 200, teamFound };
};

export default {
  getTeams,
  findTeam,
};
