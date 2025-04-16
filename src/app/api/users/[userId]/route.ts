import { NextResponse } from 'next/server';
import dbConnect from '@/database/dbConnect/connection';
import ServiceProvider from '@/database/schema/serviceProvider';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await dbConnect();
    const userId = params.userId; // Get userId from route params instead of search params
    
    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const user = await ServiceProvider.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error }, { status: 500 });
  }
}