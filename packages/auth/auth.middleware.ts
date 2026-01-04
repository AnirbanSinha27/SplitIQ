import { FastifyRequest, FastifyReply } from 'fastify';
import * as jwt from 'jsonwebtoken';
import { TokenExpiredError } from 'jsonwebtoken'

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const accessToken = request.cookies?.accessToken;
  const refreshToken = request.cookies?.refreshToken;

  if (!accessToken) {
    return reply.status(401).send({
      success: false,
      message: 'Unauthorized',
    });
  }

  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_SECRET as string
    );

    request.user = decoded;
    return;
  } catch (err) {
    // 👇 ONLY try refresh if token expired
    if (
      err instanceof TokenExpiredError &&
      refreshToken
    ) {
      try {
        const refreshPayload = jwt.verify(
          refreshToken,
          process.env.JWT_SECRET as string
        ) as any;

        const newAccessToken = jwt.sign(
          {
            userId: refreshPayload.userId,
          },
          process.env.JWT_SECRET as string,
          { expiresIn: '15m' }
        );

        reply.setCookie(
          'accessToken',
          newAccessToken,
          {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
          }
        );

        request.user = {
          userId: refreshPayload.userId,
        };

        return;
      } catch {
        return reply.status(401).send({
          success: false,
          message: 'Invalid refresh token',
        });
      }
    }

    return reply.status(401).send({
      success: false,
      message: 'Invalid or expired token',
    });
  }
}
