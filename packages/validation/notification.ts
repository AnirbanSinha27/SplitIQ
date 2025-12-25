export type NotificationEvent =
  | {
      type: 'EXPENSE_CREATED';
      groupId: string;
      actorId: string;
      expenseId: string;
      createdAt: string;
    }
  | {
      type: 'EXPENSE_EDITED';
      groupId: string;
      actorId: string;
      expenseId: string;
      createdAt: string;
    };
