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
        const savedRoles = localStorage.getItem('temple_user_roles');

        if (savedUser && savedToken) {
          const userData = JSON.parse(savedUser);
          setUser(userData);

          // Use saved roles or fetch fresh ones
          if (savedRoles) {
            setUserRoles(JSON.parse(savedRoles));
          } else {
            // Assign roles based on user ID (fallback)
            const roles = getUserRolesFromUserId(userData.id);
            setUserRoles(roles);
            localStorage.setItem('temple_user_roles', JSON.stringify(roles));
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

  // Simple role assignment based on user ID or email
  const getUserRolesFromUserId = (userId: string): string[] => {
    // Check if it's our test admin user
    if (userId === 'admin-001' || userId.includes('admin')) {
      return ['super_admin'];
    }

    // Check email patterns for roles
    const savedUser = localStorage.getItem('temple_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      const email = userData.email || '';

      if (email.includes('admin')) {
        return ['super_admin'];
      } else if (email.includes('manager')) {
        return ['temple_manager', 'event_manager'];
      } else if (email.includes('finance')) {
        return ['finance_manager'];
      } else if (email.includes('volunteer')) {
        return ['volunteer'];
      }
    }

    // Default role
    return ['user'];
  };

  const fetchUserRoles = async (userId: string) => {
    try {
      console.log("📋 Fetching user roles for:", userId);

      // For now, use local role assignment
      const roles = getUserRolesFromUserId(userId);
      console.log("✅ Roles assigned:", roles);
      setUserRoles(roles);
      localStorage.setItem('temple_user_roles', JSON.stringify(roles));

      return roles;
    } catch (error) {
      console.error('❌ Error fetching user roles:', error);
      // Fallback to default roles
      const fallbackRoles = getUserRolesFromUserId(userId);
      setUserRoles(fallbackRoles);
      return fallbackRoles;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);

      console.log("🔐 Attempting login for:", email);

      // For testing, use mock authentication
      if (email === 'admin@temple.com' && password === 'password123') {
        const mockUser = {
          id: 'admin-001',
          email: 'admin@temple.com',
          full_name: 'Temple Administrator',
          roles: ['super_admin']
        };

        setUser(mockUser);
        setUserRoles(['super_admin']);
        localStorage.setItem('temple_user', JSON.stringify(mockUser));
        localStorage.setItem('temple_token', 'mock-token-' + Date.now());
        localStorage.setItem('temple_user_roles', JSON.stringify(['super_admin']));

        toast({
          title: "Signed in successfully",
          description: "Welcome back!",
        });
        return;
      }

      // Try API login
      try {
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
        }
      } catch (apiError) {
        console.log("API login failed, using fallback");
        // Fallback to local auth for testing
        if (email === 'admin@temple.com' && password === 'password123') {
          const mockUser = {
            id: 'admin-001',
            email: 'admin@temple.com',
            full_name: 'Temple Administrator',
            roles: ['super_admin']
          };

          setUser(mockUser);
          setUserRoles(['super_admin']);
          localStorage.setItem('temple_user', JSON.stringify(mockUser));
          localStorage.setItem('temple_token', 'mock-token-' + Date.now());
          localStorage.setItem('temple_user_roles', JSON.stringify(['super_admin']));

          toast({
            title: "Signed in successfully",
            description: "Welcome back!",
          });
          return;
        }
        throw apiError;
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

      // For testing, use mock signup
      const mockUser = {
        id: 'user-' + Date.now(),
        email,
        full_name: fullName,
        roles: ['user']
      };

      setUser(mockUser);
      setUserRoles(['user']);
      localStorage.setItem('temple_user', JSON.stringify(mockUser));
      localStorage.setItem('temple_token', 'mock-token-' + Date.now());
      localStorage.setItem('temple_user_roles', JSON.stringify(['user']));

      toast({
        title: "Account created!",
        description: "Your account has been created successfully.",
      });
    } catch (error: any) {
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
