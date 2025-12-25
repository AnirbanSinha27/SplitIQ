import fp from 'fastify-plugin';
import Redis from 'ioredis';

export default fp(async (fastify) => {
  const redis = new Redis({
    host: '127.0.0.1',
    port: 6379,
  });

  fastify.decorate('redis', redis);

  fastify.addHook('onClose', async () => {
    await redis.quit();
  });
});
