import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/services/supabase';
import { logAuthEvent, AUDIT_ACTIONS, getUserIPAddress } from '@/services/auditLog';
import { 
  checkLockoutStatus, 
  recordFailedAttempt, 
  clearFailedAttempts 
} from '@/services/loginAttempts';
import {
  setRememberMePreference,
  clearSessionPreferences,
  getRememberMePreference,
} from '@/services/sessionManager';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        setSession(session);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        setSession(session);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      setLoading(true);
      
      const { data: adminUser, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', userId)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching admin user:', error);
        // If user is not found in admin_users table, sign them out
        if (error.code === 'PGRST116') {
          await signOut();
          return;
        }
        throw error;
      }

      setUser(adminUser);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password, rememberMe = false) => {
    try {
      setLoading(true);
      
      // Check if user is locked out
      const lockoutStatus = checkLockoutStatus(email);
      if (lockoutStatus.isLockedOut) {
        const error = new Error(`Account temporarily locked due to too many failed attempts. Please try again later.`);
        error.code = 'account_locked';
        error.remainingTime = lockoutStatus.remainingTime;
        throw error;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Record failed attempt
        const ipAddress = await getUserIPAddress();
        recordFailedAttempt(email, ipAddress, {
          error: error.message,
          timestamp: new Date().toISOString(),
        });

        // Log failed login attempt
        await logAuthEvent(AUDIT_ACTIONS.LOGIN_FAILED, {
          email,
          error: error.message,
          ipAddress,
        });

        throw error;
      }

      // Clear failed attempts on successful login
      const ipAddress = await getUserIPAddress();
      clearFailedAttempts(email, ipAddress);

      // Store remember me preference
      setRememberMePreference(rememberMe, email);

      // Log successful login
      await logAuthEvent(AUDIT_ACTIONS.LOGIN, {
        email,
        userId: data.user?.id,
        ipAddress,
        rememberMe,
      });

      // User profile will be fetched by the auth state change listener
      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Log logout event before signing out
      if (user) {
        await logAuthEvent(AUDIT_ACTIONS.LOGOUT, {
          userId: user.id,
          email: user.email,
        });
      }
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      // Clear session preferences on explicit logout
      clearSessionPreferences();

      setUser(null);
      setSession(null);
      
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      return { error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error };
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      return { error: null };
    } catch (error) {
      console.error('Update password error:', error);
      return { error };
    }
  };

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Refresh session error:', error);
      return { data: null, error };
    }
  };



  const value = {
    user,
    session,
    loading,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    refreshSession,
    getRememberMePreference,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
    isSuperAdmin: user?.role === 'super_admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;