// // import { Router } from "express";
// // import * as userService from "@/services/user.service";
// // import { FRONTEND_URL } from "@/config";
// // import { passportAuthGoogle, type GoogleAuthUser } from "@/lib/google-auth";
// // import { setRefreshCookie } from "@/utils/cookie";

// // const router = Router();

// // router.get(
// //   "/google",
// //   passportAuthGoogle.authenticate("google", { scope: ["profile", "email"], session: false }),
// // );

// // router.get(
// //   "/google/callback",
// //   passportAuthGoogle.authenticate("google", {
// //     failureRedirect: `${FRONTEND_URL}/login?error=google_auth_failed`,
// //     session: false,
// //   }),
// //   async function (req, res) {
// //     try {
// //       const googleUser = req.user as GoogleAuthUser | undefined;
// //       if (!googleUser) {
// //         return res.redirect(`${FRONTEND_URL}/login?error=google_auth_failed`);
// //       }

// //       const result = await userService.googleAuth(googleUser);

// //       if (result.refreshToken) {
// //         setRefreshCookie(res, result.refreshToken);
// //       }

// //       const body = result.body as { success?: boolean };
// //       if (!body.success) {
// //         return res.redirect(`${FRONTEND_URL}/login?error=google_auth_failed`);
// //       }

// //       return res.redirect(`${FRONTEND_URL}/`);
// //     } catch {
// //       return res.redirect(`${FRONTEND_URL}/login?error=google_auth_failed`);
// //     }
// //   },
// // );

// // export default router;

// import { Router, type Request, type Response } from "express";
// import { z } from "zod";
// import { validate } from "@/middleware/validate";
// import { authenticate } from "@/middleware/auth";
// import { normalLimiter, strictLimiter } from "@/middleware/rate-limit";
// import { setRefreshCookie, clearRefreshCookie } from "@/utils/cookie";
// import * as userService from "@/services/user.service";
// import { REFRESH_COOKIE } from "@/config";
// import { FRONTEND_URL } from "@/config";
// import { passportAuthGoogle, type GoogleAuthUser } from "@/lib/auth";
// import type { ApiResponse } from "@/types/api-response";

// const router = Router();

// const authSchema = z.object({
//   email: z.email({ message: "Invalid email" }),
//   password: z
//     .string({ message: "Password is required" })
//     .min(4, { message: "Minimum password length is 4" }),
// });

// router.get(
//   "/google",
//   passportAuthGoogle.authenticate("google", { scope: ["profile", "email"], session: false }),
// );

// router.get(
//   "/google/callback",
//   passportAuthGoogle.authenticate("google", {
//     failureRedirect: `${FRONTEND_URL}/login?error=google_auth_failed`,
//     session: false,
//   }),
//   async function (req, res) {
//     try {
//       const googleUser = req.user as GoogleAuthUser | undefined;
//       if (!googleUser) {
//         return res.redirect(`${FRONTEND_URL}/login?error=google_auth_failed`);
//       }

//       const result = await userService.googleAuth(googleUser);

//       if (result.refreshToken) {
//         setRefreshCookie(res, result.refreshToken);
//       }

//       const body = result.body as { success?: boolean; accessToken?: string; token?: string };

//       if (!body.success) {
//         return res.redirect(`${FRONTEND_URL}/login?error=google_auth_failed`);
//       }

//       const accessToken = body.accessToken ?? body.token;
//       const redirectUrl = accessToken
//         ? `${FRONTEND_URL}/auth/callback?accessToken=${encodeURIComponent(accessToken)}`
//         : `${FRONTEND_URL}/auth/callback`;

//       return res.redirect(redirectUrl);
//     } catch {
//       return res.redirect(`${FRONTEND_URL}/login?error=google_auth_failed`);
//     }
//   },
// );

// router.post("/register", normalLimiter, validate(authSchema), async (req, res) => {
//   try {
//     const result = await userService.register(req.body.email, req.body.password);
//     res.status(result.status).json(result.body);
//   } catch {
//     res.status(500).json({ success: false, error: "Registration failed" } satisfies ApiResponse);
//   }
// });

// router.post("/login", strictLimiter, validate(authSchema), async (req, res) => {
//   try {
//     const result = await userService.login(req.body.email, req.body.password);
//     if (result.refreshToken) {
//       setRefreshCookie(res, result.refreshToken);
//     }
//     res.status(result.status).json(result.body);
//   } catch (err) {
//     console.log("Login error:", err);
//     res.status(500).json({ success: false, error: "Login failed" } satisfies ApiResponse);
//   }
// });

// router.post("/refresh", strictLimiter, (req, res) => {
//   try {
//     const token = req.cookies[REFRESH_COOKIE] as string | undefined;
//     if (!token) {
//       res.status(401).json({ success: false, error: "No refresh token" } satisfies ApiResponse);
//       return;
//     }
//     const result = userService.refresh(token);
//     if (result.refreshToken) {
//       setRefreshCookie(res, result.refreshToken);
//     }
//     res.status(result.status).json(result.body);
//   } catch {
//     res.status(500).json({ success: false, error: "Token refresh failed" } satisfies ApiResponse);
//   }
// });

// router.post("/logout", (_req, res) => {
//   try {
//     clearRefreshCookie(res);
//     res.json({ success: true, message: "Logged out successfully" } satisfies ApiResponse);
//   } catch {
//     res.status(500).json({ success: false, error: "Logout failed" } satisfies ApiResponse);
//   }
// });

// router.get("/me", authenticate, (req, res) => {
//   try {
//     res.json({ success: true, data: { user: req.user } } satisfies ApiResponse);
//   } catch {
//     res.status(500).json({ success: false, error: "Failed to fetch user" } satisfies ApiResponse);
//   }
// });

// export default router;
