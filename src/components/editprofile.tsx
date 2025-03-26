'use client';
import { useState } from 'react';
import Image from 'next/image';
import { FaCamera, FaTimes } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

interface EditProfileProps {
    user: any;
    onClose: () => void;
    onSave: (updatedUser: any) => void;
}

export default function EditProfile({ user, onClose, onSave }: EditProfileProps) {
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        city: user.city,
        state: user.state,
        country: user.country,
        description: user.description,
    });

    const [activeTab, setActiveTab] = useState('personal');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...user,
            ...formData
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-semibold">Edit Profile</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row h-[calc(90vh-80px)]">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 border-r p-4 space-y-2">
                        <button 
                            className={`w-full text-left p-3 rounded-lg ${activeTab === 'personal' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            onClick={() => setActiveTab('personal')}
                        >
                            Personal Information
                        </button>
                        <button 
                            className={`w-full text-left p-3 rounded-lg ${activeTab === 'contact' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            onClick={() => setActiveTab('contact')}
                        >
                            Contact Details
                        </button>
                        <button 
                            className={`w-full text-left p-3 rounded-lg ${activeTab === 'services' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            onClick={() => setActiveTab('services')}
                        >
                            Services
                        </button>
                        <button 
                            className={`w-full text-left p-3 rounded-lg ${activeTab === 'photos' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            onClick={() => setActiveTab('photos')}
                        >
                            Profile & Cover Photos
                        </button>
                    </div>

                    {/* Main content */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        <form onSubmit={handleSubmit}>
                            {activeTab === 'personal' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-md"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows={4}
                                            className="w-full p-2 border rounded-md"
                                        ></textarea>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'contact' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-md"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Mobile Number</label>
                                        <input
                                            type="tel"
                                            name="mobile"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-md"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                className="w-full p-2 border rounded-md"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">State</label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                className="w-full p-2 border rounded-md"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-md"
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'photos' && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Profile Picture</label>
                                        <div className="flex items-center space-x-4">
                                            <div className="relative w-24 h-24 rounded-full overflow-hidden">
                                                <Image
                                                    src={user.profilePicture}
                                                    alt="Profile"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <Button type="button" variant="outline" className="mb-2">
                                                    <FaCamera className="w-4 h-4 mr-2" />
                                                    Upload New Photo
                                                </Button>
                                                <p className="text-xs text-gray-500">
                                                    Recommended size: 400x400px. Max 2MB.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Cover Photo</label>
                                        <div className="space-y-2">
                                            <div className="relative w-full h-40 rounded-lg overflow-hidden">
                                                <Image
                                                    src={user.coverPicture}
                                                    alt="Cover"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <Button type="button" variant="outline">
                                                <FaCamera className="w-4 h-4 mr-2" />
                                                Upload New Cover
                                            </Button>
                                            <p className="text-xs text-gray-500">
                                                Recommended size: 1200x400px. Max 5MB.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'services' && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Your Services</h3>
                                    <p className="text-sm text-gray-500">
                                        Manage the services you offer to clients.
                                    </p>
                                    
                                    <div className="space-y-4">
                                        {user.services.map((service: any, index: number) => (
                                            <div key={index} className="border rounded-lg p-4">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h4 className="font-medium">{service.name}</h4>
                                                    <button 
                                                        type="button"
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        Edit
                                                    </button>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                                                <div className="flex justify-between text-sm">
                                                    <span>${service.price}/hr</span>
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                                        {service.category}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <Button 
                                        type="button"
                                        variant="outline"
                                        className="w-full mt-4"
                                    >
                                        + Add New Service
                                    </Button>
                                </div>
                            )}

                            <div className="flex justify-end space-x-4 mt-8 pt-4 border-t">
                                <Button 
                                    type="button" 
                                    variant="outline"
                                    onClick={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}