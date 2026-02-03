import type { Response } from "express";
import type { ClerkAuthRequest } from "../middleware/auth.js";
import fs from "fs";
import imagekit from "../config/imageKit.js";
import Message from "../models/message.js";

const connection: { [key: string]: Response } = {};

export const sseController = (req: ClerkAuthRequest, res: Response) => {
  const { userId } = req.params;
  if (!userId) {
    res.status(400).send("User ID is required");
    return;
  }
  console.log("New client connected : ", userId);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  connection[userId] = res;

  res.write("log: Connected to SEE stream\n\n");

  req.on("close", () => {
    delete connection[userId];
    console.log("Client disconnected");
  });
};

export const sendMessage = async (req: ClerkAuthRequest, res: Response) => {
  try {
    const { userId } = await req.auth();
    const { to_user_id, text } = req.body;
    const image = req.file;

    let media_url = "";
    let message_type = image ? "image" : "text";
    if (message_type === "image" && image) {
      const fileBuffer = fs.readFileSync(image.path);
      const response = await imagekit.upload({
        file: fileBuffer,
        fileName: image.originalname,
      });
      media_url = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "1280" },
        ],
      });
    }

    const message = await Message.create({
      from_user: userId,
      to_user_id,
      text,
      message_type,
      media_url,
    });

    res.json({ success: true, message });

    const messageWithUserData = await Message.findById(message._id).populate(
      "from_user_id"
    );

    if (connection[to_user_id]) {
      connection[to_user_id].write(
        `data: ${JSON.stringify(messageWithUserData)}\n\n`
      );
    }
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    res.json({ success: false, error: errMsg });
  }
};

export const getChatMessages = async (req: ClerkAuthRequest, res: Response) => {
    try {
        const { userId } = await req.auth();
        const { to_user_id } = req.body;

        const message = await Message.find({
            $or: [
                { from_user: userId, to_user_id },
                { from_user: to_user_id, to_user_id: userId }
            ]
        }).sort({ createdAt: 1 });
        await Message.updateMany(
          { from_user: to_user_id, to_user_id: userId, seen: false },
          { seen: true }
        );
        res.json({ success: true, message });
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : "Unknown error";
        res.json({ success: false, error: errMsg });
    }
}

export const getUserRecentMessages = async (req: ClerkAuthRequest, res: Response) => {
    try {
        const {userId} = await req.auth();
        const messages = await Message.find({
            to_user_id: userId
        }).populate("from_user_id to_user_id").sort({ createdAt: -1 });
        res.json({ success: true, messages });
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : "Unknown error";
        res.json({ success: false, error: errMsg });
    }
}