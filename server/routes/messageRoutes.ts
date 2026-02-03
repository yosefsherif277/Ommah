import express from "express";
import upload from "../config/multer.js";
import { protect } from "../middleware/auth.js";
import { withClerkAuth } from "./userRoute.js";
import { getChatMessages, sendMessage, sseController } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get('/:userId', withClerkAuth(sseController));
messageRouter.post('/send', upload.single("image"), withClerkAuth(protect), withClerkAuth(sendMessage));
messageRouter.get('/get', withClerkAuth(protect), withClerkAuth(getChatMessages));

export default messageRouter;