import { Router } from 'express';
import { statusController } from '../controllers/status.controller';
import { botAuthMiddleware } from '../../../middlewares/bot-auth.middleware';

const routesStatus = Router();
const PROFILE_BASE_PATH = '/status';

routesStatus.post(PROFILE_BASE_PATH, botAuthMiddleware, statusController);

export default routesStatus;
