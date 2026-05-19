import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  clearStoredSession,
  fetchProfile,
  getStoredToken,
  getStoredUser,
  loginUser,
  loginWithGoogle,
  registerUser,
  saveSession
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function verifySession() {
      if (!getStoredToken()) {
        setCheckingAuth(false);
        return;
      }

      try {
        const profile = await fetchProfile();
        setUser(profile);
      } catch {
        clearStoredSession();
        setUser(null);
      } finally {
        setCheckingAuth(false);
      }
    }

    verifySession();
  }, []);

  const register = useCallback(async (payload) => {
    setLoading(true);
    try {
      const nextUser = await registerUser(payload);
      setUser(nextUser);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (payload) => {
    setLoading(true);
    try {
      const nextUser = await loginUser(payload);
      setUser(nextUser);
    } finally {
      setLoading(false);
    }
  }, []);

  const googleLogin = useCallback(async (credential) => {
    setLoading(true);
    try {
      const nextUser = await loginWithGoogle(credential);
      setUser(nextUser);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearStoredSession();
    setUser(null);
  }, []);

  const updateUser = useCallback((nextUser) => {
    const token = getStoredToken();
    if (token) saveSession({ token, user: nextUser });
    setUser(nextUser);
  }, []);

  const value = useMemo(
    () => ({ user, loading, checkingAuth, register, login, googleLogin, logout, updateUser }),
    [user, loading, checkingAuth, register, login, googleLogin, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
