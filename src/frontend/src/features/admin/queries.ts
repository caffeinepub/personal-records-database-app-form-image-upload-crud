import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import type { Data } from '../../backend';

export function useAdminRecords(isAdmin: boolean) {
  const { actor, isFetching: isActorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const principalText = identity?.getPrincipal().toString() || null;

  return useQuery<Data[]>({
    queryKey: ['admin-records', principalText],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.listAllAdmin();
      } catch (error) {
        console.error('Error fetching admin records:', error);
        throw error;
      }
    },
    enabled: !!actor && !isActorFetching && !!identity && isAdmin === true,
    retry: false,
  });
}
