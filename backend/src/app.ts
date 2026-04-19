import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';

const app: Express = express();

const corsOptions = {
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routes);

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'CampusKart API is running' });
});

app.get('/api/v1/test-db', async (req: Request, res: Response) => {
  try {
    const { default: prisma } = await import('./config/prisma');
    const count = await prisma.product.count();
    res.json({ 
      status: 'ok', 
      productCount: count,
      db_url_set: !!process.env.DATABASE_URL,
      db_url_start: process.env.DATABASE_URL?.substring(0, 15) + '...'
    });
  } catch (err: any) {
    res.status(500).json({ 
      status: 'database_error', 
      message: err.message,
      stack: err.stack,
      env_db_url: !!process.env.DATABASE_URL
    });
  }
});

app.use(errorHandler);

export default app;
