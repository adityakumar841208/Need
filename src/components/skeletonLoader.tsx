export default function SkeletonLoader() {
    return (
        <>
            {/* Navbar Skeleton */}
            <div className="w-full h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 fixed top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
                    {/* Logo */}
                    <div className="w-24 h-8 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
                    {/* Nav Items */}
                    <div className="hidden md:flex gap-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="w-20 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        ))}
                    </div>
                    {/* Auth Buttons */}
                    <div className="flex gap-4">
                        <div className="w-20 h-8 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
                        <div className="w-20 h-8 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
                    </div>
                </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="min-h-screen pt-16">
                {/* Hero Section */}
                <div className="py-24 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            {/* Left Content */}
                            <div className="space-y-6 animate-pulse">
                                <div className="w-32 h-6 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                                <div className="space-y-4">
                                    <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-lg w-3/4"></div>
                                    <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-lg w-2/3"></div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/6"></div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-32 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                                    <div className="w-32 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                                </div>
                            </div>
                            {/* Right Image */}
                            <div className="aspect-square bg-slate-200 dark:bg-slate-700 rounded-3xl"></div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="text-center space-y-4 mb-16 animate-pulse">
                            <div className="w-32 h-6 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto"></div>
                            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg w-2/3 mx-auto"></div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="animate-pulse p-6 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
                                    <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg mb-4"></div>
                                    <div className="space-y-3">
                                        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/5"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Skeleton */}
            <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="grid md:grid-cols-4 gap-8 animate-pulse">
                        {[1, 2, 3, 4].map((section) => (
                            <div key={section} className="space-y-4">
                                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
                                <div className="space-y-2">
                                    {[1, 2, 3, 4].map((item) => (
                                        <div key={item} className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}