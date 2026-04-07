import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import playerRoutes from './routes/players';
import seasonRoutes from './routes/seasons';
import matchRoutes from './routes/matches';
import statsRoutes from './routes/stats';

const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/seasons', seasonRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/stats', statsRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

export default app;
