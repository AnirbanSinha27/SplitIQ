import { FastifyInstance } from 'fastify';
import { authMiddleware } from '@splitiq/auth';
import { createGroupSchema, inviteMemberSchema } from '@splitiq/validation';
import { registerErrorHandler } from '@splitiq/errors';

export default async function groupRoutes(fastify: FastifyInstance) {

  /**
   * CREATE GROUP
   * - Authenticated user
   * - Creator becomes ADMIN
   */
  fastify.post(
    '/',
    { preHandler: authMiddleware },
    async (request, reply) => {
      const parsed = createGroupSchema.safeParse(request.body);

      if (!parsed.success) {
        return reply.status(400).send({
          success: false,
          message: parsed.error.issues[0].message,
        });
      }

      const { name } = parsed.data;
      const userId = request.user.userId;

      const groupResult = await fastify.db.query(
        `INSERT INTO groups (name, created_by)
         VALUES ($1, $2)
         RETURNING id, name`,
        [name, userId]
      );

      const groupId = groupResult.rows[0].id;

      await fastify.db.query(
        `INSERT INTO group_members (user_id, group_id, role)
         VALUES ($1, $2, $3)`,
        [userId, groupId, 'admin']
      );

      return reply.status(201).send({
        groupId,
        name: groupResult.rows[0].name,
        role: 'admin',
      });
    }
  );

  /**
   * INVITE MEMBER (ADMIN ONLY)
   */
  fastify.post(
    '/:groupId/invite',
    { preHandler: authMiddleware },
    async (request, reply) => {
      const { groupId } = request.params as { groupId: string };
      const parsed = inviteMemberSchema.safeParse(request.body);

      if (!parsed.success) {
        return reply.status(400).send({
          success: false,
          message: parsed.error.issues[0].message,
        });
      }

      const { email } = parsed.data;
      const inviterId = request.user.userId;

      // Check inviter role
      const roleCheck = await fastify.db.query(
        `SELECT role FROM group_members
         WHERE user_id = $1 AND group_id = $2`,
        [inviterId, groupId]
      );

      if (roleCheck.rows[0]?.role !== 'admin') {
        return reply.status(403).send({
          message: 'Only admins can invite members',
        });
      }

      // Check if user exists
      const userResult = await fastify.db.query(
        `SELECT id FROM users WHERE email = $1`,
        [email]
      );

      if (userResult.rows.length === 0) {
        return reply.status(404).send({ message: 'User not found' });
      }

      const invitedUserId = userResult.rows[0].id;

      // Prevent duplicate membership
      const existingMember = await fastify.db.query(
        `SELECT id FROM group_members
         WHERE user_id = $1 AND group_id = $2`,
        [invitedUserId, groupId]
      );

      if (existingMember.rows.length > 0) {
        return reply.status(409).send({
          message: 'User already a member of this group',
        });
      }

      await fastify.db.query(
        `INSERT INTO group_members (user_id, group_id, role)
         VALUES ($1, $2, $3)`,
        [invitedUserId, groupId, 'member']
      );

      return reply.send({
        message: 'User added to group successfully',
      });
    }
  );

  /**
   * LIST GROUPS FOR CURRENT USER
   */
  fastify.get(
    '/',
    { preHandler: authMiddleware },
    async (request) => {
      const userId = request.user.userId;

      const groups = await fastify.db.query(
        `SELECT g.id, g.name, gm.role
         FROM groups g
         JOIN group_members gm ON g.id = gm.group_id
         WHERE gm.user_id = $1`,
        [userId]
      );

      return groups.rows;
    }
  );
}
