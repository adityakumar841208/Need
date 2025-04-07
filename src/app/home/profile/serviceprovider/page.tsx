'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaMapMarkerAlt, FaClock, FaUserCheck, FaBriefcase, FaStar, FaCheck, FaPen, FaPhone, FaEnvelope, FaCamera } from 'react-icons/fa';
import { MdWork, MdVerified } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import EditProfile from '@/components/editprofile';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateUserProfile, fetchUserProfile, selectProfile, selectIsLoading } from '@/store/profile/profileSlice';
import { toast } from 'sonner';

// Default fallback images
const DEFAULT_PROFILE_IMAGE = '/profile.webp';
const DEFAULT_COVER_IMAGE = '/DefaultCover.png';

export default function ServiceProviderProfile({ user, onProfileUpdate }: { user: any, onProfileUpdate?:()=>void }) {
    const [isEditing, setIsEditing] = useState(false);
    const [visibleReviews, setVisibleReviews] = useState(3);
    const [isUpdating, setIsUpdating] = useState(false);
    
    // Get Redux dispatch function
    const dispatch = useAppDispatch();
    
    // Fetch user profile on component mount
    useEffect(() => {
        dispatch(fetchUserProfile());
    }, [dispatch]);

    // Make sure we have fallback images
    const profileImage = user?.profilePicture || DEFAULT_PROFILE_IMAGE;
    const coverImage = user?.coverPicture || DEFAULT_COVER_IMAGE;

    // Updated function to use the async thunk from our profile slice
    const UpdateUser = async (updatedUser: any) => {
        try {
            setIsUpdating(true);
            
            // Log the update for debugging
            console.log('Updating user:', updatedUser);
            
            // Dispatch async thunk to update user profile
            const resultAction = await dispatch(updateUserProfile(updatedUser));
            
            // Check if the action was fulfilled (success)
            if (updateUserProfile.fulfilled.match(resultAction)) {
                // Success handling
                
                toast.success('Profile updated successfully');
                console.log('Updated profile data:', resultAction.payload);
                if(onProfileUpdate){
                    onProfileUpdate(); // Call the parent function to refresh user data
                }
                
            } else {
                // Error handling for rejected action
                console.error('Update failed:', resultAction.error);
                toast.error('Failed to update profile');
            }
        } catch (error) {
            // General error handling
            console.error('Error updating profile:', error);
            toast.error('An error occurred while updating profile');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="min-h-screen">
            {isEditing && (
                <EditProfile
                    user={user}
                    onClose={() => setIsEditing(false)}
                    onSave={(updatedUser) => {
                        UpdateUser(updatedUser);
                        setIsEditing(false);
                    }}
                />
            )}

            {/* Cover Photo */}
            <div className="relative w-full max-h-60 md:max-h-72 lg:max-h-80 overflow-hidden">
                {coverImage && coverImage !== 'undefined' ? (
                    <Image
                        src={coverImage}
                        alt="Cover"
                        width={1200}
                        height={300}
                        className="w-full h-full rounded-b-lg object-cover"
                    />
                ) : (
                    <div className="w-full h-48 sm:h-60 md:h-72 lg:h-80 flex items-center justify-center rounded-b-lg overflow-hidden">
                        <Image
                            src='/DefaultCover.png'
                            alt="CoverImage"
                            width={1200}
                            height={300}
                            className="w-full h-full object-center"
                        />
                    </div>
                )}
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
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full overflow-hidden">
                                {profileImage && profileImage !== 'undefined' ? (
                                    <Image
                                        src={profileImage}
                                        alt={user.name || 'User'}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
                                        <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                                            {user.name ? user.name.charAt(0).toUpperCase() :
                                                user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                                        </span>
                                    </div>
                                )}
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
                                        <h1 className="text-2xl sm:text-3xl font-bold">{user.name}</h1>
                                        {user.isVerified && (
                                            <MdVerified className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                                        )}
                                    </div>
                                    {/* address */}
                                    <div className="mt-1 flex flex-wrap justify-center md:justify-start gap-3 sm:space-x-4 text-gray-500 text-sm sm:text-base">
                                        {(user.city || user.state) ? (
                                            <span className="flex items-center">
                                                <FaMapMarkerAlt className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                                {[user.city, user.state].filter(Boolean).join(', ')}
                                            </span>
                                        ) : (
                                            <span className="flex items-center">
                                                <FaMapMarkerAlt className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                                Location not specified
                                            </span>
                                        )}
                                        <span className="flex items-center">
                                            <MdWork className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                            {user.completedJobs ? `${user.completedJobs} Jobs` : 'No jobs yet'}
                                        </span>
                                    </div>
                                    {/* Description */}
                                    <div className="mt-3 sm:mt-4 px-2 sm:pr-4 sm:px-0">
                                        <p className="text-sm sm:text-base leading-relaxed max-w-2xl">
                                            {user.description}
                                        </p>
                                        <div className="mt-2 sm:mt-3 flex flex-wrap justify-center md:justify-start gap-2">
                                            {user.badges?.map((badge: any, index: any) => (
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
                                {/* Rating */}
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-[#1e293b] dark:to-[#334155] p-3 sm:p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-blue-100 dark:border-blue-900">
                                    <div className="flex items-center mb-1 sm:mb-2">
                                        <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                            <FaStar className="w-3 h-3 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400">Rating</span>
                                    </div>
                                    <div className="flex items-baseline">
                                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">{user.rating || '0'}</div>
                                        <div className="ml-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">/5.0</div>
                                    </div>
                                </div>

                                {/* Reviews */}
                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-[#312e81] dark:to-[#581c87] p-3 sm:p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-purple-100 dark:border-purple-900">
                                    <div className="flex items-center mb-1 sm:mb-2">
                                        <div className="p-1.5 sm:p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                            <FaUserCheck className="w-3 h-3 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm font-medium text-purple-600 dark:text-purple-400">Reviews</span>
                                    </div>
                                    <div className="flex items-baseline">
                                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">{user.totalReviews || '0'}</div>
                                        <div className="ml-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">total</div>
                                    </div>
                                </div>

                                {/* Jobs */}
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-[#14532d] dark:to-[#166534] p-3 sm:p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-green-100 dark:border-green-900">
                                    <div className="flex items-center mb-1 sm:mb-2">
                                        <div className="p-1.5 sm:p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                            <FaBriefcase className="w-3 h-3 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm font-medium text-green-600 dark:text-green-400">Jobs</span>
                                    </div>
                                    <div className="flex items-baseline">
                                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">{user.completedJobs || '0'}</div>
                                        <div className="ml-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">done</div>
                                    </div>
                                </div>

                                {/* Response Time */}
                                <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-[#7c2d12] dark:to-[#9a3412] p-3 sm:p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-orange-100 dark:border-orange-900">
                                    <div className="flex items-center mb-1 sm:mb-2">
                                        <div className="p-1.5 sm:p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                            <FaClock className="w-3 h-3 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm font-medium text-orange-600 dark:text-orange-400">Response</span>
                                    </div>
                                    <div className="flex items-baseline">
                                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">{user.responseTime || 'N/A'}</div>
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
                        {/* Services Section */}
                        <div className="rounded-lg border shadow-sm p-4 sm:p-6">
                            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Services Offered</h2>
                            <div className="space-y-3 sm:space-y-4">
                                {user.services?.length > 0 ? (
                                    user.services.map((service: any, index: any) => (
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
                                    ))
                                ) : (
                                    <div className="text-center py-4">
                                        <p className="text-gray-500">No services listed yet.</p>
                                        <Button className="mt-2">Add a Service</Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="rounded-lg shadow-lg border p-4 sm:p-6">
                            <div className="flex justify-between items-center mb-3 sm:mb-4">
                                <h2 className="text-lg sm:text-xl font-semibold">Recent Reviews</h2>
                                <span className="text-xs sm:text-sm">
                                    {user.reviews?.length || 0} reviews
                                </span>
                            </div>

                            {user.reviews?.length > 0 ? (
                                <>
                                    <div className="space-y-4">
                                        {user.reviews.slice(0, visibleReviews).map((review: any, index: any) => (
                                            <div key={index} className="border-b pb-4 last:border-b-0">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-start space-x-3">
                                                        <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                                            <Image
                                                                src={review.customerImage || '/profile.webp'}
                                                                alt={review.customer}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium">{review.customer}</div>
                                                            <div className="text-xs text-gray-500">{review.date}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="flex text-yellow-400">
                                                            {[...Array(5)].map((_, i) => (
                                                                <FaStar key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                                                            ))}
                                                        </div>
                                                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">{review.jobCategory}</span>
                                                    </div>
                                                </div>
                                                <p className="mt-2 text-sm sm:text-base">{review.review}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {user.reviews.length > visibleReviews && (
                                        <div className="mt-4 text-center">
                                            <Button
                                                variant="outline"
                                                onClick={() => setVisibleReviews(prev => prev + 3)}
                                            >
                                                Load More Reviews
                                            </Button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-gray-500">No reviews yet.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Contact/Badges/Availability */}
                    <div className="space-y-4 sm:space-y-6">
                        
                        {/* Contact Information */}
                        <div className="rounded-lg shadow-sm p-4 sm:p-6 border">
                            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Contact Information</h2>
                            <div className="space-y-3 sm:space-y-4">
                                {user.mobile ? (
                                    <div className="flex items-center space-x-3">
                                        <FaPhone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                                        <span className="text-sm sm:text-base">{user.mobile}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-3">
                                        <FaPhone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                        <span className="text-sm sm:text-base text-gray-400">Phone number not provided</span>
                                    </div>
                                )}

                                {user.email ? (
                                    <div className="flex items-center space-x-3">
                                        <FaEnvelope className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                                        <span className="text-sm sm:text-base">{user.email}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-3">
                                        <FaEnvelope className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                        <span className="text-sm sm:text-base text-gray-400">Email not provided</span>
                                    </div>
                                )}

                                {(user.address || user.city || user.state) ? (
                                    <div className="flex items-center space-x-3">
                                        <FaMapMarkerAlt className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                                        <span className="text-sm sm:text-base">
                                            {[user.address, user.city, user.state].filter(Boolean).join(', ')}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-3">
                                        <FaMapMarkerAlt className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                        <span className="text-sm sm:text-base text-gray-400">Location not provided</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Badges */}
                        <div className="rounded-lg shadow-sm p-4 sm:p-6 border relative">
                            <button
                                className="absolute top-3 sm:top-4 right-3 sm:right-4 p-1 sm:p-1.5 transition-colors duration-200"
                            >
                                <Button className='px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs sm:text-sm'>Explore Badges</Button>
                            </button>
                            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Badges</h2>
                            <div className="space-y-2 sm:space-y-3">
                                {user.badges?.map((badge: any, index: any) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <FaCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                                        <span className="text-sm sm:text-base">{badge}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Availability */}
                        <div className="rounded-lg shadow-sm p-4 sm:p-6 border relative">
                            <button
                                className="absolute top-3 sm:top-4 right-3 sm:right-4 p-1 sm:p-1.5 text-xs sm:text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                                Discover More
                            </button>
                            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Availability</h2>
                            <div className="inline-flex items-center px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-green-100 text-green-800 text-xs sm:text-sm">
                                {user.availability || 'Not specified'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}