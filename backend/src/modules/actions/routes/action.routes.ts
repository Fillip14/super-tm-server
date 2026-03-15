import { Router } from 'express';
import { pendingActionsController, postActionController } from '../controllers/actions.controller';
import { botAuthMiddleware } from '../../../middlewares/bot-auth.middleware';

const routesActions = Router();
const PROFILE_BASE_PATH = '/actions';

routesActions.get(`${PROFILE_BASE_PATH}/pending`, botAuthMiddleware, pendingActionsController);
routesActions.post(`${PROFILE_BASE_PATH}/:category/:action`, postActionController);

export default routesActions;
