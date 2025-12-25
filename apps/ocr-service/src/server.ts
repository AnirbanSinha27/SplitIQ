import Fastify from 'fastify';
import multipart from '@fastify/multipart';
import ocrRoutes from './routes/ocr';

const fastify = Fastify({ logger: true });

async function start() {
  try {
    await fastify.register(multipart as any);
    await fastify.register(ocrRoutes, { prefix: '/ocr' });

    await fastify.listen({ port: 3005 });
    console.log('🧠 OCR service running on port 3005');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();