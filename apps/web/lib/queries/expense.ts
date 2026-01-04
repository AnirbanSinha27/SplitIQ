import { useQuery } from '@tanstack/react-query';
import { apiFetch, EXPENSE_API } from '../api';

export function useExpenseHistory(expenseId: string) {
  return useQuery({
    queryKey: ['expense-history', expenseId],
    queryFn: () =>
      apiFetch(
        EXPENSE_API!,
        `/expenses/${expenseId}/history`
      ),
    enabled: !!expenseId,
  });
}

export function useExpenseDraft(draftId: string) {
  return useQuery({
    queryKey: ['expense-draft', draftId],
    queryFn: () =>
      apiFetch(
        EXPENSE_API!,
        `/expenses/draft/${draftId}`
      ),
    enabled: !!draftId,
  });
}
