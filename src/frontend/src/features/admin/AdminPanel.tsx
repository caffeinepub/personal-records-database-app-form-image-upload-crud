import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Shield, LogOut, AlertCircle, Plus } from 'lucide-react';
import { useAdminRecords } from './queries';
import { RecordsList } from '../records/RecordsList';
import { RecordDetail } from '../records/RecordDetail';
import { RecordForm } from '../records/RecordForm';
import { NoRecordSelectedState } from '../records/emptyStates';
import { useCreateRecord, useUpdateRecord, useDeleteRecord } from '../records/mutations';
import { formDataToBackend, backendToFormData, type RecordFormData } from '../records/types';
import type { Data } from '../../backend';

export function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<Data | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Data | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const { data: records = [], isLoading, error: queryError } = useAdminRecords(isAuthenticated);
  const createMutation = useCreateRecord();
  const updateMutation = useUpdateRecord();
  const deleteMutation = useDeleteRecord();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!adminId.trim()) {
      setError('Admin ID is required');
      return;
    }

    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    if (adminId === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminId('');
    setPassword('');
    setError('');
    setSelectedRecord(null);
  };

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
      // Update existing record - use the returned data to immediately update the detail view
      const updatedRecord = await updateMutation.mutateAsync({ personId, data: backendData, imageFile });
      setSelectedRecord(updatedRecord);
    } else {
      // Create new record - use the returned data to immediately select and show it
      const createdRecord = await createMutation.mutateAsync({ personId, data: backendData, imageFile });
      setSelectedRecord(createdRecord);
    }

    setIsFormOpen(false);
    setEditingRecord(null);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingRecord(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-12">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Admin Panel</CardTitle>
            </div>
            <CardDescription>
              Enter your admin credentials to access the panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminId">Admin ID</Label>
                <Input
                  id="adminId"
                  type="text"
                  placeholder="Enter admin ID"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full">
                <Shield className="h-4 w-4 mr-2" />
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (queryError) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load records. You are not authorized to access this data.
          </AlertDescription>
        </Alert>
        <div className="mt-4 text-center">
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Admin Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Viewing all records ({records.length} total)
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCreate} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Record
          </Button>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <RecordsList
            records={records}
            isLoading={isLoading}
            selectedRecord={selectedRecord || undefined}
            onSelect={(record) => setSelectedRecord(record)}
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
