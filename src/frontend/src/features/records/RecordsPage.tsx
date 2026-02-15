import { useState } from 'react';
import { SignInGate } from '../../components/PersonalRecords/SignInGate';
import { usePersonalRecord } from '../personalRecords/queries';
import { useCreatePersonalRecord, useUpdatePersonalRecord, useDeletePersonalRecord } from '../personalRecords/mutations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RecordForm } from './RecordForm';
import { RecordDetail } from './RecordDetail';
import { Plus, Loader2 } from 'lucide-react';
import { formDataToBackend, backendToFormData, type RecordFormData } from './types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function RecordsPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: personalRecord, isLoading } = usePersonalRecord();
  const createMutation = useCreatePersonalRecord();
  const updateMutation = useUpdatePersonalRecord();
  const deleteMutation = useDeletePersonalRecord();

  const handleSubmit = async (formData: RecordFormData, imageFile?: File) => {
    const backendData = formDataToBackend(formData);

    if (personalRecord) {
      await updateMutation.mutateAsync({ data: backendData, imageFile });
    } else {
      await createMutation.mutateAsync({ data: backendData, imageFile });
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync();
    setShowDeleteDialog(false);
  };

  if (isLoading) {
    return (
      <SignInGate>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </SignInGate>
    );
  }

  return (
    <SignInGate>
      <div className="max-w-4xl mx-auto">
        {!personalRecord && !isEditing ? (
          <Card>
            <CardHeader>
              <CardTitle>Your Personal Record</CardTitle>
              <CardDescription>
                You haven't created your personal record yet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border bg-muted/50 p-8 text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Create your personal record to store your information securely.
                </p>
                <Button onClick={() => setIsEditing(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Personal Record
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : isEditing ? (
          <Card>
            <CardHeader>
              <CardTitle>{personalRecord ? 'Edit Personal Record' : 'Create Personal Record'}</CardTitle>
              <CardDescription>
                {personalRecord ? 'Update your personal information' : 'Enter your personal information'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecordForm
                initialData={personalRecord ? backendToFormData(personalRecord) : undefined}
                onSubmit={handleSubmit}
                onCancel={() => setIsEditing(false)}
                isSubmitting={createMutation.isPending || updateMutation.isPending}
              />
            </CardContent>
          </Card>
        ) : personalRecord ? (
          <RecordDetail
            record={personalRecord}
            onEdit={() => setIsEditing(true)}
            onDelete={() => setShowDeleteDialog(true)}
            isDeleting={deleteMutation.isPending}
          />
        ) : null}

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your personal record.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </SignInGate>
  );
}
