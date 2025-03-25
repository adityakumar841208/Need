'use client';

import { MoreVertical, Search } from 'lucide-react'
import { BiChat } from 'react-icons/bi'
import { useRouter } from 'next/navigation'

export default function Chat() {
    const router = useRouter()
    return (
        <div className="h-screen flex flex-col bg-gray-50 dark:bg-black">
            {/* Header */}
            <div className="p-4 border-b bg-white dark:bg-black">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Messages</h1>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
                {/* Search */}
                <div className="mt-4 relative">
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        className="w-full p-2 pl-10 bg-gray-100 dark:text-black rounded-lg outline-none"
                    />
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
                {/* Sample chat items */}
                {[1, 2, 3].map((_, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-4 p-4 hover:bg-black cursor-pointer border-b border-gray-200 dark:border-gray-700"
                        onClick={() => router.push(`/home/chat/${i + 1}`)}
                    >
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-full flex items-center justify-center shadow-sm">
                            <BiChat className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <h3 className="font-medium text-gray-900 dark:text-gray-100">Chat {i + 1}</h3>
                                <span className="text-sm text-gray-500 dark:text-gray-400">2m ago</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                                Latest message in the conversation...
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}