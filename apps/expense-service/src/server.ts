import path from 'path';
import dotenv from 'dotenv';
import { registerErrorHandler } from '@splitiq/errors';

dotenv.config({
  path: path.resolve(__dirname, '../../../.env'),
});

import Fastify from 'fastify';
import db from './plugins/db';
import healthRoutes from './routes/health';
import expenseRoutes from './routes/expense';
import redis from './plugins/redis';
import  rateLimit  from '@fastify/rate-limit';

const fastify = Fastify({ logger: true });
fastify.register(rateLimit, {
  max: 100,        // requests
  timeWindow: '1 minute',
});
registerErrorHandler(fastify);

fastify.register(db);
fastify.register(healthRoutes);
fastify.register(expenseRoutes, { prefix: '/expenses' });
fastify.register(redis);


const start = async () => {
  try {
    await fastify.listen({ port: 3003 });
    console.log('Expense service running on port 3003');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
