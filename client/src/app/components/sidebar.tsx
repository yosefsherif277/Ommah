'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { assets } from '../assets/assets'
import MenuItems from './MenuItems'
import { CirclePlus, LogOut } from 'lucide-react'
import { UserButton, useClerk } from '@clerk/nextjs'
import Link from 'next/link'

const Sidebar = ({ sidebarOpen, setSidebarOpen }: {
    sidebarOpen: boolean,
    setSidebarOpen: (open: boolean) => void
}) => {
    const router = useRouter()
    const { signOut } = useClerk()
    
    return (
        <>
            {/* Overlay للجوال */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            
            {/* السايد بار الرئيسي */}
            <div className={`
                fixed lg:sticky top-0 left-0 
                h-screen w-60 xl:w-72 bg-white border-r border-gray-200
                flex flex-col justify-between z-20
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                transition-all duration-300 ease-in-out
            `}>
                <div className='flex-1 flex flex-col overflow-y-auto'>
                    <div className='w-full'>
                        <Image 
                            onClick={() => router.push('/')} 
                            src={assets.logo} 
                            className='w-26 ml-7 my-2 cursor-pointer' 
                            alt="Logo"
                            width={104}
                            height={40}
                        />
                        <hr className='border-gray-300 mb-8' />

                        <MenuItems setSidebarOpen={setSidebarOpen} />

                        <Link 
                            href='/create-post' 
                            className='flex items-center justify-center gap-2 py-2.5 mt-6 mx-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 transition text-white cursor-pointer'
                        >
                            <CirclePlus className='w-5 h-5'/>
                            Create Post
                        </Link>
                    </div>
                </div>

                {/* قسم المستخدم في الأسفل */}
                <div className='w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between'>
                    <div className='flex gap-2 items-center cursor-pointer'>
                        <UserButton />
                        <div>
                            <h1 className='text-sm font-medium text-black'>User Full Name</h1>
                            <p className='text-xs text-gray-500'>@username</p>
                        </div>
                    </div>
                    <LogOut 
                        onClick={() => signOut()} 
                        className='w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer'
                    />
                </div>
            </div>
        </>
    )
}

export default Sidebar