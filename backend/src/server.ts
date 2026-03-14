import express from 'express';
import cors from 'cors';
import { HttpStatus } from './constants/api.constants';
import { errorMiddleware } from './middlewares/error.middleware';
import routesAuth from './modules/auth/routes/auth.routes';
// import routesStatus from './modules/status/routes/status.routes';
// import routesActions from './modules/actions/routes/action.routes';

const cookieParser = require('cookie-parser');
const API_PREFIX = '/api';

export const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173', 'https://super-tm-server.vercel.app'],
  }),
);

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use(express.json());
app.use(cookieParser());
app.use(API_PREFIX, routesAuth);
// app.use(API_PREFIX, routesActions);
// app.use(API_PREFIX, routesStatus);

app.use(API_PREFIX, (req, res) => {
  res.status(HttpStatus.NOT_FOUND).json({ message: 'API route not found' });
});

app.use(errorMiddleware);
