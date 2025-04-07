'use client';
import { useEffect, useState, useCallback } from 'react';
import CustomerProfile from './customer/page';
import ServiceProviderProfile from './serviceprovider/page';

// Default dummy user with both customer and service provider fields
const dummyUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'service_provider', // Change to 'customer' to test customer profile
    description: "Experienced professional with over 10 years in plumbing and electrical services. Dedicated to providing high-quality work and excellent customer service. Available for both residential and commercial projects.",
    mobile: '+1 (234) 567-8900',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    profilePicture: '/profile.webp',
    coverPicture: '/cover.jpg',
    // Service provider fields
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
        }
    ],
    isVerified: true,
    badges: ['Top Rated', 'Quick Responder', 'Background Checked'],
    availability: 'Available Now',
    // Customer specific fields
    servicesRequested: 15,
    history: [
        {
            title: 'Plumbing Service Requested',
            description: 'Leaky faucet repair - Completed on March 15, 2025',
            date: '2025-03-15'
        },
        {
            title: 'Electrical Repair',
            description: 'Light fixture installation - Completed on February 28, 2025',
            date: '2025-02-28'
        },
        {
            title: 'Plumbing Emergency',
            description: 'Clogged drain - Completed on January 20, 2025',
            date: '2025-01-20'
        },
        {
            title: 'Home Maintenance',
            description: 'HVAC service - Completed on December 10, 2024',
            date: '2024-12-10'
        }
    ]
};

export default function ProfilePage() {
    const [user, setUser] = useState(dummyUser);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Create a function to fetch user data that can be called whenever needed
    const fetchUserData = useCallback(() => {
        setLoading(true);

        fetch('/api/me')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                return response.json();
            })
            .then(data => {
                console.log('User data:', data);
                if (data.user) {
                    setUser(data.user);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                setLoading(false);
                // Keep the dummy user as fallback
            });
    }, []);

    // Function to trigger a refresh that can be passed to child components
    const refreshUserData = useCallback(() => {
        setRefreshTrigger(prev => prev + 1);
    }, []);

    // Use the fetchUserData in useEffect, triggered by initial load and refreshTrigger
    useEffect(() => {
        fetchUserData();
    }, [fetchUserData, refreshTrigger]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
    }

    // Render the appropriate profile component based on user role
    return (
        <>
            {user.role === 'customer' ? (
                <CustomerProfile user={user} onProfileUpdate={refreshUserData} />
            ) : (
                <ServiceProviderProfile user={user} onProfileUpdate={refreshUserData} />
            )}
        </>
    );
}