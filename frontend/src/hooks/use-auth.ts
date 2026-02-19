import { useAuthStore } from '@/stores/authentication';

export function useAuth() {
  const { user, isLoading, isAuthenticated, fetchUser, signIn, signUp, signOut } =
    useAuthStore();

  const isAdmin = user?.role === 'ADMINISTRATOR';
  const isStudent = user?.role === 'STUDENT';

  return {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    isStudent,
    fetchUser,
    signIn,
    signUp,
    signOut,
  };
}
