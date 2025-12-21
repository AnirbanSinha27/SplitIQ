import { FastifyInstance } from 'fastify';

const users: { email: string; password: string }[] = [];

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', async (request, reply) => {
    const { email, password } = request.body as any;

    if (!email || !password) {
      return reply.status(400).send({ message: 'Email and password required' });
    }

    const exists = users.find(u => u.email === email);
    if (exists) {
      return reply.status(409).send({ message: 'User already exists' });
    }

    users.push({ email, password });

    return reply.status(201).send({
      message: 'User registered successfully',
    });
  });

  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body as any;

    const user = users.find(
      u => u.email === email && u.password === password
    );

    if (!user) {
      return reply.status(401).send({ message: 'Invalid credentials' });
    }

    return reply.send({
      message: 'Login successful',
    });
  });
}
