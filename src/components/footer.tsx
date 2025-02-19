'use client';

import { useTheme } from "next-themes";

export default function Footer() {

    return (
        <footer className={`py-6 bg-gray-900 dark:bg-black`}>
            <div className="max-w-7xl dark:text-white text-white mx-auto px-6 text-center">
                <p>&copy; 2021 Need. All rights reserved.</p>
                <div className="mt-4">
                    <a href="#" className="text-sm text-gray-400 hover:text-gray-500">Privacy Policy</a>
                    <span className="mx-2 text-gray-400">|</span>
                    <a href="#" className="text-sm text-gray-400 hover:text-gray-500">Terms of Service</a>
                    <span className="mx-2 text-gray-400">|</span>
                    <a href="#" className="text-sm text-gray-400 hover:text-gray-500">Cookie Policy</a>        
                </div>
            </div>
        </footer>
    );
}
