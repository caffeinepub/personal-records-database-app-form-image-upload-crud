import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import type { Data } from '../../backend';
import { ExternalBlob } from '../../backend';
import { toast } from 'sonner';

function isAuthorizationError(error: Error): boolean {
  const message = error.message.toLowerCase();
  return message.includes('unauthorized') || 
         message.includes('only users') || 
         message.includes('permission');
}

export function useCreatePersonalRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async ({ data, imageFile }: { data: Data; imageFile?: File }) => {
      if (!actor) throw new Error('Actor not initialized');

      let finalData = data;

      if (imageFile) {
        const bytes = new Uint8Array(await imageFile.arrayBuffer());
        const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
          console.log(`Upload progress: ${percentage}%`);
        });
        finalData = { ...data, image: blob };
      }

      return actor.createPersonalRecord(finalData);
    },
    onSuccess: (createdRecord) => {
      const principalText = identity?.getPrincipal().toString() || null;
      // Update the identity-scoped cache with the new record
      queryClient.setQueryData<Data | null>(['personal-record', principalText], createdRecord);
      
      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['personal-record', principalText] });
      toast.success('Personal record created successfully');
    },
    onError: (error: Error) => {
      if (isAuthorizationError(error)) {
        toast.error('You are not authorized to perform this action. Please sign in.');
      } else {
        toast.error(error.message || 'Failed to create personal record');
      }
      throw error;
    },
  });
}

export function useUpdatePersonalRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async ({ data, imageFile }: { data: Data; imageFile?: File }) => {
      if (!actor) throw new Error('Actor not initialized');

      let finalData = data;

      if (imageFile) {
        const bytes = new Uint8Array(await imageFile.arrayBuffer());
        const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
          console.log(`Upload progress: ${percentage}%`);
        });
        finalData = { ...data, image: blob };
      }

      return actor.updatePersonalRecord(finalData);
    },
    onSuccess: (updatedRecord) => {
      const principalText = identity?.getPrincipal().toString() || null;
      // Update the identity-scoped cache with the updated record
      queryClient.setQueryData<Data | null>(['personal-record', principalText], updatedRecord);
      
      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['personal-record', principalText] });
      toast.success('Personal record updated successfully');
    },
    onError: (error: Error) => {
      if (isAuthorizationError(error)) {
        toast.error('You are not authorized to perform this action. Please sign in.');
      } else {
        toast.error(error.message || 'Failed to update personal record');
      }
      throw error;
    },
  });
}

export function useDeletePersonalRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deletePersonalRecord();
    },
    onSuccess: () => {
      const principalText = identity?.getPrincipal().toString() || null;
      // Clear the personal record from identity-scoped cache
      queryClient.setQueryData<Data | null>(['personal-record', principalText], null);
      queryClient.invalidateQueries({ queryKey: ['personal-record', principalText] });
      toast.success('Personal record deleted successfully');
    },
    onError: (error: Error) => {
      if (isAuthorizationError(error)) {
        toast.error('You are not authorized to perform this action. Please sign in.');
      } else {
        toast.error(error.message || 'Failed to delete personal record');
      }
    },
  });
}
