'use client';

import '@/app/globals.css';
import Sidebar from "@/components/sidebar";
import { BiNotification, BiUser, BiMenu } from "react-icons/bi";
import ModeToggle from "@/components/ui/mode-toggle";
import { useState } from "react";
import Sidebar2 from "@/components/sidebar2";
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

// Code: Layout component for dashboard

export default function Layout({ children }: { children: React.ReactNode }) {
    const [showSidebar, setShowSidebar] = useState(false);
    const router = useRouter();
    const user = useAppSelector((state) => state.profile)

    return (
        <>
            <div className="flex">
                {/* Sidebar - Hidden on mobile, always visible on larger screens */}
                <div className="hidden md:block">
                    <Sidebar />
                </div>

                {/* Mobile Sidebar - Appears only when hamburger is clicked */}
                <div
                    className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-black shadow-lg w-64 transform ${showSidebar ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out md:hidden`}
                    onClick={() => setShowSidebar(false)}
                >
                    <Sidebar2 />
                </div>

                <main className="flex-1 flex flex-col">
                    <header className="bg-white dark:bg-black border-b px-6 py-4 flex justify-between items-center sticky top-0 left-0 z-40 w-full">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white hidden md:block">Welcome {user.name?.split(' ')[0]}</h2>

                        {/* Hamburger Button (Mobile) */}
                        <button
                            className="p-2 rounded-lg hover:bg-gray-100 md:hidden"
                            onClick={() => setShowSidebar(true)}
                        >
                            <BiMenu size={22} />
                        </button>

                        <div className="flex items-center space-x-4">
                            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:text-black">
                                <BiNotification size={22} />
                            </button>
                            <ModeToggle />
                            <div className="w-8 h-8 rounded-full bg-blue-100 border border-black dark:border-white flex items-center justify-center cursor-pointer hover:bg-blue-200">
                                {user.profilePicture ? (
                                    <img
                                        src={user.profilePicture}
                                        alt="Profile"
                                        className="w-8 h-8 cursor-pointer object-cover rounded-full"
                                        onClick={() => router.push('/home/profile')}
                                    />
                                ) : (
                                    <BiUser
                                        size={32}
                                        className="text-blue-600 cursor-pointer"
                                        onClick={() => router.push('/home/profile')}
                                    />
                                )}
                            </div>
                        </div>
                    </header>

                    {children}
                </main>
            </div>

            {/* Overlay to close sidebar on mobile when clicking outside */}
            {showSidebar && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
                    onClick={() => setShowSidebar(false)}
                />
            )}
        </>
    );
}
