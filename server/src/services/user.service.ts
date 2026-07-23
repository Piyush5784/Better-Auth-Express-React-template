// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { JWT_PASSWORD } from "@/config";
// import type { UserPayload } from "@/types/user";
// import type { GoogleAuthUser } from "@/lib/auth";
// import { AuthProvider } from "@/generated/prisma/client";
// import { prisma } from "@/lib/prisma";
// import type { ApiResponse } from "@/types/api-response";

// export type ServiceResult = {
//   status: number;
//   body: ApiResponse;
//   refreshToken?: string;
// };

// export async function register(
//   email: string,
//   password: string,
// ): Promise<{ status: number; body: ApiResponse }> {
//   try {
//     const existing = await prisma.user.findUnique({ where: { email } });
//     if (existing) {
//       return {
//         status: 409,
//         body: { error: "User already exists", success: false } satisfies ApiResponse,
//       };
//     }

//     const passwordHash = await bcrypt.hash(password, 11);

//     await prisma.user.create({
//       data: {
//         email,
//         authAccounts: {
//           create: {
//             provider: AuthProvider.EMAIL,
//             providerAccountId: email,
//             passwordHash,
//           },
//         },
//       },
//     });

//     return {
//       status: 201,
//       body: { message: "User successfully registered", success: true } satisfies ApiResponse,
//     };
//   } catch {
//     return {
//       status: 500,
//       body: { error: "Registration failed", success: false } satisfies ApiResponse,
//     };
//   }
// }

// export async function login(email: string, password: string): Promise<ServiceResult> {
//   try {
//     const account = await prisma.authAccount.findFirst({
//       where: {
//         provider: AuthProvider.EMAIL,
//         providerAccountId: email,
//       },
//       include: { user: true },
//     });

//     if (!account?.user) {
//       return {
//         status: 404,
//         body: { error: "User not found", success: false } satisfies ApiResponse,
//       };
//     }

//     if (!account.passwordHash) {
//       return {
//         status: 401,
//         body: { error: "Password login not available", success: false } satisfies ApiResponse,
//       };
//     }

//     const valid = await bcrypt.compare(password, account.passwordHash);
//     if (!valid) {
//       return {
//         status: 401,
//         body: { error: "Invalid password", success: false } satisfies ApiResponse,
//       };
//     }

//     const payload: UserPayload = { id: account.user.id, email: account.user.email };
//     const token = jwt.sign(payload, JWT_PASSWORD, { expiresIn: "1h" });
//     const refreshToken = jwt.sign(payload, JWT_PASSWORD, { expiresIn: "7d" });

//     return {
//       status: 200,
//       body: {
//         message: "User successfully logged in",
//         data: { accessToken: token },
//         success: true,
//       } satisfies ApiResponse,
//       refreshToken,
//     };
//   } catch (err) {
//     console.error("Login error:", err);
//     return { status: 500, body: { error: "Login failed", success: false } satisfies ApiResponse };
//   }
// }

// export function refresh(token: string): {
//   status: number;
//   body: ApiResponse;
//   token?: string;
//   refreshToken?: string;
// } {
//   try {
//     const payload = jwt.verify(token, JWT_PASSWORD) as UserPayload;
//     const newToken = jwt.sign({ id: payload.id, email: payload.email }, JWT_PASSWORD, {
//       expiresIn: "1h",
//     });
//     const newRefreshToken = jwt.sign({ id: payload.id, email: payload.email }, JWT_PASSWORD, {
//       expiresIn: "7d",
//     });

//     return {
//       status: 200,
//       body: {
//         message: "Token refreshed",
//         data: { token: newToken },
//         success: true,
//       } satisfies ApiResponse,
//       token: newToken,
//       refreshToken: newRefreshToken,
//     };
//   } catch {
//     return {
//       status: 401,
//       body: { error: "Invalid or expired refresh token", success: false } satisfies ApiResponse,
//     };
//   }
// }

// export async function googleAuth(googleUser: GoogleAuthUser): Promise<{
//   status: number;
//   body: ApiResponse;
//   refreshToken?: string;
// }> {
//   try {
//     // 1) Find by Google account first
//     const googleAccount = await prisma.authAccount.findFirst({
//       where: {
//         provider: AuthProvider.GOOGLE,
//         providerAccountId: googleUser.googleId,
//       },
//       include: { user: true },
//     });

//     let user = googleAccount?.user ?? null;

//     // 2) If not found, try email user and link/create google account
//     if (!user) {
//       user = await prisma.user.findUnique({ where: { email: googleUser.email } });

//       if (!user) {
//         user = await prisma.user.create({
//           data: {
//             email: googleUser.email,
//             avatar: googleUser.avatar ?? null,
//           },
//         });
//       } else if (!user.avatar && googleUser.avatar) {
//         user = await prisma.user.update({
//           where: { id: user.id },
//           data: { avatar: googleUser.avatar },
//         });
//       }

//       const existingGoogleLink = await prisma.authAccount.findFirst({
//         where: {
//           userId: user.id,
//           provider: AuthProvider.GOOGLE,
//         },
//       });

//       if (!existingGoogleLink) {
//         await prisma.authAccount.create({
//           data: {
//             userId: user.id,
//             provider: AuthProvider.GOOGLE,
//             providerAccountId: googleUser.googleId,
//           },
//         });
//       }
//     }

//     const payload: UserPayload = { id: user.id, email: user.email };
//     const accessToken = jwt.sign(payload, JWT_PASSWORD, { expiresIn: "1h" });
//     const refreshToken = jwt.sign(payload, JWT_PASSWORD, { expiresIn: "7d" });

//     return {
//       status: 200,
//       body: {
//         message: "Google auth successful",
//         success: true,
//         data: {
//           accessToken,
//           user: {
//             id: user.id,
//             email: user.email,
//             username: user.username,
//             avatar: user.avatar,
//             provider: "google",
//           },
//         },
//       } satisfies ApiResponse,
//       refreshToken,
//     };
//   } catch {
//     return {
//       status: 500,
//       body: { error: "Google auth failed", success: false } satisfies ApiResponse,
//     };
//   }
// }
