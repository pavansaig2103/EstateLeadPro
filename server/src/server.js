import { app } from './app.js';
import { config } from './config.js';
import { migrate } from './db/database.js';
import { seedDatabase } from './db/seed.js';

async function start() {
  await migrate();
  await seedDatabase();
  app.listen(config.port, () => {
    console.log(`EstateLead Pro API running on http://localhost:${config.port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
