import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';

const app: Express = express();

// Global middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup routes
app.use('/api/v1', routes);

// Health Check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'CampusKart API is running' });
});

// Global Error handler intercepting all errors propagated to next()
app.use(errorHandler);

export default app;
