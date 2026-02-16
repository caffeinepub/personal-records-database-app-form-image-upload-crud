import React from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Loader2 } from 'lucide-react';

export function AuthButton() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      // Clear all identity-scoped queries to prevent cache leakage
      queryClient.removeQueries({ queryKey: ['isAdmin'] });
      queryClient.removeQueries({ queryKey: ['admin-records'] });
      queryClient.removeQueries({ queryKey: ['admin-personal-records'] });
      queryClient.removeQueries({ queryKey: ['admin-personal-record'] });
      queryClient.removeQueries({ queryKey: ['personal-record'] });
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <Button
      onClick={handleAuth}
      disabled={isLoggingIn}
      variant={isAuthenticated ? 'outline' : 'default'}
      size="lg"
    >
      {isLoggingIn ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Logging in...
        </>
      ) : isAuthenticated ? (
        <>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </>
      ) : (
        <>
          <LogIn className="h-4 w-4 mr-2" />
          Sign In
        </>
      )}
    </Button>
  );
}
