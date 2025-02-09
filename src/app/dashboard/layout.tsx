'use client';

// Code: Layout component for dashboard

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <div className="flex justify-center items-center h-screen">
                {children}
            </div>
        </div>
    );
}