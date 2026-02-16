import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import type { Data } from '../../backend';
import type { Principal } from '@icp-sdk/core/principal';

export function useListAllPersonalRecordsAdmin(isAdmin: boolean) {
  const { actor, isFetching: isActorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const principalText = identity?.getPrincipal().toString() || null;

  return useQuery<Array<[Principal, Data]>>({
    queryKey: ['admin-personal-records', principalText],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listAllPersonalRecordsAdmin();
    },
    enabled: !!actor && !isActorFetching && !!identity && isAdmin === true,
    retry: false,
  });
}

export function useGetPersonalRecordByUserAdmin(user: Principal | null, isAdmin: boolean) {
  const { actor, isFetching: isActorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const principalText = identity?.getPrincipal().toString() || null;

  return useQuery<Data | null>({
    queryKey: ['admin-personal-record', principalText, user?.toString()],
    queryFn: async () => {
      if (!actor || !user) return null;
      return actor.getPersonalRecordByUserAdmin(user);
    },
    enabled: !!actor && !isActorFetching && !!identity && !!user && isAdmin === true,
    retry: false,
  });
}
