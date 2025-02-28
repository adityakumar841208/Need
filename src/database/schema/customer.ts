import mongoose from "mongoose";

export interface ICustomer extends mongoose.Document {
    name?: string;
    image?: string;
    email: string;
    password: string;
    address?: string;
    mobile?: number;
    auth: "custom" | "google";
    refreshToken?: string;  // Store refresh token in DB
}

const customerSchema = new mongoose.Schema<ICustomer>({
    name: { type: String, max: 255 },
    image: { type: String, max: 255 },
    email: { type: String, required: true, unique: true, match: [/\S+@\S+\.\S+/, 'Please use a valid email address'] },
    password: { type: String, minlength: 8 },
    address: { type: String, max: 500 },
    mobile: { type: Number },
    auth: { type: String, enum: ["custom", "google"], required: true },
    refreshToken: { type: String },  // Store refresh token
});

const Customer = mongoose.models.Customer || mongoose.model<ICustomer>("Customer", customerSchema);

export default Customer;
