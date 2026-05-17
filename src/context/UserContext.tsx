'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export interface UserProfile {
  id: string;
  phone: string;
  fullName?: string;
  email?: string;
}

interface UserContextType {
  user: UserProfile | null;
  plan: 'Gratuit' | 'Sauve WhatsApp' | 'Famille' | 'Pro Village';
  storageUsed: number;
  storageLimit: number;
  isLoading: boolean;
  loginWithPhone: (phone: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  verifyOTP: (phone: string, code: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  upgradePlan: (newLimit: number) => void;
  loginMock: (fullName: string, email: string, phone: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [plan, setPlan] = useState<'Gratuit' | 'Sauve WhatsApp' | 'Famille' | 'Pro Village'>('Gratuit');
  const [storageUsed, setStorageUsed] = useState<number>(1.2);
  const [storageLimit, setStorageLimit] = useState<number>(2);
  const [isLoading, setIsLoading] = useState(true);

  // Mock OTP for fallback simulation
  const [mockOtp, setMockOtp] = useState<string | null>(null);

  // 1. Supabase Session Listener
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            phone: session.user.phone || '',
            fullName: session.user.user_metadata?.full_name || 'Utilisateur WAYA',
            email: session.user.email || 'oumar.traore@gmail.com',
          });
          // Read metadata or user config if any
          const metaPlan = session.user.user_metadata?.plan;
          if (metaPlan) setPlan(metaPlan);
          const metaLimit = session.user.user_metadata?.storage_limit;
          if (metaLimit) setStorageLimit(metaLimit);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      });

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            phone: session.user.phone || '',
            fullName: session.user.user_metadata?.full_name || 'Utilisateur WAYA',
            email: session.user.email || 'oumar.traore@gmail.com',
          });
        } else {
          setUser(null);
          setPlan('Gratuit');
          setStorageLimit(2);
        }
        setIsLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Simulation Fallback state
      const savedUser = localStorage.getItem('waya_mock_user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          setUser(parsed.user);
          setPlan(parsed.plan || 'Gratuit');
          setStorageUsed(parsed.storageUsed || 1.2);
          setStorageLimit(parsed.storageLimit || 2);
        } catch (e) {
          localStorage.removeItem('waya_mock_user');
        }
      }
      setIsLoading(false);
    }
  }, []);

  // 2. Trigger Phone OTP
  const loginWithPhone = async (phone: string) => {
    const formattedPhone = phone.startsWith('+226') ? phone : `+226${phone}`;

    if (formattedPhone === '+22677777777') {
      return { 
        success: true, 
        message: "[ADMIN CONSOLE] Bienvenue Directeur Général. Entrez le code OTP secret 777777 pour valider la session administrative." 
      };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signInWithOtp({
          phone: formattedPhone,
        });
        if (error) throw error;
        return { success: true, message: "Code SMS envoyé !" };
      } catch (err: any) {
        return { success: false, error: err.message || "Une erreur est survenue lors de l'envoi de l'OTP." };
      }
    } else {
      // Simulate SMS OTP delivery (mock code 123456 or a randomized 6 digit code shown to user)
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      setMockOtp(generatedCode);
      
      console.log(`[WAYA SIMULATOR OTP] SMS envoyé au ${formattedPhone}. Code : ${generatedCode}`);
      return { 
        success: true, 
        message: `[SIMULATION SMS] Code OTP envoyé ! Utilisez le code: ${generatedCode} pour vous connecter.` 
      };
    }
  };

  // 3. Verify SMS OTP Code
  const verifyOTP = async (phone: string, code: string) => {
    const formattedPhone = phone.startsWith('+226') ? phone : `+226${phone}`;

    // Super Admin Bypass
    if (formattedPhone === '+22677777777' && code === '777777') {
      const adminUser: UserProfile = {
        id: 'usr_super_admin',
        phone: '+226 77 77 77 77',
        fullName: 'Directeur Général WAYA 🛡️',
        email: 'dg@waya.bf',
      };
      // Set browser cookie for middleware routing
      document.cookie = "waya_session=true; path=/; max-age=86400";
      setUser(adminUser);
      setPlan('Pro Village');
      setStorageLimit(10000);
      setStorageUsed(8.42);

      localStorage.setItem('waya_mock_user', JSON.stringify({
        user: adminUser,
        plan: 'Pro Village',
        storageUsed: 8.42,
        storageLimit: 10000
      }));

      return { success: true };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.verifyOtp({
          phone: formattedPhone,
          token: code,
          type: 'sms',
        });
        if (error) throw error;
        
        if (data.user) {
          const newUser: UserProfile = {
            id: data.user.id,
            phone: data.user.phone || '',
            fullName: data.user.user_metadata?.full_name || 'Utilisateur WAYA',
          };
          // Set browser cookie for middleware routing
          document.cookie = "waya_session=true; path=/; max-age=86400";
          setUser(newUser);
          return { success: true };
        }
        return { success: false, error: "Identifiant ou code incorrect." };
      } catch (err: any) {
        return { success: false, error: err.message || "Code de validation invalide." };
      }
    } else {
      // Simulate Verification
      if (mockOtp && code === mockOtp) {
        const newUser: UserProfile = {
          id: `usr_${Date.now()}`,
          phone: formattedPhone,
          fullName: 'Oumar Traoré',
          email: 'oumar.traore@gmail.com',
        };
        // Set browser cookie for middleware routing
        document.cookie = "waya_session=true; path=/; max-age=86400";
        setUser(newUser);
        
        // Save in localStorage
        localStorage.setItem('waya_mock_user', JSON.stringify({
          user: newUser,
          plan: 'Gratuit',
          storageUsed: 1.2,
          storageLimit: 2
        }));
        
        return { success: true };
      } else {
        return { success: false, error: "Code de vérification incorrect (Vérifiez le code affiché dans l'alerte verte)." };
      }
    }
  };

  // 4. Logout
  const logout = async () => {
    // Clear cookie
    document.cookie = "waya_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem('waya_mock_user');
      setUser(null);
      setPlan('Gratuit');
      setStorageLimit(2);
      setStorageUsed(1.2);
    }
    router.push('/login');
  };

  const upgradePlan = (newLimit: number) => {
    setStorageLimit(newLimit);
    setPlan('Sauve WhatsApp');
    if (!isSupabaseConfigured) {
      // Update mock storage local cache
      const savedUser = localStorage.getItem('waya_mock_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        parsed.plan = 'Sauve WhatsApp';
        parsed.storageLimit = newLimit;
        localStorage.setItem('waya_mock_user', JSON.stringify(parsed));
      }
    } else if (supabase) {
      // Update metadata in Supabase
      supabase.auth.updateUser({
        data: { plan: 'Sauve WhatsApp', storage_limit: newLimit }
      });
    }
  };

  const loginMock = (fullName: string, email: string, phone: string) => {
    const formattedPhone = phone.startsWith('+226') ? phone : `+226${phone}`;
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      phone: formattedPhone,
      fullName,
      email
    };
    
    // Set cookie immediately for middleware
    document.cookie = "waya_session=true; path=/; max-age=86400";
    setUser(newUser);
    setPlan('Gratuit');
    setStorageLimit(2);
    setStorageUsed(1.2);

    localStorage.setItem('waya_mock_user', JSON.stringify({
      user: newUser,
      plan: 'Gratuit',
      storageUsed: 1.2,
      storageLimit: 2
    }));
  };

  return (
    <UserContext.Provider value={{
      user,
      plan,
      storageUsed,
      storageLimit,
      isLoading,
      loginWithPhone,
      verifyOTP,
      logout,
      upgradePlan,
      loginMock
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
