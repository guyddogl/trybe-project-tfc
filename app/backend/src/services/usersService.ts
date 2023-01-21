import * as bcrypt from 'bcryptjs';
import IResponse from '../interfaces/IResponse';
import usersModel from '../database/models/usersModel';
import token from '../utils/token';

const findUser = async (email: string, password: string): Promise<IResponse> => {
  const userFound = await usersModel.findOne({ where: { email } });
  if (!userFound) {
    return { status: 401, message: 'Incorrect email or password' };
  }
  const checkPassword = await bcrypt.compare(password, userFound.dataValues.password);
  if (checkPassword === false) {
    return { status: 401, message: 'Incorrect email or password' };
  }
  const userToken = await token.generateToken(userFound.dataValues);
  return { status: 200, message: userToken };
};

const userRole = async (email: string): Promise<IResponse> => {
  const userFound = await usersModel.findOne({ where: { email } });
  if (!userFound) {
    return { status: 401, message: 'User not found' };
  }
  return { status: 200, message: userFound.dataValues.role };
};

export default {
  findUser,
  userRole,
};
