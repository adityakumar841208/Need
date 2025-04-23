// app/api/chats/[chatId]/messages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/database/dbConnect/connection';
import Message from '@/database/schema/message';
import Chat from '@/database/schema/chat';
import Customer from '@/database/schema/customer';
import ServiceProvider from '@/database/schema/serviceProvider';
import jwt from 'jsonwebtoken';

// Helper function to extract user ID from token
async function getUserIdFromToken(req: NextRequest): Promise<string | null> {
  try {
    // Get accessToken from cookie
    const accessToken = req.cookies.get('accessToken')?.value;
    // console.log('from message',accessToken);
    if (!accessToken) {
      return null;
    }
    
    // Verify the token - only extract the ID
    const decoded = jwt.verify(
      accessToken, 
      process.env.JWT_SECRET || 'ADITYA'
    ) as { userId: string };
    
    return decoded.userId; // Return just the ID
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

// Get messages for a specific chat
export async function GET(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    // Get user ID from token
    const userId = await getUserIdFromToken(req);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { chatId } = await params;
    
    // Verify user is part of this chat
    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId
    });
    
    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }
    
    // Get messages
    const messages = await Message.find({ chatId })
      .sort({ createdAt: 1 });
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// Send a message (fallback for non-socket communications)
export async function POST(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    // Get user ID from token
    const userId = await getUserIdFromToken(req);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { chatId } = params;
    const { content } = await req.json();
    
    // Verify user is part of this chat
    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId
    });
    
    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }
    
    // Create message
    const message = await Message.create({
      chatId,
      sender: userId,
      content,
      readBy: [userId]
    });
    
    // Update chat's last message and increment unread counter for recipient
    const recipientId = chat.participants.find(
      (p: any) => p.toString() !== userId
    );
    
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message._id,
      $inc: { [`unreadCount.${recipientId}`]: 1 }
    });
    
    // Populate sender info
    await message.populate('sender', 'name image');
    
    return NextResponse.json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}