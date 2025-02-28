import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import dbConnect from '@/database/dbConnect/connection';
import Customer from '@/database/schema/customer';
import ServiceProvider from '@/database/schema/serviceProvider';
import { generateAccessToken, generateRefreshToken } from '@/utils/auth';
import type { Account, User, Profile } from 'next-auth';
import { NextApiRequest, NextApiResponse } from 'next';

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            try {
                // Access request state from account object
                if (account) {
                    const state = (account as any).state;
                    console.log('State from URL:', state);
                }
                
                console.log('user:', user);
                console.log('account:', account);   
                console.log('profile:', profile);
                
                return true;
            } catch (error) {
                console.error('SignIn error:', error);
                return false;
            }
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};

async function auth(req: NextApiRequest, res: NextApiResponse) {
    
    
    return await NextAuth(req, res, {
        ...authOptions,
        callbacks: {
            ...authOptions.callbacks,
            async signIn(params) {
                console.log('SignIn params:', params);
                console.log("i'm the inside request", req)
                if (params.account) {
                    console.log('Modified account:', params.account);
                }
                return true;
            }
        }
    });
}

export { auth as GET, auth as POST };