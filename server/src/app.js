import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { config } from './config.js';
import { authRoutes } from './routes/authRoutes.js';
import { leadRoutes } from './routes/leadRoutes.js';
import { statsRoutes } from './routes/statsRoutes.js';

export const app = express();

app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'EstateLead Pro API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/stats', statsRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Something went wrong on the server.' });
});
