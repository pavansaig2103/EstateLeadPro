import { Router } from 'express';
import { createLead, deleteLead, getLead, listLeads, updateLead } from '../controllers/leadController.js';
import { requireAuth } from '../middleware/auth.js';

export const leadRoutes = Router();

leadRoutes.use(requireAuth);
leadRoutes.get('/', listLeads);
leadRoutes.get('/:id', getLead);
leadRoutes.post('/', createLead);
leadRoutes.put('/:id', updateLead);
leadRoutes.delete('/:id', deleteLead);
