import type { Response } from "express";
import fs from "fs";
import type { ClerkAuthRequest } from "../middleware/auth.js";
import imagekit from "../config/imageKit.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

export const addPost = async (req: ClerkAuthRequest, res: Response) => {
  try {
    const { userId } = await req.auth();
    const { content, post_type } = req.body;
    const images = req.files as Express.Multer.File[];

    let image_urls: string[] = [];

    if (images && images.length) {
      image_urls = await Promise.all(
        images.map(async (image) => {
          const fileBuffer = fs.readFileSync(image.path);
          const response = await imagekit.upload({
            file: fileBuffer,
            fileName: image.originalname,
            folder: `posts`,
          });
          const url = imagekit.url({
            path: response.filePath,
            transformation: [
              { quality: "auto" },
              { format: "webp" },
              { width: "1280" },
            ],
          });
          return url;
        })
      );
    }
    await Post.create({
      user: userId,
      content,
      image_urls,
      post_type,
    });
    res.json({ success: true, message: "Post created successfully" });
  } catch (error) {
    if (!(error instanceof Error)) return;
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const getFeedPosts = async (req: ClerkAuthRequest, res: Response) => {
  try {
    const { userId } = await req.auth();
    const user = await User.findById(userId);

    const userIds = user
      ? [userId, ...user.connections, ...user.following]
      : [userId];
    const posts = await Post.find({ user: { $in: userIds } })
      .populate("user")
      .sort({ createdAt: -1 });

    res.json({ success: true, posts });
  } catch (error) {
    if (!(error instanceof Error)) return;
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const likePost = async (req: ClerkAuthRequest, res: Response) => {
  try {
    const { userId } = await req.auth();
    const { postId } = req.body;

    const post = await Post.findById(postId);
    if (userId) {
      if (post?.likes_count.includes(userId)) {
        post.likes_count = post.likes_count.filter((user) => user !== userId);
        await post.save();
        res.json({ success: true, message: "Post unliked" });
      } else {
        post?.likes_count.push(userId);
        await post?.save();
        res.json({ success: true, message: "Post liked" });
      }
    }
  } catch (error) {
    if (!(error instanceof Error)) return;
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
