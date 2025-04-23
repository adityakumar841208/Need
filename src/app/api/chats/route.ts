// app/api/chats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/database/dbConnect/connection';
import Chat from '@/database/schema/chat';
import Customer from '@/database/schema/customer';
import ServiceProvider from '@/database/schema/serviceProvider';
import jwt from 'jsonwebtoken';

// Helper function to extract user ID from token
function getUserIdFromToken(req: NextRequest): string | null {
  try {
    const accessToken = req.cookies.get('accessToken')?.value;

    if (!accessToken) {
      return null;
    }

    // Use consistent secret
    const JWT_SECRET = process.env.JWT_SECRET || 'ADITYA';

    const decoded = jwt.verify(accessToken, JWT_SECRET) as any;

    // Handle different possible token structures
    const userId = decoded.userId || decoded.id || decoded.sub;

    if (!userId) {
      console.error('Token missing user ID field');
      return null;
    }

    return userId;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

// Find user in either Customer or ServiceProvider collection
async function findUserInBothCollections(userId: string) {
  let user = await Customer.findById(userId).select('name image');
  if (!user) {
    user = await ServiceProvider.findById(userId).select('name image');
  }
  return user;
}

// Create a new chat or get existing one
export async function POST(req: NextRequest) {
  try {

    // Get user ID from token instead of session
    const userId = await getUserIdFromToken(req);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const participant = await req.json();
    const otherUserId = participant.userId;

    // Check if chat already exists - no populate yet to avoid User model error
    let chat = await Chat.findOne({
      participants: {
        $all: [userId, otherUserId],
        $size: 2
      }
    });

    // If not, create new chat
    if (!chat) {
      chat = await Chat.create({
        participants: [userId, otherUserId],
        unreadCount: { [userId]: 0, [otherUserId]: 0 }
      });
    }

    // Manually fetch participants to avoid populate issues
    const participants = [];

    // Get current user info
    const currentUser = await findUserInBothCollections(userId);
    if (currentUser) participants.push(currentUser);

    // Get other participant info
    const otherUser = await findUserInBothCollections(otherUserId);
    if (otherUser) participants.push(otherUser);

    // Convert chat to plain object and add participants
    const chatObj = chat.toObject();
    chatObj.participants = participants;

    return NextResponse.json(chatObj);
  } catch (error) {
    console.error('Error creating/getting chat:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

// Get all chats for current user
export async function GET(req: NextRequest) {
  try {
    // Get user ID from token instead of session
    const userId = await getUserIdFromToken(req);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Get all chats without populate
    const chats = await Chat.find({
      participants: userId
    })
      .sort({ updatedAt: -1 });

    // Process each chat to manually add participants and last message
    const populatedChats = await Promise.all(chats.map(async (chat) => {
      const chatObj = chat.toObject();

      // Get participants from both collections
      const participants = [];
      for (const participantId of chat.participants) {
        const user = await findUserInBothCollections(participantId.toString());
        if (user) participants.push(user);
      }

      chatObj.participants = participants;

      // Populate last message if exists
      if (chat.lastMessage) {
        const lastMessageId = chat.lastMessage.toString();
        const Message = require('@/database/schema/message').default;
        const message = await Message.findById(lastMessageId);

        if (message) {
          // Find message sender
          const sender = await findUserInBothCollections(message.sender.toString());
          const messageObj = message.toObject();
          messageObj.sender = sender;
          chatObj.lastMessage = messageObj;
        }
      }

      return chatObj;
    }));

    return NextResponse.json(populatedChats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 });
  }
}