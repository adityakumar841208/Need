import { NextResponse } from 'next/server';
import dbConnect from '@/database/dbConnect/connection';
import ServiceProvider from '@/database/schema/serviceProvider';

export async function GET(req : Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId'); // Extract userId from query parameters
    // console.log(userId)
    
    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const user = await ServiceProvider.find({'id':userId});
    console.log(user)
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: error }, { status: 500 });
  }
}
