import { Request, Response } from 'express';
import usersService from '../services/usersService';

const findUser = async (req: Request, res: Response):Promise<void> => {
  const { email, password } = req.body;
  const { status, message } = await usersService.findUser(email, password);
  if (status === 200) {
    res.status(status).json({ token: message });
  } else res.status(status).json({ message });
};

const userRole = async (req: Request, res: Response) => {
  const { role } = req.body.user;
  res.status(200).json({ role });
};

export default {
  findUser,
  userRole,
};
