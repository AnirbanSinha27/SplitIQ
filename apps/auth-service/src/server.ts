import path from 'path'
import dotenv from 'dotenv'
import Fastify from 'fastify';
import healthRoutes from './routes/health';
import authRoutes from './routes/auth';
import db from './plugins/db';
import { registerErrorHandler } from '@splitiq/errors';

dotenv.config({
  path: path.resolve(__dirname, '../../../.env'),
});


const fastify = Fastify({
  logger: true,
});

fastify.register(db);
fastify.register(healthRoutes);
fastify.register(authRoutes, { prefix: '/auth' });
registerErrorHandler(fastify);

const start = async () => {
  try {
    await fastify.listen({ port: 3001 });
    console.log('Auth service running on port 3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
