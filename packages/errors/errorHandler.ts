import { FastifyInstance } from 'fastify';

export function registerErrorHandler(fastify: FastifyInstance) {
  fastify.setErrorHandler((error, _request, reply) => {
    const statusCode = error.statusCode || 500;

    reply.status(statusCode).send({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  });
}
