import fp from 'fastify-plugin';
import { Pool } from 'pg';
import { URL } from 'url';

export default fp(async (fastify) => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not defined');
  }

  const dbUrl = new URL(databaseUrl);

  const pool = new Pool({
    host: dbUrl.hostname,
    port: 5432,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.replace('/', ''),
    ssl: {
      rejectUnauthorized: false,
    },
  });

  fastify.decorate('db', pool);
});
