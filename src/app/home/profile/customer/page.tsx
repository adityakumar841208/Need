'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaMapMarkerAlt, FaClock, FaUserCheck, FaBriefcase, FaStar, FaCheck, FaPen, FaPhone, FaEnvelope, FaCamera, FaHistory } from 'react-icons/fa';
import { MdVerified, MdOutlineHome } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import EditProfile from '@/components/editprofile';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toast } from 'sonner';
import { fetchUserProfile, updateUserProfile } from '@/store/profile/profileSlice'

// Default fallback images
const DEFAULT_PROFILE_IMAGE = '/profile-placeholder.webp';
const DEFAULT_COVER_IMAGE = '/cover-placeholder.jpg';

export default function CustomerProfile({ user, onProfileUpdate }: { user: any, onProfileUpdate: () => void }) {
    const [isEditing, setIsEditing] = useState(false);
    const [visibleHistory, setVisibleHistory] = useState(3); // Number of history items to show initially
    const [isUpdating, setIsUpdating] = useState(false); // State to track if the profile is being updated
    const dispatch = useAppDispatch();
    const [activeTab, setActiveTab] = useState('personal'); // State to manage active tab

    // Handle the case where user is null or undefined
    if (!user) {
        return <div className="min-h-screen flex items-center justify-center">User data not available</div>;
    }

    // Function to update user profile
    useEffect(() => {
        dispatch(fetchUserProfile())
    }, [dispatch])

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
                if (onProfileUpdate) {
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

    // Get user initial for fallback displays
    const userInitial = user.name ? user.name.charAt(0).toUpperCase() :
        user.email ? user.email.charAt(0).toUpperCase() : 'U';

    // Check if profile and cover images exist and are valid
    const hasProfileImage = !!user.profilePicture && user.profilePicture !== 'undefined';
    const hasCoverImage = !!user.coverPicture && user.coverPicture !== 'undefined';

    // Make sure we have fallback images
    const profileImage = hasProfileImage ? user.profilePicture : DEFAULT_PROFILE_IMAGE;
    const coverImage = hasCoverImage ? user.coverPicture : DEFAULT_COVER_IMAGE;

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
                    activeTab={activeTab}
                    changeTab={(tab: string) => setActiveTab(tab)}
                />
            )}

            {/* Cover Photo */}
            <>
                {/* Mobile Cover Photo */}
                <div className="relative w-full h-28 sm:hidden overflow-hidden rounded-b-3xl">
                    {hasCoverImage ? (
                        <Image
                            src={coverImage}
                            alt="Cover"
                            width={800}
                            height={100}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                            <span className="text-6xl font-bold text-white opacity-30">
                                {userInitial}
                            </span>
                        </div>
                    )}
                    <button className="absolute right-2 bottom-2 bg-white p-1.5 rounded-full shadow-md">
                        <FaCamera
                            className="w-4 h-4 text-gray-600"
                            onClick={() => {
                                setActiveTab('photos');
                                setIsEditing(true);
                            }}
                        />
                    </button>
                </div>

                {/* Desktop / Tablet Cover Photo */}
                <div className="relative w-full hidden sm:block h-60 md:h-72 lg:h-80 overflow-hidden rounded-b-3xl">
                    {hasCoverImage ? (
                        <Image
                            src={coverImage}
                            alt="Cover"
                            width={1200}
                            height={400}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center ">
                            <span className="text-8xl font-bold text-white opacity-30">
                                {userInitial}
                            </span>
                        </div>
                    )}
                    <button className="absolute right-4 bottom-4 bg-white p-2 rounded-full shadow-md">
                        <FaCamera
                            className="w-5 h-5 text-gray-600"
                            onClick={() => {
                                setActiveTab('photos');
                                setIsEditing(true);
                            }}
                        />
                    </button>
                </div>
            </>

            {/* Profile Header */}
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 -mt-6 sm:-mt-8">
                <div className="relative">
                    <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6">
                        {/* Profile Picture */}
                        <div className="relative z-10">
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full border-3 sm:border-4 border-white overflow-hidden bg-white">
                                {hasProfileImage ? (
                                    <Image
                                        src={profileImage}
                                        alt={user.name || 'User'}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
                                        <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                                            {userInitial}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <button className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-blue-500 p-1.5 sm:p-2 rounded-full">
                                <FaCamera className="w-3 h-3 sm:w-4 sm:h-4 text-white" onClick={() => {
                                    setActiveTab('photos');
                                    setIsEditing(true);
                                }} />
                            </button>
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 pt-3 sm:pt-4 md:pt-12 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center justify-center md:justify-start space-x-2">
                                        <h1 className="text-2xl sm:text-3xl font-bold">
                                            {user.name || 'Unnamed User'}
                                        </h1>
                                        {user.isVerified && (
                                            <MdVerified className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                                        )}
                                    </div>
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
                                        {user.location && (
                                            <span className="flex items-center">
                                                <FaMapMarkerAlt className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                                {`Lat: ${user.location.coordinates[1]}, Lng: ${user.location.coordinates[0]}`}
                                            </span>
                                        )}
                                        <span className="flex items-center">
                                            <MdOutlineHome className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                            Customer
                                        </span>
                                    </div>
                                    {/* Description */}
                                    <div className="mt-3 sm:mt-4 px-2 sm:pr-4 sm:px-0">
                                        <p className="text-sm sm:text-base leading-relaxed max-w-2xl">
                                            {user.description || "No description provided."}
                                        </p>
                                        <div className="mt-2 sm:mt-3 flex flex-wrap justify-center md:justify-start gap-2">
                                            {user.badges && user.badges.length > 0 ? (
                                                user.badges.map((badge: any, index: any) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                                                    >
                                                        <FaCheck className="w-2.5 h-2.5 mr-1" />
                                                        {badge}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-sm text-gray-500">No badges earned yet</span>
                                            )}
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

                            {/* Stats for Customer */}
                            <div className="mt-5 sm:mt-6 grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                                {/* Member Since */}
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-[#1e293b] dark:to-[#334155] p-3 sm:p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-blue-100 dark:border-blue-900">
                                    <div className="flex items-center mb-1 sm:mb-2">
                                        <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                            <FaClock className="w-3 h-3 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400">Member Since</span>
                                    </div>
                                    <div className="flex items-baseline">
                                        <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200">
                                            {user.memberSince || 'N/A'}
                                        </div>
                                    </div>
                                </div>

                                {/* Services Requested */}
                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-[#312e81] dark:to-[#581c87] p-3 sm:p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-purple-100 dark:border-purple-900">
                                    <div className="flex items-center mb-1 sm:mb-2">
                                        <div className="p-1.5 sm:p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                            <FaBriefcase className="w-3 h-3 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm font-medium text-purple-600 dark:text-purple-400">Services</span>
                                    </div>
                                    <div className="flex items-baseline">
                                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">
                                            {user.servicesRequested || 0}
                                        </div>
                                        <div className="ml-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">requested</div>
                                    </div>
                                </div>

                                {/* Reviews */}
                                <div className="bg-gradient-to-br from-green-50 to-yellow-50 dark:from-[#166534] dark:to-[#ca8a04] p-3 sm:p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-green-100 dark:border-green-900">
                                    <div className="flex items-center mb-1 sm:mb-2">
                                        <div className="p-1.5 sm:p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                            <FaStar className="w-3 h-3 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm font-medium text-green-600 dark:text-green-400">Reviews</span>
                                    </div>
                                    <div className="flex items-baseline">
                                        <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200">
                                            {user.reviews || 0}
                                        </div>
                                        <div className="ml-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">given</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* History Section */}
                <div className="mt-6 sm:mt-8">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-4">History</h2>
                    {user.history && user.history.length > 0 ? (
                        <div className="space-y-4">
                            {user.history.slice(0, visibleHistory).map((item: any, index: any) => (
                                <div key={index} className="bg-white shadow-sm rounded-lg p-4 flex items-center space-x-3">
                                    <FaHistory className="w-5 h-5 text-gray-500" />
                                    <div className="flex-1">
                                        <p className="font-medium">{item.title}</p>
                                        <p className="text-gray-500">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                            {user.history.length > visibleHistory && (
                                <button
                                    onClick={() => setVisibleHistory(visibleHistory + 3)}
                                    className="text-blue-500 hover:underline"
                                >
                                    Show more
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="bg-gray-50 shadow-sm rounded-lg p-6 text-center">
                            <p className="text-gray-500">No service history yet</p>
                        </div>
                    )}
                </div>

                {/* Contact Information */}
                <div className="mt-6 sm:mt-8 rounded-lg shadow-sm p-4 sm:p-6 border">
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
            </div>
        </div>
    );
}