type Balance = {
    userId: string;
    balance: number;
  };
  
  type Settlement = {
    from: string;
    to: string;
    amount: number;
  };
  
  export function computeSettlements(
    balances: Balance[]
  ): Settlement[] {
    const creditors = balances
      .filter(b => b.balance > 0)
      .map(b => ({ ...b }));
  
    const debtors = balances
      .filter(b => b.balance < 0)
      .map(b => ({ ...b, balance: Math.abs(b.balance) }));
  
    const settlements: Settlement[] = [];
  
    let i = 0;
    let j = 0;
  
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
  
      const amount = Math.min(debtor.balance, creditor.balance);
  
      settlements.push({
        from: debtor.userId,
        to: creditor.userId,
        amount: Number(amount.toFixed(2)),
      });
  
      debtor.balance -= amount;
      creditor.balance -= amount;
  
      if (debtor.balance === 0) i++;
      if (creditor.balance === 0) j++;
    }
  
    return settlements;
  }
  