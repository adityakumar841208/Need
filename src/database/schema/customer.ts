import mongoose from "mongoose";

export interface ICustomer extends mongoose.Document {
  name?: string;
  email: string;
  description?: string;
  profilePicture?: string;
  coverPicture?: string;
  password: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  mobile?: number;
  auth: "custom" | "google";
  refreshToken?: string;
  role: string;
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  bookmarks?: string[]; // Array of post IDs
}

const customerSchema = new mongoose.Schema<ICustomer>({
  name: { type: String, max: 255 },
  description: { type: String, max: 1000},
  profilePicture: { type: String, max: 500 },
  coverPicture: { type: String, max: 500 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, max: 500 },
  city: { type: String, max: 255 },
  state: { type: String, max: 255 },
  country: { type: String, max: 255 },
  mobile: { type: Number },
  auth: { type: String, enum: ["custom", "google"], required: true },
  refreshToken: { type: String },
  role: { type: String, default: "customer" },

  // GeoJSON format for location
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
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }], // Array of post IDs
});

// Add 2dsphere index for efficient geospatial queries
customerSchema.index({ location: "2dsphere" });

const Customer = mongoose.models.Customer || mongoose.model<ICustomer>("Customer", customerSchema);

export default Customer;
