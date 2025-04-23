import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Send, Paperclip, Smile, ArrowLeft } from 'lucide-react';
import { BiChat } from 'react-icons/bi';
import { useSocket } from '@/contexts/SocketContext';
import { Chat, Message, User } from '@/types/chat';
import { useRouter } from 'next/navigation';

interface ChatWindowProps {
  chat: Chat | null;
  messages: Message[];
  onSendMessage: (message: string) => void;
  onBackClick: () => void;
  currentUserId: string;
}

export default function ChatWindow({
  chat,
  messages,
  onSendMessage,
  onBackClick,
  currentUserId
}: ChatWindowProps) {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { socket, onlineUsers } = useSocket();
  const router = useRouter();

  // Get other participant (for 1:1 chat)
  const otherParticipant = chat?.participants.find(
    p => p._id !== currentUserId
  );

  const isOnline = otherParticipant && onlineUsers.includes(otherParticipant._id);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark messages as read when chat opens
  useEffect(() => {
    if (chat && socket) {
      // First emit the socket event for real-time updates
      socket.emit('message:read', {
        chatId: chat._id,
        recipientId: otherParticipant?._id
      });

      // Then update the database (non-blocking)
      const updateReadStatus = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/chats/messages`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chatId: chat._id,
              userId: currentUserId
            })
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.error || `Failed with status: ${response.status}`);
          }

          const result = await response.json();
          console.log('Message read status updated successfully', result);
        } catch (error) {
          console.error('Failed to update message read status in database:', error);
        }
      };

      updateReadStatus();
    }
  }, [chat, socket, currentUserId, otherParticipant]);

  // Set up real-time typing indicators
  useEffect(() => {
    if (!socket || !chat || !otherParticipant) return;

    socket.on('user:typing', (data: { chatId: string; userId: string }) => {
      if (data.chatId === chat._id && data.userId === otherParticipant._id) {
        setIsTyping(true);
      }
    });

    socket.on('user:stop-typing', (data: { chatId: string; userId: string }) => {
      if (data.chatId === chat._id && data.userId === otherParticipant._id) {
        setIsTyping(false);
      }
    });

    return () => {
      socket.off('user:typing');
      socket.off('user:stop-typing');
    };
  }, [socket, chat, otherParticipant]);

  const handleTyping = () => {
    if (!socket || !chat || !otherParticipant) return;

    socket.emit('typing:start', {
      chatId: chat._id,
      recipientId: otherParticipant._id
    });

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      socket.emit('typing:stop', {
        chatId: chat._id,
        recipientId: otherParticipant._id
      });
    }, 3000);

    setTypingTimeout(timeout);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (message.trim() && chat && socket) {
      // Send message via socket
      socket.emit('message:send', {
        chatId: chat._id,
        content: message,
        recipientId: otherParticipant?._id
      });

      // Pass to parent component for UI update
      onSendMessage(message);
      setMessage("");

      // Stop typing indicator
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      // Save message to database via API route (non-blocking)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/chats/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chatId: chat._id,
            content: message,
            sender: currentUserId,
            readBy: [currentUserId]
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error || `Failed with status: ${response.status}`);
        }

        const savedMessage = await response.json();
        console.log('Message saved successfully:', savedMessage);
      } catch (error) {
        console.error('Failed to save message to database:', error);
      }

      socket.emit('typing:stop', {
        chatId: chat._id,
        recipientId: otherParticipant?._id
      });
    }
  };

  if (!chat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
        <BiChat className="w-20 h-20 mb-6 text-gray-300 dark:text-gray-600" />
        <h2 className="text-2xl font-semibold mb-2">Welcome to chat</h2>
        <p className="text-center max-w-md">
          Select a conversation from the list to start chatting or continue a previous conversation.
        </p>
      </div>
    );
  }


  return (
    <>
      {/* Chat Header */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-4 py-3 flex items-center gap-3  cursor-pointer"  onClick={()=> router.push('/home/showprofile/' + otherParticipant?._id)}>
        <button
          onClick={onBackClick}
          className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        <div className="relative">
          {otherParticipant?.image ? (
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src={otherParticipant.image}
                alt={otherParticipant.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {otherParticipant?.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
          )}
        </div>

        <div className="flex-1">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            {otherParticipant?.name}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {(isOnline ? 'Online now' : 'Offline')}
          </p>
        </div>

        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
          <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
        {messages.length === 0 || messages.error || !messages ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center max-w-md">
              <div className="mx-auto w-12 h-12 mb-4 text-blue-500 dark:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                Start the conversation
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No messages yet. Send a message to {otherParticipant?.name} to start the conversation.
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => {
              const senderId = typeof msg.sender === 'string'
                ? msg.sender
                : msg.sender._id;

              const isOwnMessage = senderId === currentUserId;

              return (
                <div
                  key={index}
                  className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${isOwnMessage
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white dark:bg-gray-700 dark:text-white rounded-bl-none shadow"
                      }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className={`text-[10px] ${isOwnMessage ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                        }`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>

                      {isOwnMessage && otherParticipant && msg.readBy.includes(otherParticipant._id) && (
                        <span className="text-blue-100">✓✓</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full px-4 py-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <div className="flex items-center gap-2">
          <button type="button" className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <Paperclip className="w-5 h-5" />
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-full outline-none"
              placeholder="Type a message..."
            />
            <button type="button" className="absolute right-3 top-2 text-gray-500">
              <Smile className="w-5 h-5" />
            </button>
          </div>

          <button
            type="submit"
            disabled={!message.trim()}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </>
  );
}