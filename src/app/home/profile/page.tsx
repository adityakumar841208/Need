'use client';
import { useState } from 'react';
import Image from 'next/image';
import { FaMapMarkerAlt, FaClock, FaUserCheck, FaBriefcase, FaStar, FaCheck, FaPen, FaPhone, FaEnvelope, FaCamera } from 'react-icons/fa';
import { MdWork, MdVerified } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import EditProfile from '@/components/editprofile';

const dummyUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'service_provider',
    description: "Experienced professional with over 10 years in plumbing and electrical services. Dedicated to providing high-quality work and excellent customer service. Available for both residential and commercial projects.",
    mobile: '+1 (234) 567-8900',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    profilePicture: '/profile.webp',
    coverPicture: '/cover.jpg',
    services: [
        {
            name: 'Plumbing Service',
            description: 'Professional plumbing solutions for residential and commercial properties',
            price: 50,
            category: 'Plumbing',
            rating: 4.9,
            completedJobs: 124
        },
        {
            name: 'Electrical Repairs',
            description: 'Complete electrical services including installations and maintenance',
            price: 60,
            category: 'Electrical',
            rating: 4.7,
            completedJobs: 89
        }
    ],
    rating: 4.8,
    totalReviews: 213,
    completedJobs: 245,
    memberSince: 'January 2022',
    responseTime: '< 30',
    reviews: [
        {
            rating: 5,
            review: 'Excellent service! John was professional, punctual and did an amazing job fixing our plumbing issues.',
            customer: 'Sarah Mitchell',
            customerImage: '/profile.webp',
            date: '2 days ago',
            jobCategory: 'Plumbing'
        },
        {
            rating: 4,
            review: 'Very professional and efficient. Would definitely recommend!',
            customer: 'Mike Johnson',
            customerImage: '/profile.webp',
            date: '1 week ago',
            jobCategory: 'Electrical'
        },
        {
            rating: 5,
            review: 'Outstanding service! Fixed my issue quickly and professionally.',
            customer: 'Emily Brown',
            customerImage: '/profile.webp',
            date: '2 weeks ago',
            jobCategory: 'Plumbing'
        },
        {
            rating: 4,
            review: 'Very professional and efficient. Would definitely recommend!',
            customer: 'Mike Johnson',
            customerImage: '/profile.webp',
            date: '1 week ago',
            jobCategory: 'Electrical'
        },
        {
            rating: 5,
            review: 'Outstanding service! Fixed my issue quickly and professionally.',
            customer: 'Emily Brown',
            customerImage: '/profile.webp',
            date: '2 weeks ago',
            jobCategory: 'Plumbing'
        },
    ],
    isVerified: true,
    badges: ['Top Rated', 'Quick Responder', 'Background Checked'],
    availability: 'Available Now'
};


export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [visibleReviews, setVisibleReviews] = useState(3);

    return (
        <div className="min-h-screen">
            {isEditing && (
                <EditProfile 
                    user={dummyUser} 
                    onClose={() => setIsEditing(false)}
                    onSave={(updatedUser) => {
                        // Logic to handle the updated user data
                        console.log('Updated user:', updatedUser);
                        setIsEditing(false);
                    }}
                />
            )}

            {/* Cover Photo */}
            <div className="relative w-full max-h-48 sm:max-h-60 md:max-h-72 lg:max-h-80 overflow-hidden p-2">
                <Image
                    src={dummyUser.coverPicture}
                    alt="Cover"
                    width={1200}
                    height={400}
                    className="object-cover w-full h-full rounded-lg"
                />
                <button className="absolute right-2 bottom-2 sm:right-4 sm:bottom-4 bg-white p-2 rounded-full shadow-md">
                    <FaCamera className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </button>
            </div>

            {/* Profile Header */}
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 -mt-6 sm:-mt-8">
                <div className="relative">
                    <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6">
                        {/* Profile Picture */}
                        <div className="relative z-10">
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full border-3 sm:border-4 border-white overflow-hidden bg-white">
                                <Image
                                    src={dummyUser.profilePicture}
                                    alt={dummyUser.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <button className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-blue-500 p-1.5 sm:p-2 rounded-full">
                                <FaCamera className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                            </button>
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 pt-3 sm:pt-4 md:pt-12 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center justify-center md:justify-start space-x-2">
                                        <h1 className="text-2xl sm:text-3xl font-bold">{dummyUser.name}</h1>
                                        {dummyUser.isVerified && (
                                            <MdVerified className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                                        )}
                                    </div>
                                    <div className="mt-1 flex flex-wrap justify-center md:justify-start gap-3 sm:space-x-4 text-gray-500 text-sm sm:text-base">
                                        <span className="flex items-center">
                                            <FaMapMarkerAlt className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                            {dummyUser.city}, {dummyUser.state}
                                        </span>
                                        <span className="flex items-center">
                                            <MdWork className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                            {dummyUser.completedJobs} Jobs
                                        </span>
                                    </div>
                                    {/* Added Description */}
                                    <div className="mt-3 sm:mt-4 px-2 sm:pr-4 sm:px-0">
                                        <p className="text-sm sm:text-base leading-relaxed max-w-2xl">
                                            {dummyUser.description}
                                        </p>
                                        <div className="mt-2 sm:mt-3 flex flex-wrap justify-center md:justify-start gap-2">
                                            {dummyUser.badges.map((badge, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                                                >
                                                    <FaCheck className="w-2.5 h-2.5 mr-1" />
                                                    {badge}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 md:mt-0 flex justify-center md:justify-start space-x-3">
                                    <Button className='px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base'>Contact</Button>
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        <FaPen className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                                        Edit Profile
                                    </button>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="mt-5 sm:mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                                {/* Stats cards - reduced padding for mobile */}
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-[#1e293b] dark:to-[#334155] p-3 sm:p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-blue-100 dark:border-blue-900">
                                    <div className="flex items-center mb-1 sm:mb-2">
                                        <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                            <FaStar className="w-3 h-3 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400">Rating</span>
                                    </div>
                                    <div className="flex items-baseline">
                                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">{dummyUser.rating}</div>
                                        <div className="ml-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">/5.0</div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-[#312e81] dark:to-[#581c87] p-3 sm:p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-purple-100 dark:border-purple-900">
                                    <div className="flex items-center mb-1 sm:mb-2">
                                        <div className="p-1.5 sm:p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                            <FaUserCheck className="w-3 h-3 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm font-medium text-purple-600 dark:text-purple-400">Reviews</span>
                                    </div>
                                    <div className="flex items-baseline">
                                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">{dummyUser.totalReviews}</div>
                                        <div className="ml-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">total</div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-[#14532d] dark:to-[#166534] p-3 sm:p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-green-100 dark:border-green-900">
                                    <div className="flex items-center mb-1 sm:mb-2">
                                        <div className="p-1.5 sm:p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                            <FaBriefcase className="w-3 h-3 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm font-medium text-green-600 dark:text-green-400">Jobs</span>
                                    </div>
                                    <div className="flex items-baseline">
                                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">{dummyUser.completedJobs}</div>
                                        <div className="ml-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">done</div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-[#7c2d12] dark:to-[#9a3412] p-3 sm:p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-orange-100 dark:border-orange-900">
                                    <div className="flex items-center mb-1 sm:mb-2">
                                        <div className="p-1.5 sm:p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                            <FaClock className="w-3 h-3 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm font-medium text-orange-600 dark:text-orange-400">Response</span>
                                    </div>
                                    <div className="flex items-baseline">
                                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">{dummyUser.responseTime}</div>
                                        <div className="ml-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">min</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    {/* Left Column */}
                    <div className="md:col-span-2 space-y-4 sm:space-y-6">
                        {/* Services Section - remaining code stays the same */}
                        <div className="rounded-lg border shadow-sm p-4 sm:p-6">
                            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Services Offered</h2>
                            {/* Services content remains the same */}
                            <div className="space-y-3 sm:space-y-4">
                                {dummyUser.services.map((service, index) => (
                                    <div key={index} className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
                                            <div>
                                                <h3 className="font-medium text-base sm:text-lg">{service.name}</h3>
                                                <p className="text-sm sm:text-base mt-1">{service.description}</p>
                                            </div>
                                            <div className="flex justify-between sm:text-right">
                                                <span className="sm:hidden text-sm font-medium">{service.category}</span>
                                                <div>
                                                    <div className="text-lg sm:text-xl font-bold text-blue-600">${service.price}/hr</div>
                                                    <div className="text-xs sm:text-sm">{service.completedJobs} jobs</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3 sm:mt-4 flex items-center justify-between text-xs sm:text-sm">
                                            <span className="hidden sm:inline-block px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-100 text-blue-800 rounded-full">
                                                {service.category}
                                            </span>
                                            <div className="flex items-center text-yellow-400">
                                                <FaStar className="w-3 h-3 sm:w-4 sm:h-4" />
                                                <span className="ml-1 text-gray-600">{service.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reviews Section - improved mobile layout */}
                        <div className="rounded-lg shadow-lg border p-4 sm:p-6">
                            <div className="flex justify-between items-center mb-3 sm:mb-4">
                                <h2 className="text-lg sm:text-xl font-semibold">Recent Reviews</h2>
                                <span className="text-xs sm:text-sm">
                                    {dummyUser.reviews.length} reviews
                                </span>
                            </div>
                            
                            {/* Rest of the reviews section remains similar */}
                            
                        </div>
                    </div>

                    {/* Right Column - Contact/Badges/Availability */}
                    <div className="space-y-4 sm:space-y-6">
                        {/* Contact Information - Make mobile-friendly */}
                        <div className="rounded-lg shadow-sm p-4 sm:p-6 border">
                            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Contact Information</h2>
                            <div className="space-y-3 sm:space-y-4">
                                <div className="flex items-center space-x-3">
                                    <FaPhone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                                    <span className="text-sm sm:text-base">{dummyUser.mobile}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FaEnvelope className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                                    <span className="text-sm sm:text-base">{dummyUser.email}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FaMapMarkerAlt className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                                    <span className="text-sm sm:text-base">{dummyUser.address}, {dummyUser.city}, {dummyUser.state}</span>
                                </div>
                            </div>
                        </div>

                        {/* Badges - Mobile optimization */}
                        <div className="rounded-lg shadow-sm p-4 sm:p-6 border relative">
                            <button
                                className="absolute top-3 sm:top-4 right-3 sm:right-4 p-1 sm:p-1.5 transition-colors duration-200"
                            >
                                <Button className='px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs sm:text-sm'>Explore Badges</Button>
                            </button>
                            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Badges</h2>
                            <div className="space-y-2 sm:space-y-3">
                                {dummyUser.badges.map((badge, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <FaCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                                        <span className="text-sm sm:text-base">{badge}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Availability - Mobile-friendly version */}
                        <div className="rounded-lg shadow-sm p-4 sm:p-6 border relative">
                            <button
                                className="absolute top-3 sm:top-4 right-3 sm:right-4 p-1 sm:p-1.5 text-xs sm:text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                                Discover More
                            </button>
                            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Availability</h2>
                            <div className="inline-flex items-center px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-green-100 text-green-800 text-xs sm:text-sm">
                                {dummyUser.availability}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}