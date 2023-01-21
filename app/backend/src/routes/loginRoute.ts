import { Router } from 'express';
import loginValidate from '../middlewares/loginValidate';
import usersController from '../controllers/usersController';

const routers = Router();

routers.post('/', loginValidate, usersController.findUser);
routers.get('/validate', loginValidate, usersController.findUser);

export default routers;
