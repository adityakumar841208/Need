// src/types/chat.ts
export interface User {
    _id: string;
    name: string;
    image?: string;
    email?: string;
  }
  
  export interface Message {
    _id: string;
    chat: string;
    sender: User | string;
    content: string;
    readBy: string[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Chat {
    _id: string;
    participants: User[];
    lastMessage?: Message;
    unreadCount: Record<string, number>;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ChatState {
    chats: Chat[];
    messages: Message[];
    loading: boolean;
    error: string | null;
  }