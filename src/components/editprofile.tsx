'use client';
import { useState } from 'react';
import Image from 'next/image';
import { FaCamera, FaTimes } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { CldUploadWidget } from 'next-cloudinary';

interface EditProfileProps {
    user: any;
    onClose: () => void;
    onSave: (updatedUser: any) => void;
    activeTab: string;
    changeTab: (tab: string) => void;
}

export default function EditProfile({ user, onClose, onSave, activeTab, changeTab }: EditProfileProps) {
    const [formData, setFormData] = useState({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        country: user.country || '',
        profilePicture: user.profilePicture || '',
        coverPicture: user.coverPicture || '',
        available: user.available || false,
        location: {
            type: user.location?.type || 'Point',
            coordinates: user.location?.coordinates || [0, 0],
        },
        description: user.description || '',
        services: Array.isArray(user.services) ? [...user.services] : [] // Add services to formData
    });
    const [isAddingServices, setIsAddingServices] = useState(false);

    const [isUploadingProfile, setIsUploadingProfile] = useState(false);
    const [isUploadingCover, setIsUploadingCover] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Include everything from formData, including services
        onSave({
            ...user,
            ...formData
        });
    };

    const handleProfileUploadSuccess = (result: any) => {
        const url = result.info.secure_url || result.info.url; // Fallback to `url`
        console.log(url)
        if (url) {
            setFormData(prev => ({
                ...prev,
                profilePicture: url,
            }));
        } else {
            console.error('No URL found in the upload result');
        }
        setIsUploadingProfile(false);
    };

    const handleCoverUploadSuccess = (result: any) => {
        console.log('Cloudinary upload result:', result); // Debugging
        const url = result.info.secure_url; // Ensure this field exists
        if (url) {
            setFormData(prev => ({
                ...prev,
                coverPicture: url,
            }));
        } else {
            console.error('No secure_url found in the upload result');
        }
        setIsUploadingCover(false);
    };

    const handleUploadStart = (type: 'profile' | 'cover') => {
        if (type === 'profile') {
            setIsUploadingProfile(true);
        } else {
            setIsUploadingCover(true);
        }
    };

    const [newService, setNewService] = useState({
        name: '',
        description: '',
        price: 0,
        category: '',
        rating: 0,
        completedJobs: 0
    });

    const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewService(prev => ({
            ...prev,
            [name.replace('service', '').toLowerCase()]: name === 'servicePrice' ? parseFloat(value) || 0 : value
        }));
    };

    const addService = () => {
        if (!newService.name || !newService.description || !newService.price || !newService.category) {
            alert('Please fill in all service fields');
            return;
        }

        setFormData(prev => ({
            ...prev,
            services: [...prev.services, newService]
        }));

        setNewService({
            name: '',
            description: '',
            price: 0,
            category: '',
            rating: 0,
            completedJobs: 0
        });

        setIsAddingServices(false);
    };

    const removeService = (index: number) => {
        setFormData(prev => ({
            ...prev,
            services: prev.services.filter((_, i) => i !== index)
        }));
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
                    <div className="w-full md:w-64 border-r p-4 space-y-2">
                        <button
                            className={`w-full text-left p-3 rounded-lg ${activeTab === 'personal' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            onClick={() => changeTab('personal')}
                        >
                            Personal Information
                        </button>
                        <button
                            className={`w-full text-left p-3 rounded-lg ${activeTab === 'contact' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            onClick={() => changeTab('contact')}
                        >
                            Contact Details
                        </button>
                        {user.role === 'serviceprovider' && <button
                            className={`w-full text-left p-3 rounded-lg ${activeTab === 'services' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            onClick={() => changeTab('services')}
                        >
                            Services
                        </button>}
                        <button
                            className={`w-full text-left p-3 rounded-lg ${activeTab === 'photos' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            onClick={() => changeTab('photos')}
                        >
                            Profile & Cover Photos
                        </button>
                        <button
                            className={`w-full text-left p-3 rounded-lg ${activeTab === 'location' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            onClick={() => changeTab('location')}
                        >
                            Location Coordinates
                        </button>
                    </div>

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
                                    {/* Availability Section */}
                                    {user.role === 'serviceprovider' && <div>
                                        <label className="block text-sm font-medium mb-1">Availability</label>
                                        <div className="flex items-center space-x-4">
                                            <label className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.available}
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            available: e.target.checked,
                                                        }))
                                                    }
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <span className="text-sm">Available</span>
                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Toggle your availability status for clients.
                                        </p>
                                    </div>}

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
                                            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500">
                                                {formData.profilePicture && formData.profilePicture !== 'undefined' ? (
                                                    <Image
                                                        src={formData.profilePicture}
                                                        alt="Profile"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <span className="text-2xl font-bold text-white">
                                                            {formData.name ? formData.name.charAt(0).toUpperCase() :
                                                                formData.email ? formData.email.charAt(0).toUpperCase() : 'U'}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <CldUploadWidget
                                                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                                                    onUpload={handleProfileUploadSuccess}
                                                    options={{
                                                        folder: 'images/profile', // Ensure the folder is set correctly
                                                        maxFiles: 1,
                                                        resourceType: "image",
                                                        clientAllowedFormats: ["jpeg", "png", "jpg", "webp"],
                                                        maxFileSize: 2000000, // 2MB
                                                    }}
                                                    onOpen={() => handleUploadStart('profile')}
                                                    onSuccess={(result: any) => handleProfileUploadSuccess(result)}
                                                >
                                                    {({ open }) => (
                                                        <div
                                                            className="mb-2 inline-block"
                                                            onClick={() => open()}
                                                        >
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                disabled={isUploadingProfile}
                                                            >
                                                                {isUploadingProfile ? (
                                                                    <span className="flex items-center">
                                                                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-blue-500 rounded-full"></div>
                                                                        Uploading...
                                                                    </span>
                                                                ) : (
                                                                    <><FaCamera className="w-4 h-4 mr-2" />Upload New Photo</>
                                                                )}
                                                            </Button>
                                                        </div>
                                                    )}
                                                </CldUploadWidget>
                                                <p className="text-xs text-gray-500">
                                                    Recommended size: 400x400px. Max 2MB.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Cover Photo</label>
                                        <div className="space-y-2">
                                            <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500">
                                                {formData.coverPicture && formData.coverPicture !== 'undefined' ? (
                                                    <Image
                                                        src={formData.coverPicture}
                                                        alt="Cover"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <Image
                                                        src='/DefaultCover.png'
                                                        alt="Cover"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                )}
                                            </div>
                                            <CldUploadWidget
                                                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                                                onUpload={handleCoverUploadSuccess}
                                                options={{
                                                    maxFiles: 1,
                                                    resourceType: "image",
                                                    clientAllowedFormats: ["jpeg", "png", "jpg", "webp"],
                                                    maxFileSize: 5000000, // 5MB
                                                }}
                                                onOpen={() => handleUploadStart('cover')}
                                                onSuccess={(result: any) => handleCoverUploadSuccess(result)}
                                            >
                                                {({ open }) => (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => open()}
                                                        disabled={isUploadingCover}
                                                    >
                                                        {isUploadingCover ? (
                                                            <span className="flex items-center"><div className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-blue-500 rounded-full"></div> Uploading...</span>
                                                        ) : (
                                                            <><FaCamera className="w-4 h-4 mr-2" />Upload New Cover</>
                                                        )}
                                                    </Button>
                                                )}
                                            </CldUploadWidget>
                                            <p className="text-xs text-gray-500">
                                                Recommended size: 1200x400px. Max 5MB.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'services' && user.role === 'serviceprovider' && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Your Services</h3>
                                    <p className="text-sm text-gray-500">
                                        Manage the services you offer to clients.
                                    </p>

                                    {isAddingServices && (
                                        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700 mb-6">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="font-medium">Add New Service</h3>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsAddingServices(false)}
                                                    className="text-gray-500 hover:text-gray-700"
                                                >
                                                    <FaTimes className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div>
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium mb-1">Service Name</label>
                                                    <input
                                                        type="text"
                                                        name="serviceName"
                                                        id="serviceName"
                                                        className="w-full p-2 border rounded-md"
                                                        placeholder="e.g. Plumbing Service"
                                                        required
                                                        value={newService.name}
                                                        onChange={handleServiceChange}
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium mb-1">Description</label>
                                                    <textarea
                                                        name="serviceDescription"
                                                        id="serviceDescription"
                                                        rows={4}
                                                        className="w-full p-2 border rounded-md"
                                                        placeholder="Provide a detailed description of your service"
                                                        required
                                                        value={newService.description}
                                                        onChange={handleServiceChange}
                                                    ></textarea>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium mb-1">Price ($/hr)</label>
                                                        <input
                                                            type="number"
                                                            name="servicePrice"
                                                            id="servicePrice"
                                                            min="0"
                                                            step="0.01"
                                                            className="w-full p-2 border rounded-md"
                                                            placeholder="50"
                                                            required
                                                            value={newService.price}
                                                            onChange={handleServiceChange}
                                                        />
                                                    </div>
                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium mb-1">Category</label>
                                                        <input
                                                            type="text"
                                                            name="serviceCategory"
                                                            id="serviceCategory"
                                                            className="w-full p-2 border rounded-md"
                                                            placeholder="e.g. Plumbing, Electrical"
                                                            required
                                                            value={newService.category}
                                                            onChange={handleServiceChange}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex justify-end space-x-2 mt-4">
                                                    <Button type="button" variant="outline" onClick={() => setIsAddingServices(false)}>
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        onClick={addService}
                                                    >
                                                        Add Service
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        {formData.services.length > 0 ? (
                                            formData.services.map((service: any, index: number) => (
                                                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <h4 className="font-medium">{service.name}</h4>
                                                        <div className="flex space-x-2">
                                                            <button
                                                                type="button"
                                                                className="text-red-600 hover:text-red-800"
                                                                onClick={() => removeService(index)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="font-medium">${service.price}/hr</span>
                                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                                            {service.category}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                <p>You haven't added any services yet.</p>
                                            </div>
                                        )}
                                    </div>

                                    {!isAddingServices && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full mt-4"
                                            onClick={() => setIsAddingServices(true)}
                                        >
                                            <span className="mr-2">+</span> Add New Service
                                        </Button>
                                    )}
                                </div>
                            )}

                            {activeTab === 'location' && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Set Your Location</h3>
                                    <p className="text-sm text-gray-500">
                                        Enter your location coordinates in latitude and longitude format or use the button to fetch your current location.
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        We store your location for calculating distances only.
                                    </p>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Latitude</label>
                                        <input
                                            type="number"
                                            name="latitude"
                                            value={formData.location?.coordinates[1] || ''}
                                            onChange={(e) => {
                                                const latitude = parseFloat(e.target.value) || 0;
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    location: {
                                                        type: 'Point',
                                                        coordinates: [prev.location?.coordinates[0] || 0, latitude],
                                                    },
                                                }));
                                            }}
                                            className="w-full p-2 border rounded-md"
                                            placeholder="e.g., 37.7749"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Longitude</label>
                                        <input
                                            type="number"
                                            name="longitude"
                                            value={formData.location?.coordinates[0] || ''}
                                            onChange={(e) => {
                                                const longitude = parseFloat(e.target.value) || 0;
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    location: {
                                                        type: 'Point',
                                                        coordinates: [longitude, prev.location?.coordinates[1] || 0],
                                                    },
                                                }));
                                            }}
                                            className="w-full p-2 border rounded-md"
                                            placeholder="e.g., -122.4194"
                                        />
                                    </div>
                                    <div className="flex justify-between items-center mt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                if (navigator.geolocation) {
                                                    navigator.geolocation.getCurrentPosition(
                                                        (position) => {
                                                            const { latitude, longitude } = position.coords;
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                location: {
                                                                    type: 'Point',
                                                                    coordinates: [longitude, latitude],
                                                                },
                                                            }));
                                                            console.log('Location fetched:', { latitude, longitude });
                                                        },
                                                        (error) => {
                                                            console.error('Error fetching location:', error);
                                                            alert('Unable to fetch location. Please allow location access.');
                                                        }
                                                    );
                                                } else {
                                                    alert('Geolocation is not supported by your browser.');
                                                }
                                            }}
                                        >
                                            Use Current Location
                                        </Button>
                                    </div>
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