import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "@/config";
import type { UserPayload } from "@/types/user";

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: "Unauthorized", success: false });
    return;
  }
  try {
    req.user = jwt.verify(token, JWT_PASSWORD) as UserPayload;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token", success: false });
  }
}
