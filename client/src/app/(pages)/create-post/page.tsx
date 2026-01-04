"use client";
import React, { useState } from 'react';
import { dummyUserData } from '@/app/assets/assets';
import { X } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const user = dummyUserData;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages([...images, ...files]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white'>
      <div className='max-w-6xl mx-auto p-6'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-slate-900 mb-2'>Create Post</h1>
          <p className='text-slate-600'>Share your thoughts with the world</p>
        </div>

        <div className='max-w-xl bg-white p-6 rounded-xl shadow-md space-y-4'>
          <div className='flex items-start gap-4'>
            <Image 
              src={user.profile_picture} 
              alt="Profile" 
              className='w-12 h-12 rounded-full shadow'
            />
            <div>
              <h2 className='font-semibold text-gray-800'>{user.full_name}</h2>
              <p className='text-sm text-gray-500'>@{user.username}</p>
            </div>
          </div>

          <textarea 
            className='w-full min-h-[100px] text-gray-600 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none'
            placeholder="What's happening?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {images.length > 0 && (
            <div className='grid grid-cols-2 gap-2'>
              {images.map((image, index) => (
                <div key={index} className='relative group'>
                  <Image 
                    src={URL.createObjectURL(image)} 
                    className='w-full h-40 object-cover rounded-lg'
                    alt={`Upload ${index}`}
                    width={200}
                    height={200}
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className='absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
                  >
                    <X className='w-4 h-4' />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className='flex justify-between items-center pt-2 border-t border-gray-200'>
            <div className='flex gap-2'>
              <label className='cursor-pointer p-2 rounded-full hover:bg-gray-100'>
                <input 
                  type="file" 
                  className='hidden' 
                  multiple 
                  accept='image/*'
                  onChange={handleImageUpload}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </label>
            </div>
            <button
              disabled={!content && images.length === 0}
              className={`px-6 py-2 cursor-pointer rounded-full font-medium ${(!content && images.length === 0) ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white transition-colors`}
              onClick={() => toast.promise(
                handleSubmit(),
                {
                  loading: "Creating post...",
                  success: <p>Post Added</p>,
                  error: <p>Failed to create post.</p>
                }
              )}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;