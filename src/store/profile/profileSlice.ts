import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

// Types
type Service = {
    name: string;
    description: string;
    price: number;
    category: string;
    rating: number;
    completedJobs: number;
};

type Review = {
    rating: number;
    review: string;
    customer: string;
    customerImage: string;
    date: string;
    jobCategory: string;
};

type History = {
    title: string;
    description: string;
    date: string;
};

interface UserProfile {
    _id: string | null;
    name: string | null;
    email: string | null;
    mobile: string | null;
    description: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    role: string | null;
    profilePicture: string | null;
    coverPicture: string | null;
    services: Service[];
    rating: number;
    totalReviews: number;
    completedJobs: number;
    reviews: Review[];
    history: History[];
    isVerified: boolean;
    badges: string[];
    availability: string | null;
    memberSince: string | null;
    responseTime: string | null;
    servicesRequested: number;
    bookmarks: string[]; // Added bookmarks field
}

interface ProfileState extends UserProfile {
    isLoading: boolean;
    isAuthenticated: boolean;
    userType: string | null; // Added to store the user type (service_provider/customer)
    error: string | null;
}

// Fetch user profile directly from API using cookies
export const fetchUserProfile = createAsyncThunk(
    'profile/fetchUserProfile',
    async (_, { rejectWithValue }) => {
        try {
            // Directly fetch from the correct API endpoint
            const response = await fetch('/api/me', {
                method: 'GET',
                credentials: 'include' // This includes cookies in the request
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch user profile: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Handle the specific response format with user and userType
            return {
                user: data.user,
                userType: data.userType
            };
        } catch (error) {
            console.error('Profile fetch error:', error);
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch profile');
        }
    }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
    'profile/updateUserProfile',
    async (updatedData: Partial<UserProfile>, { rejectWithValue }) => {
        console.log('i got a update request');
        try {
            // No need to manually include token - cookies will be sent automatically
            const response = await fetch('/api/profileUpdate', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Include cookies in the request
                body: JSON.stringify(updatedData)
            });
            
            if (!response.ok) {
                throw new Error(`Failed to update profile: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Return both user and userType from response if available
            return {
                user: data.user,
                userType: data.userType
            };
        } catch (error) {
            console.error('Profile update error:', error);
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to update profile');
        }
    }
);

// Initial state
const initialState: ProfileState = {
    _id: null,
    name: null,
    email: null,
    description: null,
    mobile: null,
    address: null,
    city: null,
    state: null,
    country: null,
    role: null,
    profilePicture: null,
    coverPicture: null,
    services: [],
    rating: 0,
    totalReviews: 0,
    completedJobs: 0,
    reviews: [],
    history: [],
    isVerified: false,
    badges: [],
    availability: null,
    memberSince: null,
    responseTime: null,
    servicesRequested: 0,
    bookmarks: [],
    // Auth/loading state
    isLoading: false,
    isAuthenticated: false,
    userType: null, // Added for user type
    error: null,
};

// Create the slice
const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        // Direct profile updates
        updateProfile(state, action: PayloadAction<Partial<UserProfile>>) {
            // Only update fields that are provided in the payload
            Object.keys(action.payload).forEach((key) => {
                const typedKey = key as keyof UserProfile;
                if (action.payload[typedKey] !== undefined) {
                    (state as any)[typedKey] = action.payload[typedKey];
                }
            });
        },

        //bookmark update
        updateUserBookmarks(state, action: PayloadAction<string[]>){
            state.bookmarks = action.payload
        },
        
        // Profile section updates
        updatePersonalInfo(state, action: PayloadAction<{ 
            name?: string; 
            description?: string;
            role?: string;
        }>) {
            if (action.payload.name !== undefined) state.name = action.payload.name;
            if (action.payload.description !== undefined) state.description = action.payload.description;
            if (action.payload.role !== undefined) state.role = action.payload.role;
        },
        
        updateContactInfo(state, action: PayloadAction<{
            email?: string;
            mobile?: string;
            address?: string;
            city?: string;
            state?: string;
            country?: string;
        }>) {
            if (action.payload.email !== undefined) state.email = action.payload.email;
            if (action.payload.mobile !== undefined) state.mobile = action.payload.mobile;
            if (action.payload.address !== undefined) state.address = action.payload.address;
            if (action.payload.city !== undefined) state.city = action.payload.city;
            if (action.payload.state !== undefined) state.state = action.payload.state;
            if (action.payload.country !== undefined) state.country = action.payload.country;
        },
        
        updatePhotos(state, action: PayloadAction<{
            profilePicture?: string;
            coverPicture?: string;
        }>) {
            if (action.payload.profilePicture !== undefined) state.profilePicture = action.payload.profilePicture;
            if (action.payload.coverPicture !== undefined) state.coverPicture = action.payload.coverPicture;
        },
        
        updateServicesOffered(state, action: PayloadAction<{
            services?: Service[];
            availability?: string;
        }>) {
            if (action.payload.services !== undefined) state.services = action.payload.services;
            if (action.payload.availability !== undefined) state.availability = action.payload.availability;
        },
        
        updateSingleService(state, action: PayloadAction<{
            index: number;
            service: Partial<Service>;
        }>) {
            const { index, service } = action.payload;
            if (index >= 0 && index < state.services.length) {
                state.services[index] = { ...state.services[index], ...service };
            }
        },
        
        addService(state, action: PayloadAction<Service>) {
            state.services.push(action.payload);
        },
        
        removeService(state, action: PayloadAction<number>) {
            state.services.splice(action.payload, 1);
        },
        
        addReview(state, action: PayloadAction<Review>) {
            state.reviews.push(action.payload);
            state.totalReviews++;
            
            // Recalculate average rating
            const totalRating = state.reviews.reduce((sum, review) => sum + review.rating, 0);
            state.rating = totalRating / state.reviews.length;
        },
        
        // Auth actions
        // logout(state) {
        //     state.isAuthenticated = false;
        //     state.userType = null;
        //     state.token = null;
        // },
        
        clearErrors(state) {
            state.error = null;
        },
        
        // Complete reset
        resetProfile: () => initialState,
    },
    extraReducers: (builder) => {
        // Handle profile fetch
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.userType = action.payload.userType;
                
                // Update all user profile fields
                if (action.payload.user) {
                    Object.keys(action.payload.user).forEach((key) => {
                        const typedKey = key as keyof UserProfile;
                        if (action.payload.user[typedKey] !== undefined) {
                            (state as any)[typedKey] = action.payload.user[typedKey];
                        }
                    });
                }
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string || 'Failed to fetch profile';
                state.isAuthenticated = false;
            })
            
        // Handle profile update
        builder
            .addCase(updateUserProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                
                // Update userType if provided
                if (action.payload.userType) {
                    state.userType = action.payload.userType;
                }
                
                // Update user data
                if (action.payload.user) {
                    Object.keys(action.payload.user).forEach((key) => {
                        const typedKey = key as keyof UserProfile;
                        if (action.payload.user[typedKey] !== undefined) {
                            (state as any)[typedKey] = action.payload.user[typedKey];
                        }
                    });
                }
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string || 'Failed to update profile';
            });
    },
});

// Export actions
export const {
    updateProfile,
    updatePersonalInfo,
    updateContactInfo,
    updatePhotos,
    updateServicesOffered,
    updateSingleService,
    addService,
    removeService,
    addReview,
    // logout,
    clearErrors,
    updateUserBookmarks,
    resetProfile
} = profileSlice.actions;

// Export selectors
export const selectProfile = (state: { profile: ProfileState }) => state.profile;
export const selectIsAuthenticated = (state: { profile: ProfileState }) => state.profile.isAuthenticated;
export const selectIsLoading = (state: { profile: ProfileState }) => state.profile.isLoading;
export const selectError = (state: { profile: ProfileState }) => state.profile.error;
export const selectUserRole = (state: { profile: ProfileState }) => state.profile.role;
export const selectUserType = (state: { profile: ProfileState }) => state.profile.userType;

// Export reducer
export default profileSlice.reducer;
