"use client";
import { dummyConnectionsData } from '@/app/assets/assets';
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import UserCard from '@/app/components/UserCard';
import Loading from '@/app/components/loading';
import { User } from '@/app/assets/assets';

const Discover = () => {
  const [input, setInput] = useState('');
  const [users, setUsers] = useState<User[]>(dummyConnectionsData);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>): Promise<void> => {
    if (e.key === "Enter") {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='max-w-6xl mx-auto p-6'>
        {/* Title */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-slate-900 mb-2'>Discover</h1>
          <p className='text-slate-600'>Connect with amazing people and grow your network</p>
        </div>

        {/* Search */}
        <div className='mb-8 shadow-md rounded-md border border-slate-200/60 bg-white/80'>
          <div className='p-6'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5' />
              <input 
                type='text' 
                placeholder='Search people by name, username, bio, or location...' 
                className='pl-10 sm:pl-12 text-gray-900 py-2 w-full border border-gray-300 rounded-md max-sm:text-sm'
                onChange={(e) => setInput(e.target.value)} 
                value={input}
                onKeyUp={handleSearch}
              />
            </div>
          </div>
        </div>
        <div className='flex flex-wrap gap-6'>
          {users.map(user => (
            <UserCard key={user._id} user={user} />
          ))}
        </div>

        {
          loading && (<Loading />)
        }
      </div>
    </div>
  );
};

export default Discover;