import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'dev_estateleads_secret_change_me',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  dbFile: process.env.DB_FILE || './data/estateleads.db'
};
