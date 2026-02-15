import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import type { Data } from '../../backend';
import { ExternalBlob } from '../../backend';
import { toast } from 'sonner';

export function useCreateRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ personId, data, imageFile }: { personId: string; data: Data; imageFile?: File }) => {
      if (!actor) throw new Error('Actor not initialized');

      let finalData = data;

      if (imageFile) {
        const bytes = new Uint8Array(await imageFile.arrayBuffer());
        const blob = ExternalBlob.fromBytes(bytes);
        finalData = { ...data, image: blob };
      }

      return actor.create(personId, finalData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      toast.success('Record created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create record');
      throw error;
    },
  });
}

export function useUpdateRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ personId, data, imageFile }: { personId: string; data: Data; imageFile?: File }) => {
      if (!actor) throw new Error('Actor not initialized');

      let finalData = data;

      if (imageFile) {
        const bytes = new Uint8Array(await imageFile.arrayBuffer());
        const blob = ExternalBlob.fromBytes(bytes);
        finalData = { ...data, image: blob };
      }

      return actor.update(personId, finalData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      toast.success('Record updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update record');
      throw error;
    },
  });
}

export function useDeleteRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (personId: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.delete_(personId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      toast.success('Record deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete record');
    },
  });
}
