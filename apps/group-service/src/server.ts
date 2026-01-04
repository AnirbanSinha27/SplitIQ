import path from 'path';
import dotenv from 'dotenv';
import { registerErrorHandler } from '@splitiq/errors';

dotenv.config({
  path: path.resolve(__dirname, '../../../.env'),
});

import Fastify from 'fastify';
import db from './plugins/db';
import healthRoutes from './routes/health';
import groupRoutes from './routes/group';
import redis from './plugins/redis';
import rateLimit from '@fastify/rate-limit';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie'

const fastify = Fastify({ logger: true });
fastify.register(rateLimit, {
  max: 100,        // requests
  timeWindow: '1 minute',
});
registerErrorHandler(fastify);

fastify.register(cookie);

//cors
fastify.register(cors, {
  origin: 'http://localhost:3000',
  credentials: true,
});

fastify.register(db);
fastify.register(redis);
fastify.register(healthRoutes);
fastify.register(groupRoutes, { prefix: '/groups' });

const start = async () => {
  try {
    await fastify.listen({ port: 3002 });
    console.log('Group service running on port 3002');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
