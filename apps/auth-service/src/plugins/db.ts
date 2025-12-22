require('dotenv').config({path:'../../../.env.development'});

import fp from 'fastify-plugin';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default fp(async (fastify) => {
  fastify.decorate('db', pool);
});
