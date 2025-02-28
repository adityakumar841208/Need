import mongoose from 'mongoose';

// Review Schema
const reviewsSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    min: 1, // Ensure rating is between 1 and 5
    max: 5,
  },
  review: {
    type: String,
    required: true,
    max: 500, // Limit review length
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId, // Reference to Customer model
    ref: 'Customer',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Services Schema
const servicesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    max: 500,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
  },
});

// Service Provider Schema
const serviceProviderSchema = new mongoose.Schema({
  name: {
    type: String,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure unique emails
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address'], // Email validation
  },
  password: {
    type: String,
    minlength: 8, // Minimum password length
  },
  address: {
    type: String,
    max: 500,
  },
  mobile: {
    type: Number,
    unique: true, // Ensure unique mobile numbers
  },
  services: {
    type: [servicesSchema],
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0, // Default rating
  },
  reviews: {
    type: [reviewsSchema],
    default: [], // Default empty array for reviews
  },
  image: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  auth: {
    type: String,
    required: true, // custom, google
  },
  refreshToken: {
    type: String,
  },
});

// ServiceProvider Model
const ServiceProvider = mongoose.model('ServiceProvider', serviceProviderSchema);

export default ServiceProvider;
