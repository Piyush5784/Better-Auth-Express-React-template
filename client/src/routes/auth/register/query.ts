import { api } from "@/utils/axios";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: async (
      credentials: RegisterCredentials,
    ): Promise<AuthResponse> => {
      const response = await api.post("/auth/register", credentials);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Registration successful", {
        description: data.message ?? "User successfully registered",
      });
    },
    onError: (error: any) => {
      toast.error("Registration failed", {
        description: error.response?.data?.error ?? "Invalid credentials",
      });
    },
  });
}

export function getGoogleAuthUrl(): string {
  // Replace with your actual Google OAuth URL
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
  const redirectUri = `${window.location.origin}/auth/callback`;
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20email%20profile`;
}
