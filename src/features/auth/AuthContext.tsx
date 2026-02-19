import React, { createContext, useContext, useMemo, useState } from "react";

type AuthState = {
  token: string | null;
};

type AuthContextValue = {
  token: string | null;
  isAuthenticated: boolean;
  signIn: (token: string) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(() => ({
    token: localStorage.getItem("auth_token"),
  }));

  const value = useMemo<AuthContextValue>(() => {
    const signIn = (token: string) => {
      localStorage.setItem("auth_token", token);
      setState({ token });
    };

    const signOut = () => {
      localStorage.removeItem("auth_token");
      setState({ token: null });
    };

    return {
      token: state.token,
      isAuthenticated: !!state.token,
      signIn,
      signOut,
    };
  }, [state.token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
