"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, UserPlus, UserCheck, UserRoundPen, MessageSquare } from 'lucide-react';
import {
  dummyConnectionsData as connections,
  dummyFollowersData as followers,
  dummyFollowingData as following,
  dummyPendingConnectionsData as pendingConnections
} from '../../assets/assets';
import Image from 'next/image';

const Connections = () => {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState('Connections');

  const dataArray = [
    { label: 'Followers', value: followers, icon: Users, count: followers.length },
    { label: 'Following', value: following, icon: UserCheck, count: following.length },
    { label: 'Pending', value: pendingConnections, icon: UserRoundPen, count: pendingConnections.length },
    { label: 'Connections', value: connections, icon: UserPlus, count: connections.length },
  ];

  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='max-w-6xl mx-auto p-6'>
        {/* Title */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-slate-900 mb-2'>Connections</h1>
          <p className='text-slate-600'>Manage your network and discover new connections</p>
        </div>

        {/* Counts */}
        <div className='mb-8 flex flex-wrap gap-6'>
          {dataArray.map((item, index) => (
            <div 
              key={index} 
              className='flex flex-col items-center justify-center gap-1 border h-20 w-40 border-gray-200 bg-white shadow rounded-md cursor-pointer hover:bg-slate-50 transition'
              onClick={() => setCurrentTab(item.label)}
            >
              <b className='text-lg text-black'>{item.value.length}</b>
              <p className='text-slate-600 text-sm'>{item.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className='inline-flex flex-wrap items-center border border-gray-200 rounded-md p-1 bg-white shadow-sm mb-6'>
          {dataArray.map((tab) => (
            <button
              onClick={() => setCurrentTab(tab.label)}
              key={tab.label}
              className={`cursor-pointer flex items-center px-3 py-1 text-sm rounded-md transition-colors ${
                currentTab === tab.label 
                  ? 'bg-indigo-100 font-medium text-indigo-700' 
                  : 'text-gray-500 hover:text-black hover:bg-gray-50'
              }`}
            >
              <tab.icon className='w-4 h-4 mr-1' />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className='ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full'>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Users List */}
        <div className='flex flex-wrap gap-6 mt-6'>
          {dataArray.find((item) => item.label === currentTab)?.value.map((user) => (
            <div key={user._id} className='w-full max-w-xs flex gap-5 p-6 bg-white shadow rounded-md hover:shadow-md transition'>
              <Image 
                src={user.profile_picture} 
                alt={user.full_name} 
                className='rounded-full w-12 h-12 shadow-md object-cover'
                width={48}
                height={48}
              />
              <div className='flex-1 min-w-0'>
                <p className='font-medium text-slate-700 truncate'>{user.full_name}</p>
                <p className='text-slate-500 truncate'>@{user.username}</p>
                <p className='text-sm text-gray-600 truncate' title={user.bio}>
                  {user.bio.slice(0, 30)}...
                </p>
                <div className='flex max-sm:flex-col gap-2 mt-4'>
                  <button 
                    onClick={() => router.push(`/profile/${user._id}`)}
                    className='w-full p-2 text-sm rounded bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white cursor-pointer'
                  >
                    View Profile
                  </button>
                  
                  {currentTab === 'Following' && (
                    <button 
                      className='w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 text-black active:scale-95 transition cursor-pointer'
                    >
                      Unfollow
                    </button>
                  )}
                  {currentTab === 'Pending' && (
                    <button 
                      className='w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 text-black active:scale-95 transition cursor-pointer'
                    >
                      Accept
                    </button>
                  )}
                  {currentTab === 'Connections' && (
                    <button 
                      className='w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 text-black active:scale-95 transition cursor-pointer'
                      onClick={() => router.push(`/messages/${user._id}`)}
                    >
                      <MessageSquare />
                      Message
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Connections;