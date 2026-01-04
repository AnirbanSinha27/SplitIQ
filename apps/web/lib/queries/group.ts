import { useQuery } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch, GROUP_API } from '../api';

export type Balance = {
  user_id: string;
  balance: number;
};

export function useGroups() {
  return useQuery({
    queryKey: ['groups'],
    queryFn: () =>
      apiFetch<
        { id: string; name: string }[]
      >(GROUP_API!, '/groups'),
  });
}

export function useGroupBalances(groupId: string) {
  return useQuery<Balance[]>({
    queryKey: ['group-balances', groupId],
    queryFn: async () => {
      const data = await apiFetch<
        {
          user_id: string;
          balance: string;
        }[]
      >(GROUP_API!, `/groups/${groupId}/balances`);

      return data.map((item) => ({
        user_id: item.user_id,
        balance: Number(item.balance),
      }));
    },
    enabled: !!groupId,
  });
}


export function useGroupSettlements(groupId: string) {
  return useQuery({
    queryKey: ['group-settlements', groupId],
    queryFn: () =>
      apiFetch<
        {
          from: string;
          to: string;
          amount: number;
        }[]
      >(
        GROUP_API!,
        `/groups/${groupId}/settlements`
      ),
    enabled: !!groupId,
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      return apiFetch(
        GROUP_API!,
        '/groups',
        {
          method: 'POST',
          body: JSON.stringify({ name }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['groups'],
      });
    },
  });
}

/**
 * INVITE MEMBER
 */
export function useInviteMember(groupId: string) {
  return useMutation({
    mutationFn: async (email: string) => {
      return apiFetch(
        GROUP_API!,
        `/groups/${groupId}/invite`,
        {
          method: 'POST',
          body: JSON.stringify({ email }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    },
  });
}
