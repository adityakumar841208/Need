'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ChatList from './components/ChatList';
import ChatWindow from './components/Chatwindow';
import { useSocket } from '@/contexts/SocketContext';
import { useAppSelector } from '@/store/hooks';
import { Chat as ChatType, Message, User } from '@/types/chat';

export default function Chat() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { socket } = useSocket();

  const profile = useAppSelector(state => state.profile);
  const currentUser = profile;

  const activeChatId = searchParams.get('id');
  const [chats, setChats] = useState<ChatType[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(activeChatId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mobileViewChat, setMobileViewChat] = useState<boolean>(!!activeChatId);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch('/api/chats');
        const data = await response.json();
        console.log(data)
        setChats(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching chats:', error);
        setLoading(false);
      }
    };

    if (currentUser?._id) {
      fetchChats();
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;

      try {
        const response = await fetch(`/api/chats/${selectedChat}/messages`);
        const data = await response.json();
        console.log('Fetched messages:', data);
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    if (selectedChat) {
      router.push(`/home/chat?id=${selectedChat}`, { scroll: false });
      setMobileViewChat(true);
    }
  }, [selectedChat, router]);

  useEffect(() => {
    if (activeChatId) {
      setSelectedChat(activeChatId);
      setMobileViewChat(true);
    }
  }, [activeChatId]);

  useEffect(() => {
    if (!socket || !currentUser) return;

    const handleNewMessage = (data: { message: Message; chatId: string }) => {
      const { message, chatId } = data;

      if (selectedChat === chatId) {
        setMessages(prev => [...prev, message]);
      }

      setChats(prev => {
        const updatedChats = [...prev];
        const chatIndex = updatedChats.findIndex(c => c._id === chatId);

        if (chatIndex !== -1) {
          const chat = { ...updatedChats[chatIndex] };
          chat.lastMessage = message;

          const senderId = typeof message.sender === 'string'
            ? message.sender
            : message.sender._id;

          if (senderId !== currentUser._id) {
            chat.unreadCount = {
              ...chat.unreadCount,
              [currentUser._id as string]: (chat.unreadCount[currentUser._id as string] || 0) + 1
            };
          }

          updatedChats.splice(chatIndex, 1);
          return [chat, ...updatedChats];
        }

        return prev;
      });
    };

    const handleMessageSeen = ({ chatId, userId }: { chatId: string; userId: string }) => {
      if (selectedChat === chatId) {
        setMessages(prev =>
          prev.map(msg => {
            const senderId = typeof msg.sender === 'string'
              ? msg.sender
              : msg.sender._id;

            if (senderId === currentUser._id && !msg.readBy.includes(userId)) {
              return {
                ...msg,
                readBy: [...msg.readBy, userId]
              };
            }
            return msg;
          })
        );
      }
    };

    socket.on('message:received', handleNewMessage);
    socket.on('message:seen', handleMessageSeen);

    return () => {
      socket.off('message:received', handleNewMessage);
      socket.off('message:seen', handleMessageSeen);
    };
  }, [socket, selectedChat, currentUser]);

  const handleChatSelect = (chatId: string) => {
    setSelectedChat(chatId);

    if (socket && chatId && currentUser) {
      socket.emit('message:read', { chatId });

      setChats(prev => {
        return prev.map(chat => {
          if (chat._id === chatId) {
            return {
              ...chat,
              unreadCount: {
                ...chat.unreadCount,
                [currentUser._id as string]: 0
              }
            };
          }
          return chat;
        });
      });
    }
  };

  const handleSendMessage = (newMessage: string) => {
    // if (selectedChat && currentUser && newMessage.trim()) {
    //   // Create a properly formatted message object for UI display
    //   const messageObj = {
    //     _id: `temp-${Date.now()}`, // Temporary ID until server assigns one
    //     chat: selectedChat,
    //     content: newMessage,
    //     sender: currentUser._id as string,
    //     readBy: [currentUser._id as string],
    //     createdAt: new Date().toISOString()
    //   };
      
    //   // Update the messages state to show message immediately
    //   setMessages(prev => [...prev, messageObj]);
      
    //   // Also update the chat list to show the latest message
    //   setChats(prev => {
    //     const updatedChats = [...prev];
    //     const chatIndex = updatedChats.findIndex(c => c._id === selectedChat);
        
    //     if (chatIndex !== -1) {
    //       // Create a copy of the chat and update its lastMessage
    //       const updatedChat = { ...updatedChats[chatIndex] };
    //       updatedChat.lastMessage = messageObj;
          
    //       // Remove the chat from its current position
    //       updatedChats.splice(chatIndex, 1);
    //       // Add it to the beginning of the array
    //       return [updatedChat, ...updatedChats];
    //     }
        
    //     return prev;
    //   });
    // }
  };

  // Add fallback handling for currentChat with type checking
  const currentChat = selectedChat && Array.isArray(chats)
    ? chats.find(chat => chat._id === selectedChat) || (chats.length > 0 ? chats[0] : null)
    : Array.isArray(chats) && chats.length > 0 ? chats[0] : null;

  if (!currentUser) {
    return (
      <div className="h-[89vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Please log in</h2>
          <p className="text-gray-500">You need to be logged in to access chat.</p>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Log in
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-[89vh] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="h-[89vh] flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <div className={`${mobileViewChat ? 'hidden md:block' : 'block'} md:w-[30vw] w-full border-r border-gray-200 dark:border-gray-700`}>
          <ChatList
            chats={chats}
            selectedChat={selectedChat}
            onChatSelect={handleChatSelect}
            currentUserId={currentUser._id as string}
          />
        </div>

        <div className={`${mobileViewChat ? 'flex' : 'hidden md:flex'} flex-col flex-1`}>
          {currentChat ? (
            <ChatWindow
              chat={currentChat}
              messages={messages}
              onSendMessage={handleSendMessage}
              onBackClick={() => setMobileViewChat(false)}
              currentUserId={currentUser._id as string}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
              <div className="w-20 h-20 mb-6 text-gray-300 dark:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold mb-2">Select a conversation</h2>
              <p className="text-center max-w-md">
                Choose a chat from the list or start a new conversation to begin messaging.
              </p>
              {chats.length === 0 && (
                <button
                  onClick={() => router.push('/home/connections')}
                  className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Find people to chat with
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}