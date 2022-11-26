import { Pool } from "pg";

declare global {
  namespace Express {
    interface Request {
      _context?: {
        gidRequest?: string;
        ip?: string;
      };
    }
  }
}