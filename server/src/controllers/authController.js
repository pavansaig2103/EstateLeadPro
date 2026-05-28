import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { get } from '../db/database.js';

function issueToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, { expiresIn: '1d' });
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await get('SELECT * FROM users WHERE email = ?', [email]);

    if (!user || !(await bcrypt.compare(password || '', user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };

    return res.json({ token: issueToken(user), user: safeUser });
  } catch (error) {
    return next(error);
  }
}

export function me(req, res) {
  return res.json({ user: req.user });
}
