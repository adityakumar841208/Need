'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { BiHomeAlt2, BiChat, BiUser, BiCog, BiLogOut, BiMenu, BiNotification } from 'react-icons/bi'

interface NavItemProps {
    icon: React.ReactNode;
    text: string;
    isOpen: boolean;
    active?: boolean;
    path: string;
}

export default function Sidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const router = useRouter();

    return (
        <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} border-r transition-all duration-300 sticky h-[97vh] z-50 top-0 left-0 flex flex-col`}>
            {/* Logo and Toggle */}
            <div className="p-4 border-b flex items-center justify-between w-full">
                <h1 className={`font-bold text-xl text-blue-600 transition-all ${!isSidebarOpen && 'hidden'}`}>NEED</h1>
                {isSidebarOpen ?
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100">
                        <X size={22} />
                    </button>
                    :
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100">
                        <BiMenu size={22} />
                    </button>}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6">
                <ul className="space-y-4">
                    <NavItem icon={<BiHomeAlt2 size={22} />} text="Dashboard" isOpen={isSidebarOpen} path="/" />
                    <NavItem icon={<BiChat size={22} />} text="Chat" isOpen={isSidebarOpen} path='/chat' />
                    <NavItem icon={<BiUser size={22} />} text="Profile" isOpen={isSidebarOpen} path='/profile' />
                    <NavItem icon={<BiCog size={22} />} text="Settings" isOpen={isSidebarOpen} path='/settings' />
                </ul>
            </nav>

            {/* User Profile & Logout */}
            <div className="p-4 border-t">
                <div className={`flex items-center mb-4 ${!isSidebarOpen && 'justify-center'}`}>
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <BiUser size={20} className="text-blue-600" />
                    </div>
                    {isSidebarOpen && (
                        <div className="ml-3">
                            <p className="text-sm font-medium">John Doe</p>
                            <p className="text-xs text-gray-500">Admin</p>
                        </div>
                    )}
                </div>
                <NavItem icon={<BiLogOut size={22} />} text="Logout" isOpen={isSidebarOpen} path="/logout" />
            </div>
        </div>
    )
}

// ✅ Modify NavItem to handle navigation
const NavItem: React.FC<NavItemProps> = ({ icon, text, isOpen, path }) => {
    const router = useRouter();  // ✅ Get router inside NavItem
    const pathname = usePathname()
    const isActive = '/home' + path === pathname || path === '/' && pathname === '/home'

    return (
        <li className='list-none'>
            <button
                onClick={() => router.push('/home' + path)}  // ✅ Navigate on click
                className={`w-full flex items-center p-3 rounded-lg transition-all duration-300
                    ${isActive
                        ? 'bg-slate-900 text-white shadow-lg'
                        : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900 hover:translate-x-1'}`}>
                <span>{icon}</span>
                {isOpen && <span className="ml-3 text-sm">{text}</span>}
            </button>
        </li>
    );
}
