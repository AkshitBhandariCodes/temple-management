import { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLoginUser, useRegisterUser, User } from '@/hooks/use-complete-api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  userRoles: string[];
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const { toast } = useToast();

  // MongoDB API hooks
  const loginMutation = useLoginUser();
  const registerMutation = useRegisterUser();

  useEffect(() => {
    console.log("🚀 AuthProvider: Starting auth check");
    let isMounted = true;

    // Check for existing session in localStorage
    const checkExistingSession = async () => {
      try {
        const savedUser = localStorage.getItem('temple_user');
        const savedToken = localStorage.getItem('temple_token');

        if (savedUser && savedToken) {
          const userData = JSON.parse(savedUser);
          setUser(userData);

          // Fetch user roles from localStorage first, then API
          const savedRoles = localStorage.getItem('temple_user_roles');
          if (savedRoles) {
            setUserRoles(JSON.parse(savedRoles));
          } else {
            // Fetch fresh roles from API
            await fetchUserRoles(userData.id);
          }
        }
      } catch (error) {
        console.error("❌ Error checking existing session:", error);
        localStorage.removeItem('temple_user');
        localStorage.removeItem('temple_token');
        localStorage.removeItem('temple_user_roles');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkExistingSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const fetchUserRoles = async (userId: string) => {
    try {
      console.log("📋 Fetching user roles for:", userId);

      // For now, use a simple role assignment based on user ID
      // In production, this should call your MongoDB API
      const roles = getUserRolesFromUserId(userId);
      console.log("✅ Roles fetched:", roles);
      setUserRoles(roles);
      localStorage.setItem('temple_user_roles', JSON.stringify(roles));

      return roles;
    } catch (error) {
      console.error('❌ Error fetching user roles:', error);
      // Assign default role
      setUserRoles(['user']);
      return ['user'];
    }
  };

  // Simple role assignment based on user ID
  const getUserRolesFromUserId = (userId: string): string[] => {
    if (userId.includes('admin') || userId === 'admin-001') {
      return ['super_admin'];
    } else if (userId.includes('manager')) {
      return ['temple_manager', 'event_manager'];
    } else if (userId.includes('volunteer')) {
      return ['volunteer'];
    } else if (userId.includes('finance')) {
      return ['finance_manager'];
    } else {
      return ['user'];
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);

      console.log("🔐 Attempting login for:", email);

      const response = await loginMutation.mutateAsync({ email, password });

      if (response?.user) {
        setUser(response.user);
        localStorage.setItem('temple_user', JSON.stringify(response.user));
        localStorage.setItem('temple_token', response.token || '');

        // Fetch user roles
        await fetchUserRoles(response.user.id);

        toast({
          title: "Signed in successfully",
          description: `Welcome back!`,
        });
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      console.error('❌ Error signing in:', error);
      toast({
        title: "Authentication error",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);

      console.log("📝 Attempting signup for:", email);

      const response = await registerMutation.mutateAsync({
        email,
        password,
        full_name: fullName
      });

      toast({
        title: "Account created!",
        description: "Your account has been created successfully.",
      });
    } catch (error: any) {
      console.error('❌ Error signing up:', error);
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      setUserRoles([]);
      localStorage.removeItem('temple_user');
      localStorage.removeItem('temple_token');
      localStorage.removeItem('temple_user_roles');

      toast({
        title: "Signed out",
        description: "Successfully logged out.",
      });
    } catch (error: any) {
      console.error('❌ Error signing out:', error);
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const hasRole = (role: string) => {
    return userRoles.includes(role);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    userRoles,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
