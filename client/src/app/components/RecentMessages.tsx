import { useEffect, useState } from 'react';
import { dummyRecentMessagesData, Message } from '../assets/assets';
import Image from 'next/image';
import moment from 'moment';
import Link from 'next/link';

const RecentMessages = () => {
    const [messages, setMessages] = useState<Message[]>([]);

    const fetchRecentMessages = async () => {
        setMessages(dummyRecentMessagesData);
    };

    useEffect(() => {
        fetchRecentMessages();
    }, []);

    return (
        <div className='bg-white max-w-xs mt-4 p-4 min-h-20 rounded-md shadow text-xs text-slate-800'>
            <h3 className='font-semibold text-slate-800 mb-4'>Recent Messages</h3>
            <div className='flex flex-col max-h-56 overflow-y-scroll no-scrollbar'>
                {messages.map((message) => (
                    <Link href={`/messages/${message.from_user_id._id}`} key={message._id} className='flex items-start gap-2 py-2 hover:bg-slate-100 cursor-pointer p-1 rounded'>
                        <Image 
                            src={message.from_user_id.profile_picture} 
                            alt={`${message.from_user_id.full_name}'s profile`}
                            width={32}
                            height={32}
                            className='w-8 h-8 rounded-full'
                        />
                        <div className="min-w-0 flex-1">
                            <div className='flex justify-between items-center'>
                                <p className='font-medium truncate' title={message.from_user_id.full_name}>
                                    {message.from_user_id.full_name}
                                </p>
                                <p className='text-[10px] text-slate-400'>
                                    {moment(message.createdAt).fromNow()}
                                </p>
                            </div>
                            <div className='flex justify-between items-center'>
                                <p className='text-gray-500 truncate' title={message.text || (message.media_url ? 'Media' : 'Empty message')}>
                                    {message.text || (message.media_url ? '📎 Media' : 'Empty message')}
                                </p>
                                {!message.seen && (
                                    <p className='bg-indigo-500 text-white w-4 h-4 flex items-center justify-center rounded-full text-[10px]'>
                                        1
                                    </p>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RecentMessages;