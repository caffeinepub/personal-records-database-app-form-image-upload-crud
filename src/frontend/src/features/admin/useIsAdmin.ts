import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

/**
 * Identity-scoped admin check hook that prevents cache leakage between users.
 * Returns admin status for the currently signed-in principal.
 */
export function useIsAdmin() {
  const { actor, isFetching: isActorFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();

  const principalText = identity?.getPrincipal().toString() || null;

  const query = useQuery<boolean>({
    queryKey: ['isAdmin', principalText],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isActorFetching && !!identity && !isInitializing,
    retry: false,
    staleTime: 0, // Always revalidate on identity change
  });

  return {
    ...query,
    isLoading: isActorFetching || isInitializing || query.isLoading,
    isFetched: !!actor && !!identity && !isInitializing && query.isFetched,
  };
}
