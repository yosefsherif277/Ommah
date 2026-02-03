import type { Response } from "express";
import type { ClerkAuthRequest } from "../middleware/auth.js";
import User from "../models/User.js";
import fs from "fs";
import imagekit from "../config/imageKit.js";
import Connection from "../models/Connection.js";
import Post from "../models/Post.js";
import { inngest } from "../inngest/index.js";

export const getUserData = async (req: ClerkAuthRequest, res: Response) => {
  try {
    const { userId } = await req.auth();
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, data: { user } });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    res.json({ success: false, error: errMsg });
  }
};

export const updateUserData = async (req: ClerkAuthRequest, res: Response) => {
  try {
    const { userId } = await req.auth();
    let { username, bio, location, full_name } = req.body;
    const tempUser = await User.findById(userId);

    !username && (username = tempUser?.username);
    if (tempUser?.username !== username) {
      const user = await User.findOne({ username });
      if (user) {
        username = tempUser?.username;
      }
    }
    const updatedData: {
      username: any;
      bio: any;
      location: any;
      full_name: any;
      profile_picture?: string;
      cover_photo?: string;
    } = {
      username,
      bio,
      location,
      full_name,
    };

    const profile =
      req.files && !Array.isArray(req.files) && req.files.profile
        ? req.files.profile[0]
        : undefined;
    const cover =
      req.files && !Array.isArray(req.files) && req.files.cover
        ? req.files.cover[0]
        : undefined;

    if (profile) {
      const buffer = fs.readFileSync(profile.path);
      const response = await imagekit.upload({
        file: buffer,
        fileName: profile.originalname,
      });
      const url = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "512" },
        ],
      });
      updatedData.profile_picture = url;
    }
    if (cover) {
      const buffer = fs.readFileSync(cover.path);
      const response = await imagekit.upload({
        file: buffer,
        fileName: cover.originalname,
      });
      const url = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "1280" },
        ],
      });
      updatedData.cover_photo = url;
    }
    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

    res.json({
      success: true,
      data: { user },
      message: "profile updated successfully",
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    res.json({ success: false, error: errMsg });
  }
};

export const discoverUsers = async (req: ClerkAuthRequest, res: Response) => {
  try {
    const { userId } = await req.auth();
    const { input } = req.body;

    const allUsers = await User.find({
      $or: [
        { username: new RegExp(input, "i") },
        { email: new RegExp(input, "i") },
        { location: new RegExp(input, "i") },
        { full_name: new RegExp(input, "i") },
      ],
    });
    const filteredUsers = allUsers.filter((user) => user.id !== userId);
    res.json({ success: true, data: { users: filteredUsers } });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    res.json({ success: false, error: errMsg });
  }
};

export const followUsers = async (req: ClerkAuthRequest, res: Response) => {
  try {
    const { userId } = await req.auth();
    const { id } = req.body;

    const user = await User.findById(userId);
    if (user?.following.includes(id)) {
      return res.json({
        success: false,
        message: "You are already following this user",
      });
    }

    user?.following.push(id);
    await user?.save();

    const toUser = await User.findById(id);
    if (userId) {
      toUser?.followers.push(userId);
    }
    await toUser?.save();
    res.json({ success: true, message: "You are now following this user" });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    res.json({ success: false, error: errMsg });
  }
};

export const unfollowUsers = async (req: ClerkAuthRequest, res: Response) => {
  try {
    const { userId } = await req.auth();
    const { id } = req.body;

    const user = await User.findById(userId);

    if (user) {
      if (user.following) {
        user.following = user.following.filter(
          (followingId) => followingId !== id
        );
      }
      await user.save();
    }

    const toUser = await User.findById(id);
    if (toUser) {
      if (toUser.followers) {
        toUser.followers = toUser.followers.filter(
          (followerId) => followerId !== userId
        );
      }
      await toUser.save();
    }

    res.json({
      success: true,
      message: "You are no longer following this user",
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    res.json({ success: false, error: errMsg });
  }
};

// Send connection request

export const sendConnectionRequest = async (
  req: ClerkAuthRequest,
  res: Response
) => {
  try {
    const { userId } = await req.auth();
    const { id } = req.body;

    const last24hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const connectionRequests = await Connection.find({
      from_user_id: userId,
      createdAt: { $gt: last24hours },
    });
    if (connectionRequests.length >= 20) {
      return res.json({
        success: false,
        message:
          "You have reached the limit of connection requests for today. Please try again later.",
      });
    }

    const connection = await Connection.findOne({
      $or: [
        { from_user_id: userId, to_user_id: id },
        { from_user_id: id, to_user_id: userId },
      ],
    });

    if (!connection) {
      const newConnection = await Connection.create({
        from_user_id: userId,
        to_user_id: id,
      });

      await inngest.send({
        name: "app/connection-request",
        data: { connectionId: newConnection._id },
      });

      return res.json({
        success: true,
        message: "Connection request sent successfully.",
      });
    } else if (connection && connection.status === "accepted") {
      return res.json({
        success: false,
        message: "You are already connected with this user.",
      });
    }
    res.json({ success: false, message: "A connection request is pending" });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    res.json({ success: false, error: errMsg });
  }
};

export const getUserConnections = async (
  req: ClerkAuthRequest,
  res: Response
) => {
  try {
    const { userId } = await req.auth();
    const user = await User.findById(userId).populate(
      "connections followers following"
    );

    const connections = user?.connections;
    const followers = user?.followers;
    const following = user?.following;

    const pendingConnections = (
      await Connection.find({
        to_user_id: userId,
        status: "pending",
      }).populate("from_user_id")
    ).map((connection) => connection.from_user_id);
    res.json({
      success: true,
      connections,
      followers,
      following,
      pendingConnections,
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    res.json({ success: false, error: errMsg });
  }
};

export const acceptConnectionRequest = async (
  req: ClerkAuthRequest,
  res: Response
) => {
  try {
    const { userId } = await req.auth();
    const { id } = req.body;
    const connection = await Connection.findOne({
      from_user_id: id,
      to_user_id: userId,
    });
    if (!connection) {
      return res.json({
        success: false,
        message: "Connection request not found.",
      });
    }

    const user = await User.findById(userId);
    user?.connections.push(id);
    await user?.save();

    const toUser = await User.findById(id);
    if (userId) {
      toUser?.connections.push(userId);
    }
    await toUser?.save();
    
    connection.status = "accepted";
    await connection.save();

    res.json({ success: true, message: "Connection request accepted." });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    res.json({ success: false, error: errMsg });
  }
};

export const getUserProfiles = async (
  req: ClerkAuthRequest,
  res: Response) => {
    try {
      const {profileId } = req.body;
      const profile = await User.findById(profileId);
      if (!profile) {
        return res.json({ success: false, message: "User not found" });
      }
      const post = await Post.find({ user: profileId }).populate('user')
      res.json({ success: true, profile, post });
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Unknown error";
    res.json({ success: false, error: errMsg });
    }
  }