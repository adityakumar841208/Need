// src/lib/socketServer.ts
import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import axios from 'axios'; // Make sure to install axios if not already installed

// Define socket event types
interface ServerToClientEvents {
  'message:received': (data: { message: MessageData; chatId: string }) => void;
  'message:seen': (data: { chatId: string; userId: string }) => void;
  'user:typing': (data: { chatId: string; userId: string }) => void;
  'user:stop-typing': (data: { chatId: string; userId: string }) => void;
  'user:online': (userId: string) => void;
  'user:offline': (userId: string) => void;
  'users:online': (userIds: string[]) => void;
  'error': (message: string) => void;
}

interface ClientToServerEvents {
  'message:send': (data: MessagePayload) => void;
  'message:read': (data: { chatId: string; recipientId?: string }) => void;
  'typing:start': (data: { chatId: string; recipientId?: string }) => void;
  'typing:stop': (data: { chatId: string; recipientId?: string }) => void;
}

// Define socket data interfaces
interface SocketData {
  userId: string;
}

interface MessagePayload {
  chatId: string;
  content: string;
  recipientId?: string;
}

interface MessageData {
  sender: string;
  content: string;
  createdAt: string;
  readBy: string[];
}

// Active users tracking
const activeUsers = new Map<string, string>();

export function initSocketServer(httpServer: HttpServer): SocketIOServer {
  const io = new SocketIOServer<
    ClientToServerEvents,
    ServerToClientEvents,
    {},
    SocketData
  >(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Use proper JWT authentication
  io.use((socket, next) => {
    try {
      const _id = socket.handshake.auth._id;
      console.log(_id)
      if (!_id) {
        return next(new Error('Authentication error: Token missing'));
      }

      socket.data.userId = _id;
      return next();
    } catch (error) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  // Socket connection handling
  io.on('connection', (socket) => {
    const userId = socket.data.userId;
    console.log(`User connected: ${userId}`);
    
    // Store user's socket connection
    activeUsers.set(userId, socket.id);
    
    // Broadcast user's online status to ALL clientss.
    io.emit('user:online', userId);
    
    // Send currently online users to the connected user
    socket.emit('users:online', Array.from(activeUsers.keys()));

    // Join personal room for direct messages
    socket.join(userId);

    // Handle private message
    socket.on('message:send', async (data) => {
      try {
        const { chatId, content, recipientId } = data;
        
        const messageData: MessageData = {
          sender: userId,
          content,
          createdAt: new Date().toISOString(),
          readBy: [userId]
        };
        
        // Emit to recipient's room if they're online
        if (recipientId && activeUsers.has(recipientId)) {
          io.to(recipientId).emit('message:received', {
            message: messageData,
            chatId
          });
        }
        
        // Always emit back to sender for UI update
        io.to(userId).emit('message:received', {
          message: messageData,
          chatId
        });
        
        // // Save message to database via API route (non-blocking)
        // await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/chats/messages`, {
        //   chatId,
        //   content,
        //   sender: userId,
        //   readBy: [userId]
        // }).catch(error => {
        //   console.error('Failed to save message to database:', error);
        // });
        
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', 'Failed to send message');
      }
    });

    // Handle message read status
    socket.on('message:read',async (data) => {
      try {
        const { chatId, recipientId } = data;
        
        // Notify other participant
        if (recipientId && activeUsers.has(recipientId)) {
          io.to(recipientId).emit('message:seen', { 
            chatId, 
            userId 
          });
        }
        
        // // Update read status in database via API route (non-blocking)
        // await axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/chats/messages`, {
        //   chatId,
        //   userId
        // }).catch(error => {
        //   console.error('Failed to update message read status in database:', error);
        // });
        
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    // Handle typing status
    socket.on('typing:start', (data) => {
      const { chatId, recipientId } = data;
      if (recipientId && activeUsers.has(recipientId)) {
        io.to(recipientId).emit('user:typing', { 
          chatId, 
          userId 
        });
      }
    });

    socket.on('typing:stop', (data) => {
      const { chatId, recipientId } = data;
      if (recipientId && activeUsers.has(recipientId)) {
        io.to(recipientId).emit('user:stop-typing', { 
          chatId, 
          userId 
        });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${userId}`);
      activeUsers.delete(userId);
      socket.broadcast.emit('user:offline', userId);
    });
  });

  return io;
}