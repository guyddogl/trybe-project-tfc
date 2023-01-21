import * as jwt from 'jsonwebtoken';
import IUser from '../interfaces/IUser';

const secret = 'jwt_secret';

const generateToken = (data: IUser) => {
  const token = jwt.sign(data, secret, { algorithm: 'HS256', expiresIn: '360min' });
  return token;
};

export default {
  generateToken,
};
