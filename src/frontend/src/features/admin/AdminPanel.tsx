import { useState, useEffect } from 'react';
import { AdminGate } from './AdminGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield } from 'lucide-react';
import { RecordForm } from '../records/RecordForm';
import { RecordsList } from '../records/RecordsList';
import { RecordDetail } from '../records/RecordDetail';
import { EmptyRecordsState, NoRecordSelectedState } from '../records/emptyStates';
import { useAdminRecords } from './queries';
import { useCreateRecord, useUpdateRecord, useDeleteRecord } from '../records/mutations';
import type { Data } from '../../backend';
import type { RecordFormData } from '../records/types';
import { formDataToBackend, backendToFormData } from '../records/types';
import { ExternalBlob } from '../../backend';
import { PersonalRecordsSection } from './PersonalRecordsSection';
import { useIsAdmin } from './useIsAdmin';

export function AdminPanel() {
  const [selectedRecord, setSelectedRecord] = useState<Data | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const { data: isAdmin } = useIsAdmin();
  const { data: records = [], isLoading, refetch } = useAdminRecords(isAdmin === true);
  const createMutation = useCreateRecord();
  const updateMutation = useUpdateRecord();
  const deleteMutation = useDeleteRecord();

  // Refetch records after mutations to ensure UI is in sync
  useEffect(() => {
    if (createMutation.isSuccess || updateMutation.isSuccess || deleteMutation.isSuccess) {
      refetch();
    }
  }, [createMutation.isSuccess, updateMutation.isSuccess, deleteMutation.isSuccess, refetch]);

  const handleCreate = async (formData: RecordFormData, imageFile?: File) => {
    const newId = Date.now().toString();
    
    let imageBlob: ExternalBlob | undefined;
    if (imageFile) {
      const bytes = new Uint8Array(await imageFile.arrayBuffer());
      imageBlob = ExternalBlob.fromBytes(bytes);
    }
    
    const data = formDataToBackend(formData, imageBlob);
    const createdRecord = await createMutation.mutateAsync({ personId: newId, data, imageFile });
    setIsCreating(false);
    
    // Select the newly created record
    setSelectedRecord(createdRecord);
  };

  const handleUpdate = async (formData: RecordFormData, imageFile?: File) => {
    if (!selectedRecord) return;
    
    let imageBlob: ExternalBlob | undefined;
    if (imageFile) {
      const bytes = new Uint8Array(await imageFile.arrayBuffer());
      imageBlob = ExternalBlob.fromBytes(bytes);
    }
    
    const data = formDataToBackend(formData, imageBlob);
    const personId = selectedRecord.mobileNumber; // Using mobile number as ID
    const updatedRecord = await updateMutation.mutateAsync({ personId, data, imageFile });
    setIsEditing(false);
    
    // Update selected record with the returned data
    setSelectedRecord(updatedRecord);
  };

  const handleDelete = async () => {
    if (!selectedRecord) return;
    const personId = selectedRecord.mobileNumber; // Using mobile number as ID
    await deleteMutation.mutateAsync(personId);
    setSelectedRecord(null);
    setIsEditing(false);
  };

  const handleSelectRecord = (record: Data) => {
    setSelectedRecord(record);
    setIsEditing(false);
    setIsCreating(false);
  };

  return (
    <AdminGate>
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Admin Panel</CardTitle>
            </div>
            <CardDescription>
              Manage records and view personal records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="admin-records" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="admin-records">Admin Records</TabsTrigger>
                <TabsTrigger value="personal-records">Personal Records</TabsTrigger>
              </TabsList>

              <TabsContent value="admin-records" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Records</h3>
                      <button
                        onClick={() => {
                          setIsCreating(true);
                          setIsEditing(false);
                          setSelectedRecord(null);
                        }}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                      >
                        Create New
                      </button>
                    </div>

                    {isLoading ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Loading records...
                      </div>
                    ) : records.length === 0 ? (
                      <EmptyRecordsState />
                    ) : (
                      <RecordsList
                        records={records}
                        selectedRecord={selectedRecord || undefined}
                        onSelect={handleSelectRecord}
                      />
                    )}
                  </div>

                  <div>
                    {isCreating ? (
                      <RecordForm
                        onSubmit={handleCreate}
                        onCancel={() => setIsCreating(false)}
                        isSubmitting={createMutation.isPending}
                      />
                    ) : isEditing && selectedRecord ? (
                      <RecordForm
                        initialData={backendToFormData(selectedRecord)}
                        onSubmit={handleUpdate}
                        onCancel={() => setIsEditing(false)}
                        isSubmitting={updateMutation.isPending}
                      />
                    ) : selectedRecord ? (
                      <RecordDetail
                        record={selectedRecord}
                        onEdit={() => setIsEditing(true)}
                        onDelete={handleDelete}
                        isDeleting={deleteMutation.isPending}
                      />
                    ) : (
                      <NoRecordSelectedState />
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="personal-records">
                <PersonalRecordsSection />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminGate>
  );
}
