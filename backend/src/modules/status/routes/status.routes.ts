import { Router } from 'express';
import { statusController } from '../controllers/status.controller';

const routesStatus = Router();
const PROFILE_BASE_PATH = '/status';

routesStatus.post(PROFILE_BASE_PATH, statusController);

export default routesStatus;
