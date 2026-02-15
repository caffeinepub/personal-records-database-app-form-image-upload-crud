import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import type { Data } from '../../backend';
import { ExternalBlob } from '../../backend';
import { toast } from 'sonner';

function isAuthorizationError(error: Error): boolean {
  const message = error.message.toLowerCase();
  return message.includes('unauthorized') || 
         message.includes('only admins') || 
         message.includes('permission');
}

export function useCreateRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ personId, data, imageFile }: { personId: string; data: Data; imageFile?: File }) => {
      if (!actor) throw new Error('Actor not initialized');

      let finalData = data;

      if (imageFile) {
        const bytes = new Uint8Array(await imageFile.arrayBuffer());
        const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
          console.log(`Upload progress: ${percentage}%`);
        });
        finalData = { ...data, image: blob };
      }

      return actor.create(personId, finalData);
    },
    onSuccess: (createdRecord) => {
      // Optimistically update the admin cache with the new record
      queryClient.setQueryData<Data[]>(['admin-records'], (oldData) => {
        if (!oldData) return [createdRecord];
        return [...oldData, createdRecord].sort((a, b) => a.name.localeCompare(b.name));
      });
      
      // Still invalidate to ensure consistency with backend
      queryClient.invalidateQueries({ queryKey: ['admin-records'] });
      toast.success('Record created successfully');
    },
    onError: (error: Error) => {
      if (isAuthorizationError(error)) {
        toast.error('You are not authorized to perform this action.');
      } else {
        toast.error(error.message || 'Failed to create record');
      }
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
        const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
          console.log(`Upload progress: ${percentage}%`);
        });
        finalData = { ...data, image: blob };
      }

      return actor.update(personId, finalData);
    },
    onSuccess: (updatedRecord) => {
      // Optimistically update the admin cache with the updated record
      queryClient.setQueryData<Data[]>(['admin-records'], (oldData) => {
        if (!oldData) return [updatedRecord];
        return oldData.map(record => 
          record.mobileNumber === updatedRecord.mobileNumber ? updatedRecord : record
        ).sort((a, b) => a.name.localeCompare(b.name));
      });
      
      // Still invalidate to ensure consistency with backend
      queryClient.invalidateQueries({ queryKey: ['admin-records'] });
      toast.success('Record updated successfully');
    },
    onError: (error: Error) => {
      if (isAuthorizationError(error)) {
        toast.error('You are not authorized to perform this action.');
      } else {
        toast.error(error.message || 'Failed to update record');
      }
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
      queryClient.invalidateQueries({ queryKey: ['admin-records'] });
      toast.success('Record deleted successfully');
    },
    onError: (error: Error) => {
      if (isAuthorizationError(error)) {
        toast.error('You are not authorized to perform this action.');
      } else {
        toast.error(error.message || 'Failed to delete record');
      }
    },
  });
}
