import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authAPI } from "@/lib/api";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshAccessToken: () => Promise<void>;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  role?: string;
  fullName?: string;
  phone?: string;
  address?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "finedge_access_token";
const REFRESH_TOKEN_KEY = "finedge_refresh_token";
const USER_KEY = "finedge_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load tokens and user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      setToken(storedToken);
      setRefreshToken(storedRefreshToken);
      setUser(JSON.parse(storedUser));
      
      // Verify token is still valid by fetching current user
      fetchCurrentUser(storedToken).catch(() => {
        // Token invalid, try refresh
        if (storedRefreshToken) {
          refreshAccessToken().catch(() => {
            clearAuth();
          });
        } else {
          clearAuth();
        }
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (authToken: string) => {
    const response = await fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    const data = await response.json();
    return data.user;
  };

  const clearAuth = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    setIsLoading(false);
  };

  const setAuth = (accessToken: string, newRefreshToken: string, userData: User) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setToken(accessToken);
    setRefreshToken(newRefreshToken);
    setUser(userData);
    setIsLoading(false);
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await authAPI.login({ username, password });
      setAuth(response.accessToken, response.refreshToken, response.user);
    } catch (error: any) {
      setIsLoading(false);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authAPI.register(data);
      setAuth(response.accessToken, response.refreshToken, response.user);
    } catch (error: any) {
      setIsLoading(false);
      throw error;
    }
  };

  const refreshAccessToken = async () => {
    const storedRefreshToken = refreshToken || localStorage.getItem(REFRESH_TOKEN_KEY);
    
    if (!storedRefreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();
      setAuth(data.accessToken, data.refreshToken, data.user);
    } catch (error) {
      clearAuth();
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuth();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        refreshToken,
        login,
        register,
        logout,
        isAuthenticated: !!user && !!token,
        isLoading,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

