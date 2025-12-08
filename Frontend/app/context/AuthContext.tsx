"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../../Database/supabase-client";

interface AuthContextType {
  isLoggedin: boolean;
  loading: boolean;
  setIsLoggedin: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [loading, setLoading] = useState(true); // ⭐ NEW

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedin(!!data.session);
      setLoading(false); // ⭐ Only finish after session check
    };

    loadSession();

    // Listen for future login/logout events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedin(!!session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedin, loading, setIsLoggedin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
