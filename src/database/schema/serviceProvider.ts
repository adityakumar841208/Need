import mongoose from "mongoose";

// Review Schema
const reviewsSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    required: true,
    max: 500,
  },
  customer: {
    type: String, // Changed from ObjectId to String to match data
    required: true,
  },
  customerImage: {
    type: String,
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
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    max: 500,
  },
  price: {
    type: Number, // Kept as Number, ensure data is in correct format
    required: true,
    min: 0,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  completedJobs: {
    type: Number,
    default: 0,
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
    unique: true,
    match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
  },
  password: {
    type: String,
    minlength: 8,
  },
  auth: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
  },
  mobile: {
    type: String,
    unique: true,
    sparse: true,  // <-- this is the key!
    trim: true,
  },
  address: {
    type: String,
    max: 500,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
  profilePicture: {
    type: String,
  },
  coverPicture: {
    type: String,
  },
  memberSince: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    max: 1000,
  },
  role:{
    type: String,
    enum: ["serviceprovider", "customer"],
  },
  services: {
    type: [servicesSchema],
    default: [],
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  completedJobs: {
    type: Number,
    default: 0,
  },
  responseTime: {
    type: String,
  },
  reviews: {
    type: [reviewsSchema],
    default: [],
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: false, // Make true if location is mandatory
    },
    coordinates: {
      type: [Number],
      required: false, // Make true if location is mandatory
    }
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  badges: {
    type: [String], // Added this field to match provided data
    default: [],
  },
  available: {
    type: Boolean,
    default: true,
  },
  bookmarks:{
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Post",
  }
});

// Add 2dsphere index for efficient geospatial queries
serviceProviderSchema.index({ location: "2dsphere" });

// ServiceProvider Model
const ServiceProvider =
  mongoose.models.ServiceProvider ||
  mongoose.model("ServiceProvider", serviceProviderSchema);

export default ServiceProvider;
