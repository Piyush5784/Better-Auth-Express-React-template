import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { useEffect } from "react";

import { signIn, signUp, signOut } from "@/lib/auth-client";
import { FRONTEND_URL } from "@/config";

// =====================
// Login Mutation
// =====================

export function useLogin() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await signIn.email({
        email: credentials.email,
        password: credentials.password,
        callbackURL: `${FRONTEND_URL}/dashboard`,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response;
    },

    onSuccess: () => {
      toast.success("Logged in!", {
        description: "User successfully logged in",
      });

      navigate({
        to: "/dashboard",
      });
    },

    onError: (error) => {
      toast.error("Login failed", {
        description: error.message,
      });
    },
  });
}

// =====================
// Register Mutation
// =====================

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      name: string;
    }) => {
      const response = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        callbackURL: `${FRONTEND_URL}/dashboard`,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response;
    },

    onSuccess: () => {
      toast.success("Account created!", {
        description: "Welcome!",
      });

      navigate({
        to: "/auth/Login",
      });
    },

    onError: (error) => {
      toast.error("Registration failed", {
        description: error.message,
      });
    },
  });
}

// =====================
// Logout Mutation
// =====================

export function useLogout() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      const response = await signOut();

      return response;
    },

    onSuccess: () => {
      toast.success("Logged out successfully");

      navigate({
        to: "/",
      });
    },

    onError: (error) => {
      toast.error("Logout failed", {
        description: error.message,
      });
    },
  });
}

export function useUser() {
  const { isPending, data } = useSession();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !data?.user) {
      navigate({
        to: "/auth/Login",
      });
    }
  }, [isPending, data?.user, navigate]);

  return {
    isAuthenticated: !!data?.user,
    isLoading: isPending,
    data,
  };
}
