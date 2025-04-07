import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "ADITYA";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "ADITYA";

export const generateAccessToken = (userId: string) => {
    return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: "1d" });  // 1 Day Expiry
};

export const generateRefreshToken = (userId: string) => {
    return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: "15d" }); // 15 Days Expiry
};

export const verifyAccessToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
        return decoded;
    } catch (error) {
        throw error;
    }
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
};
