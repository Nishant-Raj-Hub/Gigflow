import { Express, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { storage } from "./storage.js";
import { IUser } from "./shared/types.js";

declare global {
  namespace Express {
    interface Request {
      user?: IUser | null;
    }
  }
}

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePasswords(supplied: string, stored: string) {
  return bcrypt.compare(supplied, stored);
}

function signToken(payload: object) {
  const secret = process.env.JWT_SECRET || "change_this_secret";
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

function verifyToken(token: string) {
  const secret = process.env.JWT_SECRET || "change_this_secret";
  return jwt.verify(token, secret) as { id: string };
}

export function setupAuth(app: Express) {
  // cookie parser to read token cookie
  app.use(cookieParser());

  // middleware to attach user if token present
  app.use(async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.token as string | undefined;
      if (!token) return next();
      const data = verifyToken(token);
      if (data?.id) {
        const user = await storage.getUser(String(data.id));
        req.user = user as any;
      }
      return next();
    } catch (err) {
      return next();
    }
  });

  app.post("/api/auth/register", async (req: Request, res: Response) => {
    const { username, password, name, email } = req.body;
    if (!username || !password || !name || !email) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const existing = await storage.getUserByUsername(username);
    if (existing) return res.status(400).json({ message: "Username exists" });

    const hashed = await hashPassword(password);
    const user = await storage.createUser({ username, password: hashed, name, email });

    const token = signToken({ id: String((user as any)._id) });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(201).json({ ...user, password: undefined, token });
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Missing credentials" });

    const user = await storage.getUserByUsername(username);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await comparePasswords(password, (user as any).password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken({ id: String((user as any)._id) });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(200).json({ ...user, password: undefined, token });
  });

  app.post("/api/auth/logout", async (req: Request, res: Response) => {
    res.clearCookie("token");
    return res.json({ message: "ok" });
  });

  app.get("/api/user", (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const user = { ...req.user } as any;
    if (user.password) delete user.password;
    res.json(user);
  });
}
