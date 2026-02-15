import { useState } from 'react';
import { RecordsPage } from './features/records/RecordsPage';
import { AdminPanel } from './features/admin/AdminPanel';
import { AppLayout } from './components/AppLayout';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft } from 'lucide-react';

function App() {
  const [view, setView] = useState<'records' | 'admin'>('records');

  return (
    <AppLayout
      headerAction={
        view === 'records' ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setView('admin')}
          >
            <Shield className="h-4 w-4 mr-2" />
            Admin Panel
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setView('records')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Records
          </Button>
        )
      }
    >
      {view === 'records' ? <RecordsPage /> : <AdminPanel />}
      <Toaster />
    </AppLayout>
  );
}

export default App;
