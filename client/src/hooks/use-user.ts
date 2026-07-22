import { create } from "zustand";
import { api, setAccessToken } from "@/utils/axios";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useEffect } from "react";

interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt?: string;
}

interface UserStore {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasInitialized: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  clearUser: () => void;
  fetchUser: () => Promise<void>;
}

const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  hasInitialized: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (loading) => set({ isLoading: loading }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
  fetchUser: async () => {
    const state = get();
    if (state.isLoading || state.hasInitialized) return;

    set({ isLoading: true, hasInitialized: true });
    try {
      const response = await api.get("/auth/me");
      const userData = response.data.data?.user || null;
      set({ user: userData, isAuthenticated: !!userData });
    } catch (error) {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export function useUser() {
  const { user, isLoading, isAuthenticated, fetchUser } = useUserStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    isLoading,
    isAuthenticated,
    refetch: fetchUser,
  };
}

export function useLogin() {
  const navigate = useNavigate();
  const { setUser, setLoading } = useUserStore();

  const login = async (credentials: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", credentials);
      const data = response.data;

      if (data.success) {
        const accessToken = data.data?.accessToken;
        if (accessToken) {
          setAccessToken(accessToken);
        }

        try {
          const userResponse = await api.get("/auth/me");
          const userData = userResponse.data.data?.user || null;
          setUser(userData);
        } catch (userError) {
          console.error("Failed to fetch user data:", userError);
        }

        toast.success("Logged in!", {
          description: data.message ?? "User successfully logged in",
        });
        navigate({ to: "/dashboard" });
      } else {
        toast.error("Login failed", {
          description: data.message ?? "Invalid credentials",
        });
      }
    } catch (error: any) {
      toast.error("Login failed", {
        description: error.response?.data?.error ?? "Invalid credentials",
      });
    } finally {
      setLoading(false);
    }
  };

  return { login, isLoading: useUserStore((state) => state.isLoading) };
}

export function useLogout() {
  const navigate = useNavigate();
  const { clearUser, setLoading } = useUserStore();

  const logout = async () => {
    setLoading(true);
    try {
      await api.post("/auth/logout");
      setAccessToken(null);
      clearUser();
      toast.success("Logged out successfully");
      navigate({ to: "/" });
    } catch (error: any) {
      toast.error("Logout failed", {
        description: error.response?.data?.error ?? "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return { logout, isLoading: useUserStore((state) => state.isLoading) };
}

export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: "/auth/Login" });
    }
  }, [isLoading, isAuthenticated, navigate]);

  return { isAuthenticated, isLoading };
}
