import { ReactNode } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsAdmin } from './useIsAdmin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, LogOut, AlertCircle, Loader2 } from 'lucide-react';
import { AuthButton } from '../../components/PersonalRecords/AuthButton';

interface AdminGateProps {
  children: ReactNode;
}

export function AdminGate({ children }: AdminGateProps) {
  const { identity, isInitializing, clear } = useInternetIdentity();
  const { data: isAdmin, isLoading: isCheckingAdmin, error: adminCheckError, isFetched } = useIsAdmin();

  // Show loading state while initializing or checking admin status
  if (isInitializing || (identity && (isCheckingAdmin || !isFetched))) {
    return (
      <div className="max-w-md mx-auto mt-12">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Admin Panel</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Verifying access...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show sign-in prompt if not authenticated
  if (!identity) {
    return (
      <div className="max-w-md mx-auto mt-12">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Admin Panel</CardTitle>
            </div>
            <CardDescription>
              Sign in with Internet Identity to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 py-6">
            <AuthButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied if not admin or error occurred
  if (adminCheckError || isAdmin === false) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Access denied. You are not authorized to access the admin panel.
          </AlertDescription>
        </Alert>
        <div className="mt-4 text-center">
          <Button onClick={clear} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    );
  }

  // Render admin content if authorized
  return <>{children}</>;
}
