import type { Response } from "express";
import type { ClerkAuthRequest } from "../middleware/auth.js";
import fs from "fs";
import imagekit from "../config/imageKit.js";
import Story from "../models/Story.js";
import User from "../models/User.js";
import { inngest } from "../inngest/index.js";

export const addUserStory = async (req: ClerkAuthRequest, res: Response) => {
  try {
    const { userId } = await req.auth();
    const { content, media_type, background_color } = req.body;
    const media = req.file;
    let media_url = "";
    if ((media_type === "image" || media_type === "video") && media) {
      const fileBuffer = fs.readFileSync(media.path);
      const response = await imagekit.upload({
        file: fileBuffer,
        fileName: media.originalname,
      });
      media_url = response.url;
    }

    const story = await Story.create({
      user: userId,
      content,
      media_url,
      media_type,
      background_color,
    });

    await inngest.send({
      name: "app/story.delete",
      data: { storyId: story._id },
    });
    res.json({ success: true });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    res.json({ success: false, error: errMsg });
  }
};

export const getStories = async (req: ClerkAuthRequest, res: Response) => {
  try {
    const { userId } = await req.auth();
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    const userIds = [userId, ...user.connections, ...user.following];
    const stories = await Story.find({ user: { $in: userIds } })
      .populate("user")
      .sort({ createdAt: -1 });
    res.json({ success: true, stories });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    res.json({ success: false, error: errMsg });
  }
};
