'use client';

import { useTheme } from "next-themes";

export default function Footer() {

    return (
        <footer className={`bg-gray-800 py-6`}>
            <div className="max-w-7xl text-white mx-auto px-6 text-center">
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
