import { Search, MoreVertical } from 'lucide-react';
import { BiChat } from 'react-icons/bi';
import { useSocket } from '@/contexts/SocketContext';
import { Chat } from '@/types/chat';

interface ChatListProps {
  chats: Chat[];
  selectedChat: string | null;
  onChatSelect: (chatId: string) => void;
  currentUserId: string;
}

export default function ChatList({ chats, selectedChat, onChatSelect, currentUserId }: ChatListProps) {
  const { onlineUsers } = useSocket();
  
  // Get formatted chat list with recipient info
  const formattedChats = chats.length > 0 
    ? chats.map(chat => {
        const otherParticipant = chat.participants.find(
          p => p._id !== currentUserId
        );
        
        const isOnline = otherParticipant && onlineUsers.includes(otherParticipant._id);
        const unreadCount = chat.unreadCount[currentUserId] || 0;
        
        // Calculate time display
        let timeDisplay = '';
        if (chat.lastMessage) {
          const messageDate = new Date(chat.lastMessage.createdAt);
          const now = new Date();
          
          if (messageDate.toDateString() === now.toDateString()) {
            timeDisplay = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          } else {
            timeDisplay = messageDate.toLocaleDateString();
          }
        } else {
          timeDisplay = new Date(chat.updatedAt).toLocaleDateString();
        }
        
        return {
          id: chat._id,
          name: otherParticipant?.name || 'Unknown',
          image: otherParticipant?.image,
          lastMessage: chat.lastMessage?.content || 'Start a conversation',
          time: timeDisplay,
          unread: unreadCount,
          online: isOnline
        };
      })
    : [];

  return (
    <div className="flex flex-col h-[89vh] bg-white dark:bg-gray-800">
      {/* Chat list header */}
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold dark:text-white">Messages</h1>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        {/* Search */}
        <div className="mt-4 relative">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full p-2 pl-10 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg outline-none"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {formattedChats.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No conversations yet
          </div>
        ) : (
          formattedChats.map((chat) => (
            <div
              key={chat.id}
              className={`flex items-center gap-4 p-4 cursor-pointer border-b border-gray-200 dark:border-gray-700 ${
                selectedChat === chat.id 
                  ? 'bg-blue-50 dark:bg-gray-700' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => onChatSelect(chat.id)}
            >
              <div className="relative">
                {chat.image ? (
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img 
                      src={chat.image} 
                      alt={chat.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white font-semibold text-lg">
                      {chat.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                
                {chat.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{chat.name}</h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{chat.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600 dark:text-gray-300 truncate pr-4">
                    {chat.lastMessage}
                  </p>
                  {chat.unread > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}