import { NextRequest, NextResponse } from 'next/server';
import Message from '@/database/schema/message';
import Chat from '@/database/schema/chat';
import dbConnect from '@/database/dbConnect/connection';

export async function POST(request: NextRequest) {
  await dbConnect();
  
  try {
    // Parse request body
    const body = await request.json();
    const { chatId, content, sender, readBy } = body;
    // console.log('Request body:', body);
    
    // Validate required fields
    if (!chatId || !content || !sender) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create message in database
    const newMessage = await Message.create({
      chatId,
      sender,
      content,
      readBy: readBy || [sender]
    });

    // Update chat with latest message
    await Chat.findByIdAndUpdate(chatId, {
      $push: { messages: newMessage._id },
      lastMessage: newMessage._id,
      updatedAt: new Date()
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error('Error saving message:', error);
    return NextResponse.json(
      { error: 'Failed to save message' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  await dbConnect();
  
  try {
    // Parse request body
    const body = await request.json();
    const { chatId, userId } = body;

    // Validate required fields
    if (!chatId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update messages as read
    await Message.updateMany(
      {
        chat: chatId,
        sender: { $ne: userId },
        readBy: { $not: { $elemMatch: { $eq: userId } } }
      },
      {
        $addToSet: { readBy: userId }
      }
    );
    
    // Update chat read status
    await Chat.findByIdAndUpdate(chatId, {
      $set: { [`readBy.${userId}`]: new Date() }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json(
      { error: 'Failed to update read status' },
      { status: 500 }
    );
  }
}