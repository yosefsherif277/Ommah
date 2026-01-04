"use client";
import Image from "next/image";
import { Star } from "lucide-react";
import {SignIn} from '@clerk/nextjs'
import { assets } from "../../assets/assets";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      {/* الخلفية */}
      <Image
        src={assets.bgImage}
        alt="Background"
        className="absolute top-0 left-0 -z-10 w-full h-full object-cover"
        fill
        priority
      />

      {/* الجانب الأيسر - واجهة العلامة التجارية */}
      <div className="flex-1 flex flex-col items-start justify-between p-6 md:p-10 lg:pl-40 bg-black/30 backdrop-blur-sm">
        {/* الشعار */}
        <Image
          src={assets.logo}
          alt="Logo"
          className="h-12 object-contain"
          width={48}
          height={48}
        />

        {/* قسم التقييم والمستخدمين */}
        <div className="w-full">
          <div className="flex items-center gap-3 mb-4 max-md:mt-18">
            <Image
              src={assets.group_users}
              alt="Group Users"
              className="h-8 md:h-10 w-auto"
              width={32}
              height={32}
            />

            <div>
              {/* النجوم */}
              <div className="flex">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={`star-${i}`}
                      className="size-4 md:size-5 text-transparent fill-amber-500"
                    />
                  ))}
              </div>
              <p className="text-sm md:text-base text-white/80">
                Used by 12k+ developers
              </p>
            </div>
          </div>

          <h1 className='text-3xl md:text-6xl md:pb-2 font-bold bg-gradient-to-r from-indigo-500 to-indigo-800 bg-clip-text text-transparent'>
            More than just friends
          </h1>
          <p className='text-xl md:text-3xl text-indigo-900 max-w-72 md:max-w-md'>
            connect with global community on Ommah.
          </p>
        </div>
        
        <span className='md:h-10'></span>
      </div>

      {/* الجانب الأيمن - نموذج التسجيل */}
      <div className='flex-1 flex items-center justify-center p-6 sm:p-10'>
        <SignIn />
      </div>
    </div>
  );
};

export default Login;