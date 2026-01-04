import React from "react";
import { dummyUserData } from "../assets/assets";
import { User } from "../assets/assets";
import Image from "next/image";
import { MapPin, MessageCircle, Plus, UserPlus } from "lucide-react";

const UserCard = ({ user }: { user: User }) => {
  const currentUser = dummyUserData;

  const handleFollow = async () => {};
  const handleConnectionRequest = async () => {};
  return (
    <div className="p-4 pt-6 flex flex-col justify-between w-72 shadow border border-gray-200 rounded-md">
      <div className="text-center">
        <Image
          src={user.profile_picture}
          alt=""
          className="rounded-full w-16 shadow-md mx-auto"
          width={64}
          height={64}
        />
        <p className="mt-4 font-semibold text-gray-900">{user.full_name}</p>
        {user.username && (
          <p className="text-gray-500 font-light">@{user.username}</p>
        )}
        {user.bio && (
          <p className="text-gray-600 mt-2 text-center text-sm px-4">
            {user.bio}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
        <div>
          <MapPin className="w-4 h-4" />{" "}
          {user.location || "No location specified"}
        </div>
      </div>
      <div>
        <div>
          <span className="text-gray-600">
            {user.followers.length} followers
          </span>
        </div>
      </div>
      <div className="flex mt-4 gap-2">
        {/* follow button */}
        <button onClick={handleFollow} disabled={currentUser?.following.includes(user._id)} className="w-full py-2 rounded-md flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white active:scale-95 transition cursor-pointer">
          <UserPlus className="w-4 h-4" />{" "}
          {currentUser?.following.includes(user._id) ? "Following" : "Follow"}
        </button>
        {/* connection request button */}
        <button onClick={handleConnectionRequest} className="flex items-center justify-center w-16 border text-slate-600 group rounded-md cursor-pointer active:scale-95 transition">
          {currentUser?.connections.includes(user._id) ?
          <MessageCircle className="w-5 h-5 group-hover:scale-105 transition" />
            :
          <Plus className="w-5 h-5 group-hover:scale-105 transition" />
          }
        </button>
      </div>
    </div>
  );
};

export default UserCard;
