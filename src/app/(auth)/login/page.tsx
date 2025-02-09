'use client';

import { Button } from "@/components/ui/button";

export default function Login() {
    
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-full max-w-md">
                <h1 className="text-3xl font-bold text-center">Login</h1>
                <form className="mt-6">
                    <div>
                        <label className="block text-gray-700">Email Address</label>
                        <input type="email" className="w-full mt-2 p-3 border border-gray-300 rounded-md" />
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700">Password</label>
                        <input type="password" className="w-full mt-2 p-3 border border-gray-300 rounded-md" />
                    </div>
                    <div className="mt-6">
                        <Button type="submit" className="w-full mt-2 p-3">Login</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}