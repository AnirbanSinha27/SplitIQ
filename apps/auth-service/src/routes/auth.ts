import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const users: {
  email: string;
  password: string;
}[] = [];

const JWT_SECRET = 'dev-secret';

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
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    users.push({
      email,
      password: hashedPassword,
    });
  
    return reply.status(201).send({
      message: 'User registered successfully',
    });
  });
  

  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body as any;
  
    const user = users.find(u => u.email === email);
    if (!user) {
      return reply.status(401).send({ message: 'Invalid credentials' });
    }
  
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return reply.status(401).send({ message: 'Invalid credentials' });
    }
  
    const accessToken = jwt.sign(
      { email },
      JWT_SECRET,
      { expiresIn: '15m' }
    );
  
    const refreshToken = jwt.sign(
      { email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  
    return reply.send({
      message: 'Login successful',
      accessToken,
      refreshToken,
    });
  });  
}
