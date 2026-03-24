import { Router } from 'express';
import { validate } from '../../../middlewares/validate-schema.middleware';
import { loginController } from '../controllers/sign-in.controller';
import { signInSchema } from '../schemas/sign-in.schema';
import { validateSessionController } from '../controllers/validate-session.controller';
import { authMiddleware } from '../../../middlewares/auth.middleware';
import { logoutController } from '../controllers/logout.controller';
import { signUpSchema } from '../schemas/sign-up.schema';
import { registerController } from '../controllers/sign-up.controller';
import { meController } from '../controllers/me.controller';
import { activatePlanController } from '../controllers/activate-plan.controller';

const routesAuth = Router();
const AUTH_BASE_PATH = '/auth';

routesAuth.post(AUTH_BASE_PATH + '/signin', validate(signInSchema), loginController);
routesAuth.post(
  AUTH_BASE_PATH + '/validate-session',
  authMiddleware('user'),
  validateSessionController,
);
routesAuth.post(AUTH_BASE_PATH + '/logout', authMiddleware('user'), logoutController);
routesAuth.post(AUTH_BASE_PATH + '/signup', validate(signUpSchema), registerController);
routesAuth.get(AUTH_BASE_PATH + '/me', authMiddleware('user'), meController);
routesAuth.post(AUTH_BASE_PATH + '/activate-plan', authMiddleware('user'), activatePlanController);

export default routesAuth;
