export async function handleExpenseEvent(event: any) {
    switch (event.type) {
      case 'EXPENSE_CREATED':
        console.log(
          `🔔 Expense created in group ${event.groupId}`
        );
        break;
  
      case 'EXPENSE_EDITED':
        console.log(
          `🔔 Expense edited in group ${event.groupId}`
        );
        break;
  
      default:
        console.log('Unknown event', event.type);
    }
  }
  