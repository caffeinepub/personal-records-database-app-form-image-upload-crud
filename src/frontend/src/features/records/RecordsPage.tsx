import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus } from 'lucide-react';
import { RecordsList } from './RecordsList';
import { RecordDetail } from './RecordDetail';
import { RecordForm } from './RecordForm';
import { NoRecordSelectedState } from './emptyStates';
import { useListRecords } from './queries';
import { useCreateRecord, useUpdateRecord, useDeleteRecord } from './mutations';
import { formDataToBackend, backendToFormData, type RecordFormData } from './types';
import type { Data } from '../../backend';

export function RecordsPage() {
  const [selectedRecord, setSelectedRecord] = useState<Data | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Data | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const { data: records = [], isLoading } = useListRecords();
  const createMutation = useCreateRecord();
  const updateMutation = useUpdateRecord();
  const deleteMutation = useDeleteRecord();

  const handleCreate = () => {
    setEditingRecord(null);
    setIsFormOpen(true);
  };

  const handleEdit = () => {
    if (selectedRecord) {
      setEditingRecord(selectedRecord);
      setIsFormOpen(true);
    }
  };

  const handleDelete = () => {
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedRecord) {
      await deleteMutation.mutateAsync(selectedRecord.mobileNumber);
      setSelectedRecord(null);
      setDeleteConfirmOpen(false);
    }
  };

  const handleFormSubmit = async (formData: RecordFormData, imageFile?: File) => {
    const personId = formData.mobileNumber;
    const backendData = formDataToBackend(formData);

    if (editingRecord) {
      await updateMutation.mutateAsync({ personId, data: backendData, imageFile });
      // Update selected record if it's the one being edited
      if (selectedRecord?.mobileNumber === personId) {
        const updatedRecords = await records;
        const updated = updatedRecords.find(r => r.mobileNumber === personId);
        if (updated) setSelectedRecord(updated);
      }
    } else {
      await createMutation.mutateAsync({ personId, data: backendData, imageFile });
    }

    setIsFormOpen(false);
    setEditingRecord(null);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingRecord(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Records</h2>
          <p className="text-muted-foreground mt-1">
            Manage your personal records database
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          New Record
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <RecordsList
            records={records}
            selectedRecord={selectedRecord || undefined}
            onSelect={setSelectedRecord}
            isLoading={isLoading}
          />
        </div>

        <div className="lg:col-span-2">
          {selectedRecord ? (
            <RecordDetail
              record={selectedRecord}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeleting={deleteMutation.isPending}
            />
          ) : (
            <NoRecordSelectedState />
          )}
        </div>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRecord ? 'Edit Record' : 'Create New Record'}</DialogTitle>
          </DialogHeader>
          <RecordForm
            initialData={editingRecord ? backendToFormData(editingRecord) : undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isSubmitting={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the record for{' '}
              <span className="font-semibold">{selectedRecord?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
