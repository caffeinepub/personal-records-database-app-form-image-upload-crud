import { useState, useEffect } from 'react';
import { RecordsPage } from './features/records/RecordsPage';
import { AdminPanel } from './features/admin/AdminPanel';
import { AppLayout } from './components/AppLayout';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft } from 'lucide-react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useIsAdmin } from './features/admin/useIsAdmin';

function App() {
  const [view, setView] = useState<'records' | 'admin'>('records');
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsAdmin();

  // Reset to records view when admin status becomes false or identity changes
  useEffect(() => {
    if (!isInitializing && !isCheckingAdmin) {
      if (isAdmin === false && view === 'admin') {
        setView('records');
      }
    }
  }, [isAdmin, isInitializing, isCheckingAdmin, view]);

  const headerAction = (
    <div className="flex items-center gap-2">
      {view === 'admin' ? (
        <Button
          onClick={() => setView('records')}
          variant="outline"
          size="sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Records
        </Button>
      ) : (
        identity && isAdmin === true && (
          <Button
            onClick={() => setView('admin')}
            variant="outline"
            size="sm"
          >
            <Shield className="h-4 w-4 mr-2" />
            Admin Panel
          </Button>
        )
      )}
    </div>
  );

  return (
    <AppLayout headerAction={headerAction}>
      {view === 'admin' ? <AdminPanel /> : <RecordsPage />}
      <Toaster />
    </AppLayout>
  );
}

export default App;
