import { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { loginApi, registerApi, meApi } from '@/lib/api';

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
  
    const initAuth = async () => {
      setLoading(true);
      try {
        // 1️⃣ Check if user & token exist in localStorage
        const savedUser = localStorage.getItem("temple_user");
        const savedToken = localStorage.getItem("temple_token");
  
        if (savedUser && savedToken) {
          // User already logged in, restore state
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setUserRoles(userData.roles || [userData.role] || ["user"]);
          console.log("✅ User restored from localStorage:", userData.email);
        } 
        else if (savedToken) {
          // Token exists but no user data, validate via backend
          console.log("🔍 Validating token via meApi...");
          const res = await meApi(); // make sure this sends token in headers
          if (res?.data) {
            setUser(res.data);
            setUserRoles(res.data.roles || [res.data.role] || ["user"]);
            localStorage.setItem("temple_user", JSON.stringify(res.data));
            console.log("✅ Token validated, user restored:", res.data.email);
          } else {
            console.warn("⚠️ Token invalid, clearing storage");
            localStorage.removeItem("temple_user");
            localStorage.removeItem("temple_token");
          }
        } 
        else {
          console.log("ℹ️ No user or token found, user not logged in");
        }
  
      } catch (error) {
        console.error("❌ Error during auth initialization:", error);
        localStorage.removeItem("temple_user");
        localStorage.removeItem("temple_token");
      } finally {
        setLoading(false);
        console.log("✅ Auth check complete");
      }
    };
  
    initAuth();
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
      const res = await loginApi(email, password); // call your backend API
      const { user: userData, token } = res.data;
  
      // ✅ update AuthProvider state immediately
      setUser(userData);
      setUserRoles(userData.roles || [userData.role] || ['user']);
  
      // ✅ save to localStorage for persistence
      localStorage.setItem('temple_user', JSON.stringify(userData));
      localStorage.setItem('temple_token', token);
  
      toast({ title: 'Signed in successfully', description: `Welcome back, ${userData.full_name || userData.email}!` });
      
      // Force a small delay to ensure state is updated before redirect
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error: any) {
      toast({
        title: 'Authentication failed',
        description: error.message || 'Please check your credentials',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      const res = await registerApi({ email, password, full_name: fullName });
      const { user: userData, token } = res.data;
      setUser(userData);
      setUserRoles(userData.roles || [userData.role] || ['user']);
      localStorage.setItem('temple_user', JSON.stringify(userData));
      localStorage.setItem('temple_token', token);
      toast({ title: 'Account created!', description: 'Your account has been created successfully.' });
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
