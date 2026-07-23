import { APIError, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

import "dotenv/config";
import { sendEmail } from "./email";
import { createAuthMiddleware } from "better-auth/api";
import z from "zod";

export const passwordSchema = z
  .string()
  .min(1, { message: "Password is required" })
  .min(8, { message: "Password must be at least 8 characters" });
// .regex(/[^A-Za-z0-9]/, {
//   message: "Password must contain at least one special character",
// });

export const auth = betterAuth({
  basePath: "/api/v1/auth",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  // Email + password login/registration
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignInAfterRegistration: true,
    async sendResetPassword({ user, url }) {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        html: `Click the link to reset your password: ${url}`,
      });
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        html: `
          <h2>Verify your email</h2>
          <a href="${url}">Verify Email</a>
        `,
      });
    },

    sendOnSignUp: true,
    expiresIn: 60 * 60 * 24, // 24 hours
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (
        ctx.path === "/sign-up/email" ||
        ctx.path === "/reset-password" ||
        ctx.path === "/change-password"
      ) {
        const password = ctx.body.password || ctx.body.newPassword;
        const { error } = passwordSchema.safeParse(password);
        if (error) {
          throw new APIError("BAD_REQUEST", {
            message: "Password not strong enough",
          });
        }
      }
    }),
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,

  trustedOrigins: [process.env.FRONTEND_URL!],
});
