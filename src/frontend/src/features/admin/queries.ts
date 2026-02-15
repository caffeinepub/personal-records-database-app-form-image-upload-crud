import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import type { Data } from '../../backend';

export function useAdminRecords(isAuthenticated: boolean) {
  const { actor, isFetching: isActorFetching } = useActor();

  return useQuery<Data[]>({
    queryKey: ['admin-records'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.listAllAdmin();
      } catch (error) {
        console.error('Error fetching admin records:', error);
        throw error;
      }
    },
    enabled: !!actor && !isActorFetching && isAuthenticated,
    retry: false,
  });
}
