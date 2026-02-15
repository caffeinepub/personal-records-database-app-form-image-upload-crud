import { SiCaffeine } from 'react-icons/si';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const appIdentifier = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.hostname) 
    : 'unknown-app';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">Personal Records Database</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your personal information securely</p>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      
      <footer className="border-t border-border bg-card mt-auto">
        <div className="container mx-auto px-4 py-4">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} · Built with <SiCaffeine className="inline h-4 w-4 text-chart-1" /> using{' '}
            <a 
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
