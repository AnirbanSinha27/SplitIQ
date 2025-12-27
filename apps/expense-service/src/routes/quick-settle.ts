import { FastifyInstance } from 'fastify';
import { computeSettlements } from '../../../group-service/src/plugins/settlement';

function calculateBalances(
    items: any[],
    paidBy: string
  ) {
    const balances: Record<string, number> = {};
  
    for (const item of items) {
      const share =
        item.amount / item.sharedBy.length;
  
      for (const person of item.sharedBy) {
        balances[person] =
          (balances[person] || 0) - share;
      }
    }
  
    balances[paidBy] =
      (balances[paidBy] || 0) +
      items.reduce((sum, i) => sum + i.amount, 0);
  
    return balances;
  }
  
function toSettlementInput(
    balances: Record<string, number>
  ) {
    return Object.entries(balances).map(
      ([name, balance]) => ({
        userId: name,
        balance,
      })
    );
}
  
export default async function quickSettleRoutes(
  fastify: FastifyInstance
){
  fastify.post(
    '/quick-settle',
    async (request, reply) => {
      const { items, paidBy } = request.body as any;
  
      if (!items || !paidBy) {
        return reply.status(400).send({
          message: 'Invalid input',
        });
      }
  
      const balances = calculateBalances(
        items,
        paidBy
      );
  
      const settlementInput =
        toSettlementInput(balances);
  
      const settlements =
        computeSettlements(settlementInput);
  
      return reply.send({
        balances,
        settlements,
      });
    }
);
}
