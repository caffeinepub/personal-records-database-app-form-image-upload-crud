import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import type { Data } from '../../backend';

export function usePersonalRecord() {
  const { actor, isFetching: isActorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<Data | null>({
    queryKey: ['personal-record'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.readPersonalRecord();
    },
    enabled: !!actor && !isActorFetching && !!identity,
    retry: false,
  });

  return {
    ...query,
    isLoading: isActorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}
