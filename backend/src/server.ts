import express from 'express';
import { HttpStatus } from './constants/api.constants';
import { errorMiddleware } from './middlewares/error.middleware';
import routesStatus from './modules/status/routes/status.routes';

const cookieParser = require('cookie-parser');
const API_PREFIX = '/api';

export const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(API_PREFIX, routesStatus);

app.use(API_PREFIX, (req, res) => {
  res.status(HttpStatus.NOT_FOUND).json({ message: 'API route not found' });
});

app.use(errorMiddleware);
