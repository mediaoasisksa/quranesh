import { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/** Decode the JWT payload and check if it is expired. Returns true if expired/invalid. */
function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.warn("[auth] malformed token — not 3 parts");
      return true;
    }
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (!payload.exp) {
      console.log("[auth] token has no exp claim — treating as valid");
      return false;
    }
    const expired = payload.exp * 1000 <= Date.now();
    if (expired) {
      console.warn(`[auth] token expired at ${new Date(payload.exp * 1000).toISOString()}`);
    }
    return expired;
  } catch (e) {
    console.warn("[auth] token decode error:", e);
    return true;
  }
}

/** Remove authToken and user from localStorage. */
export function clearAuth() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  console.log("[auth] cleared localStorage auth");
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userStr = localStorage.getItem("user");
    console.log(`[auth] mount — token exists: ${!!token}, user exists: ${!!userStr}`);

    if (token && userStr) {
      if (isTokenExpired(token)) {
        console.warn("[auth] token expired on mount — clearing and marking unauthenticated");
        clearAuth();
        setAuthState({ user: null, token: null, isAuthenticated: false, isLoading: false });
        return;
      }

      try {
        const user = JSON.parse(userStr);
        console.log(`[auth] restored session for userId=${user?.id} email=${user?.email}`);
        setAuthState({ user, token, isAuthenticated: true, isLoading: false });
      } catch (e) {
        console.warn("[auth] user JSON parse failed:", e);
        clearAuth();
        setAuthState({ user: null, token: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      console.log("[auth] no stored session — unauthenticated");
      setAuthState({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  const signIn = (user: User, token: string) => {
    try {
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      console.log(`[auth] signIn — saved token: ${!!localStorage.getItem("authToken")}, saved user: ${!!localStorage.getItem("user")}, userId=${user?.id}`);
    } catch (e) {
      console.error("[auth] localStorage save failed:", e);
    }
    setAuthState({ user, token, isAuthenticated: true, isLoading: false });
    console.log("[auth] authState updated: isAuthenticated=true");
  };

  const signOut = () => {
    clearAuth();
    setAuthState({ user: null, token: null, isAuthenticated: false, isLoading: false });
    console.log("[auth] signed out");
  };

  return { ...authState, signIn, signOut };
}
