import { Router } from 'express';
import loginValidate from '../middlewares/loginValidate';
import authToken from '../middlewares/authToken';
import usersController from '../controllers/usersController';

const routers = Router();

routers.get('/validate', authToken, usersController.userRole);
routers.post('/', loginValidate, usersController.findUser);

export default routers;
