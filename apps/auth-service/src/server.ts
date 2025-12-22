import path from 'path'
import dotenv from 'dotenv'
import Fastify from 'fastify';
import healthRoutes from './routes/health';
import authRoutes from './routes/auth';
import db from './plugins/db';

dotenv.config({
  path: path.resolve(__dirname, '../../../.env'),
});

console.log('CWD:', process.cwd());
console.log('DATABASE_URL:', process.env.DATABASE_URL);

const fastify = Fastify({
  logger: true,
});

fastify.register(db);
fastify.register(healthRoutes);
fastify.register(authRoutes, { prefix: '/auth' });

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
