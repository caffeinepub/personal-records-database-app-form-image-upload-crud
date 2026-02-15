import { RecordsPage } from './features/records/RecordsPage';
import { AppLayout } from './components/AppLayout';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <AppLayout>
      <RecordsPage />
      <Toaster />
    </AppLayout>
  );
}

export default App;
