import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '@splitiq/auth';



export default async function authRoutes(fastify: FastifyInstance) {

  // --------------------
  // REGISTER
  // --------------------
  fastify.post('/register', async (request, reply) => {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    if (!email || !password) {
      return reply.status(400).send({ message: 'Email and password required' });
    }

    // check if user exists
    const existingUser = await fastify.db.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return reply.status(409).send({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await fastify.db.query(
      'INSERT INTO users (email, password) VALUES ($1, $2)',
      [email, hashedPassword]
    );

    return reply.status(201).send({
      message: 'User registered successfully',
    });
  });

  // --------------------
  // LOGIN
  // --------------------
  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };
  
    const result = await fastify.db.query(
      'SELECT id, email, password FROM users WHERE email = $1',
      [email]
    );
  
    const user = result.rows[0];
  
    if (!user) {
      return reply
        .status(401)
        .send({ message: 'Invalid credentials' });
    }
  
    const isValid = await bcrypt.compare(
      password,
      user.password
    );
  
    if (!isValid) {
      return reply
        .status(401)
        .send({ message: 'Invalid credentials' });
    }
  
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '15m' }
    );
  
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );
  
    // ✅ SET COOKIES (THIS IS THE KEY PART)
    reply
      .setCookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
      })
      .setCookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
      });
  
    return reply.send({
      message: 'Login successful',
    });
  });
  

  // --------------------
  // ME (PROTECTED)
  // --------------------
  fastify.get(
    '/me',
    { preHandler: authMiddleware },
    async (request) => {
      return {
        user: request.user,
      };
    }
  );
}
