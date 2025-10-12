import { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for existing authentication on mount
    const token = localStorage.getItem("authToken");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
        // Clear invalid data
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } else {
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  const signIn = (user: User, token: string) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(user));
    setAuthState({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const signOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return {
    ...authState,
    signIn,
    signOut,
  };
}
