'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { menuItemsData } from '../assets/assets'

const MenuItems = ({ setSidebarOpen }: {
    setSidebarOpen: (open: boolean) => void
}) => {
    const pathname = usePathname()
    
    return (
        <div className='px-6 text-gray-600 space-y-1 font-medium'>
            {menuItemsData.map(({ to, label, Icon }) => (
                <Link
                    key={to}
                    href={to}
                    onClick={() => setSidebarOpen(false)}
                    className={`px-3.5 py-2 flex items-center gap-3 rounded-xl ${
                        pathname === to ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'
                    }`}
                >
                    <Icon className="w-5 h-5"/>
                    {label}
                </Link>
            ))}
        </div>
    )
}

export default MenuItems