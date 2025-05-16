// types/express-session.d.ts
import "express-session";

declare module "express-session" {
  interface SessionData {
    successMessage?: string | null;
    user?: {
      id: number;
      username: string;
      role: string;
      // Add more fields as needed
    };
  }
}