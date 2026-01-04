import express from "express";
import upload from "../config/multer.js";
import { protect } from "../middleware/auth.js";
import { addPost, getFeedPosts, likePost } from "../controllers/postController.js";
import { withClerkAuth } from "./userRoute.js";

const postRouter = express.Router();

postRouter.post("/add", upload.array("images", 4), withClerkAuth(protect), withClerkAuth(addPost));
postRouter.get("/feed", withClerkAuth(protect), withClerkAuth(getFeedPosts));
postRouter.post("/like", withClerkAuth(protect), withClerkAuth(likePost));

export default postRouter;