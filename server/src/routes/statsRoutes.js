import { Router } from 'express';
import { dashboardStats } from '../controllers/statsController.js';
import { requireAuth } from '../middleware/auth.js';

export const statsRoutes = Router();

statsRoutes.use(requireAuth);
statsRoutes.get('/dashboard', dashboardStats);
