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

const fastify = Fastify({ logger: true });
registerErrorHandler(fastify);

fastify.register(db);
fastify.register(healthRoutes);
fastify.register(expenseRoutes, { prefix: '/expenses' });
fastify.register(redis);


fastify.listen({ port: 3003 });
