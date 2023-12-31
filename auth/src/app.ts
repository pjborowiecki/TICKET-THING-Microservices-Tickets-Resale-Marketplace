import 'express-async-errors';

import express, {
  type Application,
  type Request,
  type Response,
} from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import helmet from 'helmet';
import cors from 'cors';

import { config } from './config/index';

import { authRouter } from './routes/v1/auth.route';

import { xss } from './middleware/xss.middleware';
import { rateLimiter } from './middleware/rate-limiter.middleware';
import { errorHandler } from './middleware/error-handler.middleware';
import { compressionFilter } from './lib/compression-filter.lib';
import { NotFoundError } from './lib/errors.lib';

const app: Application = express();

app.set('trustProxy', 1);

app.use(helmet());
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  }),
);
app.use(xss());
app.use(cookieParser());
app.use(compression({ filter: compressionFilter }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: String(config.cors.origin).split('|'),
    credentials: true,
  }),
);

if (config.node_env === 'production') {
  app.use('/api/v1/auth', rateLimiter);
}

app.use('/api/v1/auth', authRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.all('*', async (_req: Request, _res: Response) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
