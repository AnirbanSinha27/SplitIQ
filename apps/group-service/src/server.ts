import path from 'path';
import dotenv from 'dotenv';

dotenv.config({
  path: path.resolve(__dirname, '../../../.env'),
});

import Fastify from 'fastify';
import db from './plugins/db';
import healthRoutes from './routes/health';
import groupRoutes from './routes/group';

const fastify = Fastify({ logger: true });

fastify.register(db);
fastify.register(healthRoutes);
fastify.register(groupRoutes, { prefix: '/groups' });

fastify.listen({ port: 3002 });
