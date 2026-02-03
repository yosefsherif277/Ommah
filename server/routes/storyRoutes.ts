import express from "express";
import type { Request, Response, NextFunction } from "express";
import upload from "../config/multer.js";
import { protect, type ClerkAuthRequest } from "../middleware/auth.js";
import { addUserStory, getStories } from "../controllers/storyController.js";
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

const storyRouter = express.Router();

storyRouter.post('create', upload.single('media'), withClerkAuth(protect), withClerkAuth(addUserStory));
storyRouter.get('create', withClerkAuth(protect), withClerkAuth(getStories));

export default storyRouter;