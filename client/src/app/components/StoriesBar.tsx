"use client";

import { useEffect, useState } from "react";
import { dummyStoriesData, Story } from "../assets/assets";
import moment from "moment";
import { Plus } from "lucide-react";
import StoryModal from "./StoryModal";
import StoryViewer from "./StoryViewer";
import Image from "next/image";

const StoriesBar = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [viewStory, setViewStory] = useState<Story | null>(null);

  useEffect(() => {
    setStories(dummyStoriesData as Story[]);
  }, []);

  return (
    <div className="w-screen sm:w-[calc(100vw-240px)] lg:max-w-2xl no-scrollbar overflow-x-auto px-4">
      <div className="flex gap-4 pb-5">
        {/* بطاقة إنشاء قصة جديدة */}
        <div onClick={() => setShowModal(true)} className="rounded-lg shadow-sm min-w-[120px] max-w-[120px] max-h-40 aspect-[3/4] cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-dashed border-indigo-300 bg-gradient-to-b from-indigo-50 to-white">
          <div className="h-full flex flex-col items-center justify-center p-4">
            <div className="size-10 bg-indigo-500 rounded-full flex items-center justify-center mb-3">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm font-medium text-slate-700 text-center">
              Create Story
            </p>
          </div>
        </div>
        
        {/* عرض القصص */}
        {stories.map((story, index) => (
          <div
            onClick={() => setViewStory(story)} // تمت إزالة as Story
            key={index}
            className="relative rounded-lg shadow min-w-[120px] max-w-[120px] max-h-40 cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-b from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95"
          >
            {/* صورة المستخدم */}
            <div className="absolute size-8 top-3 left-3 z-10">
              <Image
                src={story.user.profile_picture}
                alt={story.user.username}
                width={32}
                height={32}
                className="rounded-full ring ring-gray-100 shadow"
              />
            </div>

            {/* محتوى القصة */}
            <p className="absolute top-[4.5rem] left-3 text-white/60 text-sm truncate max-w-[96px]">
              {story.content}
            </p>

            {/* تاريخ النشر */}
            <p className="text-white absolute bottom-1 right-2 z-10 text-xs">
              {moment(story.createdAt).fromNow()}
            </p>

            {/* وسائط القصة (صورة/فيديو) */}
            {story.media_type !== "text" && (
              <div className="h-full w-full overflow-hidden">
                {story.media_type === "image" ? (
                  <Image
                    src={story.media_url}
                    alt=""
                    width={120}
                    height={160}
                    className="h-full w-full object-cover hover:scale-110 transition duration-500 opacity-70 hover:opacity-80"
                  />
                ) : (
                  <video
                    src={story.media_url}
                    className="h-full w-full object-cover hover:scale-110 transition duration-500 opacity-70 hover:opacity-80"
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {showModal && <StoryModal setShowModal={setShowModal} />}
      {viewStory && <StoryViewer viewStory={viewStory} setViewStory={setViewStory} />}
    </div>
  );
};

export default StoriesBar;