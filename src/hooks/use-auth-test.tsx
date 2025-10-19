import { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  userRoles: string[];
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    console.log("🚀 AuthProvider: Starting auth check");

    // Check for existing session
    const savedUser = localStorage.getItem('temple_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setUserRoles(userData.roles || ['user']);
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem('temple_user');
      }
    }

    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);

      // For testing - bypass API and use local auth
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

        toast({
          title: "Signed in successfully",
          description: "Welcome back!",
        });
        return;
      }

      // If not the test admin, show error
      throw new Error("Invalid credentials. Use admin@temple.com / password123 for testing");

    } catch (error: any) {
      console.error('❌ Error signing in:', error);
      toast({
        title: "Authentication error",
        description: error.message,
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

      const mockUser = {
        id: 'user-' + Date.now(),
        email,
        full_name: fullName,
        roles: ['user']
      };

      setUser(mockUser);
      setUserRoles(['user']);
      localStorage.setItem('temple_user', JSON.stringify(mockUser));

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
