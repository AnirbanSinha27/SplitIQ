import { FastifyRequest, FastifyReply } from 'fastify';
import * as jwt from 'jsonwebtoken';

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const token = request.cookies?.accessToken;

  if (!token) {
    return reply.status(401).send({
      success: false,
      message: 'Unauthorized',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as any;

    request.user = decoded;
  } catch {
    return reply.status(401).send({
      success: false,
      message: 'Invalid or expired token',
    });
  }
}
