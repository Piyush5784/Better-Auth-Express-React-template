
import { BACKEND_URL } from "@/config";
import { createAuthClient } from "better-auth/react";


export const authClient = createAuthClient({
  baseURL: `${BACKEND_URL}/api/v1/auth`,
});

export const { signIn, signUp, signOut, useSession } = authClient;
