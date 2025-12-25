import '@fastify/multipart';

declare module 'fastify' {
  interface FastifyRequest {
    file(): Promise<MultipartFile | undefined>;
  }
}