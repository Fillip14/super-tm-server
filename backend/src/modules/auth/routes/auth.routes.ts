import { Router } from 'express';
import { validate } from '../../../middlewares/validate-schema.middleware';
import { loginController } from '../controllers/sign-in.controller';
import { signInSchema } from '../schemas/sign-in.schema';
import { verifySessionController } from '../controllers/verify-session.controller';
import { authMiddleware } from '../../../middlewares/auth.middleware';
import { logoutController } from '../controllers/logout.controller';
import { signUpSchema } from '../schemas/sign-up.schema';
import { registerController } from '../controllers/sign-up.controller';

const routesAuth = Router();
const AUTH_BASE_PATH = '/auth';

routesAuth.post(AUTH_BASE_PATH + '/signin', validate(signInSchema), loginController);
routesAuth.post(
  AUTH_BASE_PATH + '/verify-session',
  authMiddleware('user'),
  verifySessionController,
);
routesAuth.post(AUTH_BASE_PATH + '/logout', authMiddleware('user', true), logoutController);
routesAuth.post(AUTH_BASE_PATH + '/signup', validate(signUpSchema), registerController);

export default routesAuth;
