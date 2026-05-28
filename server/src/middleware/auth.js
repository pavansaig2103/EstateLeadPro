import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { get } from '../db/database.js';

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: 'Authentication token required.' });
    }

    const payload = jwt.verify(token, config.jwtSecret);
    const user = await get('SELECT id, name, email, role, createdAt FROM users WHERE id = ?', [payload.id]);

    if (!user) {
      return res.status(401).json({ message: 'Invalid authentication token.' });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired authentication token.' });
  }
}
