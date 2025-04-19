// types/express-session.d.ts
import "express-session";

declare module "express-session" {
  interface SessionData {
    user?: {
      id: number;
      name: string;
      // Add more fields as needed
    };
  }
}