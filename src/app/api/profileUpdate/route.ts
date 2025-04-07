import { NextResponse } from "next/server";
import dbConnect from "@/database/dbConnect/connection";
import Customer from "@/database/schema/customer";
import ServiceProvider from "@/database/schema/serviceProvider";
import { Types } from "mongoose";

export async function PUT(req: Request) {
    try {
        await dbConnect();

        const body = await req.json();
        const { _id, role, ...updatedFields } = body;

        console.log("Role:", role, "ID:", _id);
        console.log("Update fields:", updatedFields);

        if (!_id || !role) {
            return NextResponse.json({ error: "User ID and role are required" }, { status: 400 });
        }

        // Case-insensitive role check with normalization
        const normalizedRole = role.toLowerCase();

        let updatedUser;

        // Try with ObjectId conversion
        try {
            const objectId = new Types.ObjectId(_id);

            if (normalizedRole === 'serviceprovider') {
                updatedUser = await ServiceProvider.findByIdAndUpdate(
                    objectId,
                    { $set: updatedFields },
                    { new: true, runValidators: true }
                );
                console.log("ServiceProvider update result:", updatedUser ? "Success" : "Not found");
            } else {
                updatedUser = await Customer.findByIdAndUpdate(
                    objectId,
                    { $set: updatedFields },
                    { new: true, runValidators: true }
                );
                console.log("Customer update result:", updatedUser ? "Success" : "Not found");
            }
        } catch (idError) {
            console.error("ID conversion error:", idError);
            return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
        }

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Profile updated successfully",
            user: updatedUser,
            userType: normalizedRole
        });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
