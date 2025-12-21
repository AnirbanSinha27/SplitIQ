import Fastify from 'fastify';
import healthRoutes from './routes/health';
import authRoutes from './routes/auth';

const fastify = Fastify({
  logger: true,
});

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
