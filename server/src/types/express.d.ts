import type { UserPayload, UserSession } from "./user";

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
      session?: UserSession;
    }
  }
}
