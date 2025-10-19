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
        setUserRoles(userData.roles || getUserRoles(userData.email));
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem('temple_user');
      }
    }

    setLoading(false);
  }, []);

  const getUserRoles = (email: string): string[] => {
    if (email === 'admin@temple.com') {
      return ['super_admin'];
    } else if (email.includes('manager')) {
      return ['temple_manager', 'event_manager'];
    } else if (email.includes('finance')) {
      return ['finance_manager'];
    } else if (email.includes('volunteer')) {
      return ['volunteer'];
    }
    return ['user'];
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);

      console.log("🔐 Attempting login for:", email);

      // Simple authentication for testing
      if (email === 'admin@temple.com' && password === 'password123') {
        const userData = {
          id: 'admin-001',
          email: 'admin@temple.com',
          full_name: 'Temple Administrator',
          roles: ['super_admin']
        };

        setUser(userData);
        setUserRoles(['super_admin']);
        localStorage.setItem('temple_user', JSON.stringify(userData));
        localStorage.setItem('temple_token', 'mock-token-' + Date.now());

        toast({
          title: "Signed in successfully",
          description: "Welcome back, Temple Administrator!",
        });
        return;
      }

      // Check for other test users
      const testUsers: Record<string, string[]> = {
        'manager@temple.com': ['temple_manager', 'event_manager'],
        'finance@temple.com': ['finance_manager'],
        'volunteer@temple.com': ['volunteer'],
        'user@temple.com': ['user']
      };

      if (testUsers[email] && password === 'password123') {
        const userData = {
          id: email.replace('@', '-').replace('.', '-'),
          email,
          full_name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
          roles: testUsers[email]
        };

        setUser(userData);
        setUserRoles(testUsers[email]);
        localStorage.setItem('temple_user', JSON.stringify(userData));
        localStorage.setItem('temple_token', 'mock-token-' + Date.now());

        toast({
          title: "Signed in successfully",
          description: `Welcome back!`,
        });
        return;
      }

      throw new Error("Invalid email or password. Use admin@temple.com / password123 for testing");

    } catch (error: any) {
      console.error('❌ Error signing in:', error);
      toast({
        title: "Authentication failed",
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

      console.log("📝 Attempting signup for:", email);

      const userData = {
        id: 'user-' + Date.now(),
        email,
        full_name: fullName,
        roles: ['user']
      };

      setUser(userData);
      setUserRoles(['user']);
      localStorage.setItem('temple_user', JSON.stringify(userData));
      localStorage.setItem('temple_token', 'mock-token-' + Date.now());

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
