import { Request, Response, NextFunction } from "express";
import { memoryStore, db } from "../data/store";

export interface AuthRequest extends Request {
  user?: any;
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Authorization token required" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Invalid authorization token" });
    }

    let user = memoryStore.users.find((u) => u.id === token);

    if (!user && db) {
      user = await db.collection("users").findOne({ id: token });
    }

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized user" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}
