"use client";
import { BadgeCheck, Heart, MessageCircle, Share2 } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { dummyUserData, Post } from "../assets/assets";
import { useState } from "react";

const PostCard = ({ post }: { post: Post }) => {
  // دالة لتحويل الهاشتاجات إلى روابط قابلة للنقر
  const processContentWithHashtags = (content: string) => {
    if (!content) return "";
    return content.replace(
      /#(\w+)/g,
      '<span class="text-indigo-600">#$1</span>'
    );
  };

  const postWithHashtags = processContentWithHashtags(post.content);
  const [likes, setLikes] = useState<string[]>(post.likes_count || []);
  const currentUser = dummyUserData;
  const handleLikes = async () => {};
  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl">
      {/* معلومات المستخدم */}
      <div
        className="inline-flex items-center gap-3 cursor-pointer"
        onClick={() => console.log("Navigate to user profile")}
      >
        <Image
          src={post.user.profile_picture}
          alt={`${post.user.username}'s profile`}
          className="w-10 h-10 rounded-full shadow"
          width={40}
          height={40}
        />
        <div>
          <div className="flex items-center space-x-1 text-black">
            <span>{post.user.full_name}</span>
            <BadgeCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-gray-500 text-sm">
            @{post.user.username} • {moment(post.createdAt).fromNow()}
          </div>
        </div>
      </div>

      {/* محتوى المنشور */}
      {post.content && (
        <div
          className="text-gray-800 text-sm whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: postWithHashtags }}
        />
      )}

      {/* معرض الصور */}
      {post.image_urls?.length > 0 && (
        <div
          className={`grid gap-2 ${
            post.image_urls.length === 1 ? "grid-cols-1" : "grid-cols-2"
          }`}
        >
          {post.image_urls.map((img, index) => (
            <Image
              src={img}
              key={index}
              className={`w-full object-cover rounded-lg ${
                post.image_urls.length === 1 ? "h-auto" : "h-48"
              }`}
              alt={`صورة المنشور ${index + 1}`}
              width={500}
              height={300}
            />
          ))}
        </div>
      )}
      <div className="flex items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-300">
                <div className="flex items-center gap-1 cursor-pointer" onClick={handleLikes}>
                    <Heart
                        className={`w-4 h-4 ${likes.includes(currentUser._id) ? "text-red-500 fill-red-500" : ""}`}
                    />
                    <span>{likes.length}</span>
                </div>
                <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{12}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Share2 className="w-4 h-4" />
                    <span>{7}</span>
                </div>
            </div>

    </div>
  );
};

export default PostCard;
