import express from "express";
import type { Request, Response, NextFunction } from "express";
import {
  acceptConnectionRequest,
  discoverUsers,
  followUsers,
  getUserConnections,
  getUserData,
  sendConnectionRequest,
  unfollowUsers,
  updateUserData,
} from "../controllers/userController.js";
import { protect, type ClerkAuthRequest } from "../middleware/auth.js";
import upload from "../config/multer.js";

/**
 * Express middleware type with Clerk authentication
 */
type ClerkMiddleware = (
  req: Request | ClerkAuthRequest,
  res: Response,
  next: NextFunction
) => Promise<any> | any;

/**
 * Type-safe middleware wrapper for Clerk authenticated routes
 */
export const withClerkAuth = (
  handler: (req: ClerkAuthRequest, res: Response, next: NextFunction) => any
): ClerkMiddleware => {
  return handler as ClerkMiddleware;
};

const router = express.Router();

// مسارات المستخدم مع التحقق من الهوية
router.get("/data", withClerkAuth(protect), withClerkAuth(getUserData));

// تحديث بيانات المستخدم مع دعم رفع الصور
router.post(
  "/update",
  upload.fields([{ name: "profile", maxCount: 1 }, { name: "cover", maxCount: 1 }]),
  withClerkAuth(protect),
  withClerkAuth(updateUserData)
);

// اكتشاف مستخدمين جدد
router.post("/discover", withClerkAuth(protect), withClerkAuth(discoverUsers));

// متابعة مستخدم
router.post("/follow", withClerkAuth(protect), withClerkAuth(followUsers));

// إلغاء متابعة مستخدم
router.post("/unfollow", withClerkAuth(protect), withClerkAuth(unfollowUsers));

router.post("/connect", withClerkAuth(protect), withClerkAuth(sendConnectionRequest));
router.post("/accept", withClerkAuth(protect), withClerkAuth(acceptConnectionRequest));
router.get("/connections", withClerkAuth(protect), withClerkAuth(getUserConnections));


export default router;
