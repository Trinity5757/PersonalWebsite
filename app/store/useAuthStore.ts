// Implment if more authentication is like different roles or permissions
// auth js provides an easy way to do this but we can extend 
// app/store/useAuthStore.ts
import { create } from 'zustand';
import { useSession } from 'next-auth/react';

interface AuthStore {
  isAuthenticated: boolean;
  status: 'loading' | 'authenticated' | 'unauthenticated';
}

const useAuthStore = create<AuthStore>(() => {
  const { data: session, status } = useSession();

  return {
    isAuthenticated: !!session,
    status,
  };
});

export default useAuthStore;
