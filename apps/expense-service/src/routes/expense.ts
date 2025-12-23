import { FastifyInstance } from 'fastify';
import { authMiddleware } from '@splitiq/auth';

export default async function expenseRoutes(fastify: FastifyInstance) {

  fastify.post(
    '/',
    { preHandler: authMiddleware },
    async (request, reply) => {
      const {
        groupId,
        title,
        paidBy,
        totalAmount,
        splitType,
        participants,
        splits,
      } = request.body as any;

      const userId = request.user.userId;

      if (!groupId || !title || !paidBy || !totalAmount || !splitType) {
        return reply.status(400).send({ message: 'Missing required fields' });
      }

      // 🔐 Start transaction
      const client = await fastify.db.connect();
      try {
        await client.query('BEGIN');

        // 1️⃣ Create expense
        const expenseRes = await client.query(
          `INSERT INTO expenses (group_id, created_by, title)
           VALUES ($1, $2, $3)
           RETURNING id`,
          [groupId, userId, title]
        );

        const expenseId = expenseRes.rows[0].id;

        // 2️⃣ Create version
        const versionRes = await client.query(
          `INSERT INTO expense_versions
           (expense_id, total_amount, paid_by)
           VALUES ($1, $2, $3)
           RETURNING id`,
          [expenseId, totalAmount, paidBy]
        );

        const versionId = versionRes.rows[0].id;

        // 3️⃣ Compute splits
        let computedSplits: { userId: string; amount: number }[] = [];

        if (splitType === 'EQUAL') {
          if (!participants || participants.length === 0) {
            throw new Error('Participants required for equal split');
          }

          const base = Math.floor((totalAmount / participants.length) * 100) / 100;
          let remainder = totalAmount - base * participants.length;

          computedSplits = participants.map((u: string, i: number) => {
            let amt = base;
            if (i === participants.length - 1) {
              amt += remainder;
            }
            return { userId: u, amount: amt };
          });
        }

        if (splitType === 'CUSTOM') {
          if (!splits || splits.length === 0) {
            throw new Error('Splits required for custom split');
          }

          const sum = splits.reduce(
            (acc: number, s: any) => acc + s.amount,
            0
          );

          if (sum !== totalAmount) {
            throw new Error('Split amounts do not match total');
          }

          computedSplits = splits;
        }

        // 4️⃣ Insert splits
        for (const s of computedSplits) {
          await client.query(
            `INSERT INTO expense_splits
             (expense_version_id, user_id, amount_owed)
             VALUES ($1, $2, $3)`,
            [versionId, s.userId, s.amount]
          );
        }

        // 5️⃣ Update current version
        await client.query(
          `UPDATE expenses
           SET current_version_id = $1
           WHERE id = $2`,
          [versionId, expenseId]
        );

        await client.query('COMMIT');

        return reply.status(201).send({
          expenseId,
          versionId,
        });

      } catch (err: any) {
        await client.query('ROLLBACK');
        return reply.status(400).send({
          message: err.message || 'Failed to create expense',
        });
      } finally {
        client.release();
      }
    }
  );
}
