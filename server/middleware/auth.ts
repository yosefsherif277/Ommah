import type { Request, Response, NextFunction } from "express";

export interface ClerkAuthRequest extends Request {
  auth: () => Promise<{ userId?: string }>;
}

export const protect = async (
  req: ClerkAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = await req.auth();
    if (!userId) {
      return res.json({ success: false, message: "not authenticated" });
    }
    next();
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    res.json({ success: false, error: errMsg });
  }
};
