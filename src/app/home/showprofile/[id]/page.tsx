'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { FaMapMarkerAlt, FaClock, FaUserCheck, FaBriefcase, FaStar, FaCheck, FaPen, FaPhone, FaEnvelope, FaCamera } from 'react-icons/fa';
import { MdWork, MdVerified } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import { JSX } from 'react';

// Define TypeScript interfaces for the data structure
interface Service {
  name: string;
  description: string;
  price: number;
  category: string;
  rating: number;
  completedJobs: number;
}

interface Review {
  rating: number;
  review: string;
  customer: string;
  customerImage: string;
  date: string;
  jobCategory: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'service_provider' | 'client';
  description: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  country: string;
  profilePicture: string;
  coverPicture: string;
  services: Service[];
  rating: number;
  totalReviews: number;
  completedJobs: number;
  memberSince: string;
  responseTime: string;
  reviews: Review[];
  isVerified: boolean;
  badges: string[];
  availability: string;
}

// Type-safe record of user data
const usersData: Record<string, UserProfile> = {
  'user-1': {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'service_provider',
    description: "Experienced professional with over 10 years in plumbing and electrical services. Dedicated to providing high-quality work and excellent customer service. Available for both residential and commercial projects.",
    mobile: '+1 (234) 567-8900',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    profilePicture: 'https://ui-avatars.com/api/?name=John+Doe&background=random',
    coverPicture: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?q=80&w=800',
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
        customerImage: 'https://ui-avatars.com/api/?name=Sarah+Mitchell&background=random',
        date: '2 days ago',
        jobCategory: 'Plumbing'
      },
      {
        rating: 4,
        review: 'Very professional and efficient. Would definitely recommend!',
        customer: 'Mike Johnson',
        customerImage: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=random',
        date: '1 week ago',
        jobCategory: 'Electrical'
      },
      {
        rating: 5,
        review: 'Outstanding service! Fixed my issue quickly and professionally.',
        customer: 'Emily Brown',
        customerImage: 'https://ui-avatars.com/api/?name=Emily+Brown&background=random',
        date: '2 weeks ago',
        jobCategory: 'Plumbing'
      }
    ],
    isVerified: true,
    badges: ['Top Rated', 'Quick Responder', 'Background Checked'],
    availability: 'Available Now'
  },
  'user-2': {
    id: 'user-2',
    name: 'Emma Watson',
    email: 'emma@example.com',
    role: 'client',
    description: "Looking for reliable service providers for various home improvement projects. Prefer professionals with verifiable references and experience.",
    mobile: '+1 (345) 678-9012',
    address: '456 Elm St',
    city: 'Boston',
    state: 'MA',
    country: 'USA',
    profilePicture: 'https://ui-avatars.com/api/?name=Emma+Watson&background=random',
    coverPicture: 'https://images.unsplash.com/photo-1582653291997-079b4f45f91f?q=80&w=800',
    services: [],
    rating: 4.5,
    totalReviews: 15,
    completedJobs: 20,
    memberSince: 'March 2023',
    responseTime: '< 60',
    reviews: [
      {
        rating: 5,
        review: 'Great client! Clear communication and prompt payment.',
        customer: 'Bob Smith',
        customerImage: 'https://ui-avatars.com/api/?name=Bob+Smith&background=random',
        date: '1 month ago',
        jobCategory: 'Client Review'
      }
    ],
    isVerified: false,
    badges: ['Prompt Payer'],
    availability: 'Available'
  },
  'user-3': {
    id: 'user-3',
    name: 'Michael Smith',
    email: 'michael@example.com',
    role: 'service_provider',
    description: "Highly skilled plumber with 15+ years experience in residential and commercial settings. Specializing in emergency repairs, installations, and maintenance services.",
    mobile: '+1 (456) 789-0123',
    address: '789 Oak St',
    city: 'Chicago',
    state: 'IL',
    country: 'USA',
    profilePicture: 'https://ui-avatars.com/api/?name=Michael+Smith&background=random',
    coverPicture: 'https://images.unsplash.com/photo-1580341289255-5b47c98a59dd?q=80&w=800',
    services: [
      {
        name: 'Emergency Plumbing',
        description: '24/7 emergency plumbing service for leaks, bursts, and blockages',
        price: 75,
        category: 'Plumbing',
        rating: 4.9,
        completedJobs: 178
      },
      {
        name: 'Bathroom Installation',
        description: 'Complete bathroom fitting and installation services',
        price: 65,
        category: 'Plumbing',
        rating: 4.8,
        completedJobs: 92
      }
    ],
    rating: 4.9,
    totalReviews: 270,
    completedJobs: 320,
    memberSince: 'May 2019',
    responseTime: '< 15',
    reviews: [
      {
        rating: 5,
        review: 'Michael responded within minutes to our emergency. Fixed our burst pipe quickly and professionally.',
        customer: 'Laura Chen',
        customerImage: 'https://ui-avatars.com/api/?name=Laura+Chen&background=random',
        date: '3 days ago',
        jobCategory: 'Plumbing'
      },
      {
        rating: 5,
        review: 'Exceptional service. Completed our bathroom installation ahead of schedule and under budget.',
        customer: 'David Wilson',
        customerImage: 'https://ui-avatars.com/api/?name=David+Wilson&background=random',
        date: '2 weeks ago',
        jobCategory: 'Plumbing'
      }
    ],
    isVerified: true,
    badges: ['Top Rated', 'Elite Provider', 'Background Checked', 'Quick Responder'],
    availability: 'Busy Until Tomorrow'
  }
};

export default function ProfilePage(): JSX.Element {
  const params = useParams();
  const userId = params?.id as string;
  console.log(userId)
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [visibleReviews, setVisibleReviews] = useState<number>(3);

  useEffect(() => {
    const fetchUserData = async (): Promise<void> => {
      try {
        setIsLoading(true);
        
        // Simulate API delay for realistic UX
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Get user data from our hardcoded collection
        const userData = usersData[userId];
        
        if (!userData) {
          setIsError(true);
          setIsLoading(false);
          return;
        }
        
        setUser(userData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsError(true);
        setIsLoading(false);
      }
    };
    
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  // Handle showing more reviews
  const handleShowMoreReviews = (): void => {
    if (user) {
      setVisibleReviews(prev => 
        Math.min(prev + 3, user.reviews.length)
      );
    }
  };

  // Handle showing fewer reviews
  const handleShowFewerReviews = (): void => {
    setVisibleReviews(3);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Error state
  if (isError || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
        <p className="text-gray-600 mb-6">The profile you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Cover Photo */}
      <div className="relative w-full max-h-60 md:max-h-72 lg:max-h-80 overflow-hidden p-2">
        <Image
          src={user.coverPicture}
          alt="Cover"
          width={1200}
          height={400}
          className="object-cover w-full h-full rounded-lg"
        />
        {/* <button 
          className="absolute right-2 bottom-2 sm:right-4 sm:bottom-4 bg-white p-2 rounded-full shadow-md"
          type="button"
          aria-label="Change cover photo"
        >
          <FaCamera className="w-5 h-5 text-gray-600" />
        </button> */}
      </div>

      {/* Profile Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="relative">
          <div className="flex flex-col md:flex-row items-start md:space-x-6">
            {/* Profile Picture */}
            <div className="relative">
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white overflow-hidden bg-white">
                <Image
                  src={user.profilePicture}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              </div>
              <button 
                className="absolute bottom-2 right-2 bg-blue-500 p-2 rounded-full"
                type="button"
                aria-label="Change profile picture"
              >
                <FaCamera className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 pt-4 md:pt-12">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h1 className="text-3xl font-bold">{user.name}</h1>
                    {user.isVerified && (
                      <MdVerified className="w-6 h-6 text-blue-500" aria-label="Verified user" />
                    )}
                  </div>
                  <div className="mt-1 flex items-center space-x-4 text-gray-500">
                    <span className="flex items-center">
                      <FaMapMarkerAlt className="w-4 h-4 mr-1" />
                      {user.city}, {user.state}
                    </span>
                    <span className="flex items-center">
                      <MdWork className="w-4 h-4 mr-1" />
                      {user.completedJobs} Jobs Completed
                    </span>
                  </div>
                  {/* Description */}
                  <div className="mt-4 pr-4">
                    <p className="leading-relaxed max-w-2xl">
                      {user.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {user.badges.map((badge, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                        >
                          <FaCheck className="w-3 h-3 mr-1" />
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-3">
                  <Button className="px-4 py-2">Message Now</Button>
                  {/* <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    type="button"
                  >
                    <FaPen className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button> */}
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-[#1e293b] dark:to-[#334155] p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-blue-100 dark:border-blue-900">
                  <div className="flex items-center mb-2">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <FaStar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="ml-2 text-sm font-medium text-blue-600 dark:text-blue-400">Rating</span>
                  </div>
                  <div className="flex items-baseline">
                    <div className="text-3xl font-bold text-gray-800 dark:text-gray-200">{user.rating}</div>
                    <div className="ml-1 text-sm text-gray-500 dark:text-gray-400">/5.0</div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-[#312e81] dark:to-[#581c87] p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-purple-100 dark:border-purple-900">
                  <div className="flex items-center mb-2">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <FaUserCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="ml-2 text-sm font-medium text-purple-600 dark:text-purple-400">Reviews</span>
                  </div>
                  <div className="flex items-baseline">
                    <div className="text-3xl font-bold text-gray-800 dark:text-gray-200">{user.totalReviews}</div>
                    <div className="ml-1 text-sm text-gray-500 dark:text-gray-400">total</div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-[#14532d] dark:to-[#166534] p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-green-100 dark:border-green-900">
                  <div className="flex items-center mb-2">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                      <FaBriefcase className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="ml-2 text-sm font-medium text-green-600 dark:text-green-400">Jobs</span>
                  </div>
                  <div className="flex items-baseline">
                    <div className="text-3xl font-bold text-gray-800 dark:text-gray-200">{user.completedJobs}</div>
                    <div className="ml-1 text-sm text-gray-500 dark:text-gray-400">completed</div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-[#7c2d12] dark:to-[#9a3412] p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-orange-100 dark:border-orange-900">
                  <div className="flex items-center mb-2">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                      <FaClock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span className="ml-2 text-sm font-medium text-orange-600 dark:text-orange-400">Response</span>
                  </div>
                  <div className="flex items-baseline">
                    <div className="text-3xl font-bold text-gray-800 dark:text-gray-200">{user.responseTime}</div>
                    <div className="ml-1 text-sm text-gray-500 dark:text-gray-400">min</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Services Section */}
            {user.services.length > 0 && (
              <div className="rounded-lg border shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Services Offered</h2>
                <div className="space-y-4">
                  {user.services.map((service, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{service.name}</h3>
                          <p className="mt-1">{service.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-blue-600">${service.price}/hr</div>
                          <div className="text-sm">{service.completedJobs} jobs</div>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-sm">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                          {service.category}
                        </span>
                        <div className="flex items-center text-yellow-400">
                          <FaStar className="w-4 h-4" />
                          <span className="ml-1 text-gray-600">{service.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            {user.reviews.length > 0 && (
              <div className="rounded-lg shadow-lg border p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Recent Reviews</h2>
                  <span className="text-sm">
                    {user.reviews.length} reviews
                  </span>
                </div>
                <div className="space-y-6">
                  {user.reviews.slice(0, visibleReviews).map((review, index) => (
                    <div
                      key={index}
                      className="border-b pb-6 last:border-b-0 transition-colors duration-200 p-4 rounded-lg"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="relative">
                          <Image
                            src={review.customerImage}
                            alt={review.customer}
                            width={40}
                            height={40}
                            className="rounded-full ring-2 ring-gray-100"
                          />
                          <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2" 
                               aria-hidden="true"></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{review.customer}</h3>
                            <span className="text-sm">{review.date}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  className={`w-4 h-4 ${i < review.rating
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                  }`}
                                  aria-hidden="true"
                                />
                              ))}
                            </div>
                            <span className="ml-2 text-sm px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                              {review.jobCategory}
                            </span>
                          </div>
                          <p className="mt-2 text-gray-600 leading-relaxed">{review.review}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Show More Button */}
                {visibleReviews < user.reviews.length && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={handleShowMoreReviews}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      type="button"
                    >
                      Show More Reviews
                      <svg className="ml-2 -mr-1 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Show Less Button */}
                {visibleReviews > 3 && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={handleShowFewerReviews}
                      className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                      type="button"
                    >
                      Show Less
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="rounded-lg shadow-sm p-6 border">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FaPhone className="w-5 h-5" />
                  <span>{user.mobile}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="w-5 h-5" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaMapMarkerAlt className="w-5 h-5" />
                  <span>{user.address}, {user.city}, {user.state}</span>
                </div>
              </div>
            </div>

            {/* Badges */}
            {user.badges.length > 0 && (
              <div className="rounded-lg shadow-sm p-6 border">
                <h2 className="text-xl font-semibold mb-4">Badges</h2>
                <div className="space-y-3">
                  {user.badges.map((badge, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <FaCheck className="w-5 h-5 text-green-500" />
                      <span>{badge}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Availability */}
            <div className="rounded-lg shadow-sm p-6 border">
              <h2 className="text-xl font-semibold mb-4">Availability</h2>
              <div className={`inline-flex items-center px-3 py-1 rounded-full ${
                user.availability.includes('Available') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {user.availability}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}