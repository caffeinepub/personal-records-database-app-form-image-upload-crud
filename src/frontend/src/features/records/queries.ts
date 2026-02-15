import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import type { Data } from '../../backend';

export function useListRecords() {
  const { actor, isFetching: isActorFetching } = useActor();

  return useQuery<Data[]>({
    queryKey: ['records'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAll();
    },
    enabled: !!actor && !isActorFetching,
  });
}

export function useReadRecord(personId: string | null) {
  const { actor, isFetching: isActorFetching } = useActor();

  return useQuery<Data | null>({
    queryKey: ['record', personId],
    queryFn: async () => {
      if (!actor || !personId) return null;
      try {
        return await actor.read(personId);
      } catch (error) {
        console.error('Error reading record:', error);
        return null;
      }
    },
    enabled: !!actor && !isActorFetching && !!personId,
  });
}
