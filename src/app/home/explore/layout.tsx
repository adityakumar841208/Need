"use client";

import PostUploadCard from "./postuploadcard/page";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex">
            {children}
            <div className="hidden lg:block"> 
                <PostUploadCard />
            </div>
        </div>
    );
}