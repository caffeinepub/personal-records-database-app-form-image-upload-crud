import React from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthButton } from './AuthButton';
import { Lock } from 'lucide-react';

interface SignInGateProps {
  children: React.ReactNode;
}

export function SignInGate({ children }: SignInGateProps) {
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <Lock className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Sign In Required</CardTitle>
            </div>
            <CardDescription>
              Please sign in to view and manage your personal record
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border border-border bg-muted/50 p-6 text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Your personal information is securely stored and only accessible to you.
              </p>
              <p className="text-sm text-muted-foreground">
                Sign in with Internet Identity to access your personal record.
              </p>
            </div>
            <div className="flex justify-center">
              <AuthButton />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
