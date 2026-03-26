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
    if (parts.length !== 3) return true;
    // atob works in all modern browsers; the payload is base64url-encoded
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (!payload.exp) return false; // no expiry claim — treat as valid
    return payload.exp * 1000 <= Date.now();
  } catch {
    return true; // malformed token
  }
}

/** Remove authToken and user from localStorage. */
export function clearAuth() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
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

    if (token && userStr) {
      // Reject expired or malformed tokens immediately — no network call needed
      if (isTokenExpired(token)) {
        console.log("[auth] Token expired on mount — clearing localStorage");
        clearAuth();
        setAuthState({ user: null, token: null, isAuthenticated: false, isLoading: false });
        return;
      }

      try {
        const user = JSON.parse(userStr);
        setAuthState({ user, token, isAuthenticated: true, isLoading: false });
      } catch {
        clearAuth();
        setAuthState({ user: null, token: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      setAuthState({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  const signIn = (user: User, token: string) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(user));
    setAuthState({ user, token, isAuthenticated: true, isLoading: false });
  };

  const signOut = () => {
    clearAuth();
    setAuthState({ user: null, token: null, isAuthenticated: false, isLoading: false });
  };

  return { ...authState, signIn, signOut };
}
