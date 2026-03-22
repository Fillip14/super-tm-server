import { Router } from 'express';
import { validate } from '../../../middlewares/validate-schema.middleware';
import { loginController } from '../controllers/sign-in.controller';
import { signInSchema } from '../schemas/sign-in.schema';
import { verifySessionController } from '../controllers/verify-session.controller';
import { verifyTokenController } from '../controllers/verify-token.controller';
import { authMiddleware } from '../../../middlewares/auth.middleware';
import { logoutController } from '../controllers/logout.controller';
import { signUpSchema } from '../schemas/sign-up.schema';
import { registerController } from '../controllers/sign-up.controller';
import { meController } from '../controllers/me.controller';
import { activatePlanController } from '../controllers/activate-plan.controller';

const routesAuth = Router();
const AUTH_BASE_PATH = '/auth';

routesAuth.post(AUTH_BASE_PATH + '/signin', validate(signInSchema), loginController);
routesAuth.get(
  AUTH_BASE_PATH + '/verify-token',
  authMiddleware('user', true),
  verifyTokenController,
);
routesAuth.post(
  AUTH_BASE_PATH + '/verify-session',
  authMiddleware('user'),
  verifySessionController,
);
routesAuth.post(AUTH_BASE_PATH + '/logout', authMiddleware('user', true), logoutController);
routesAuth.post(AUTH_BASE_PATH + '/signup', validate(signUpSchema), registerController);
routesAuth.get(AUTH_BASE_PATH + '/me', authMiddleware('user', true), meController);
routesAuth.post(
  AUTH_BASE_PATH + '/activate-plan',
  authMiddleware('user', true),
  activatePlanController,
);

export default routesAuth;
