import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Search, Plus, MoreVertical } from "lucide-react";

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
}

const mockChats: Chat[] = [
  {
    id: "1",
    name: "Sulemana Bindawdi",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b9c5e8e1?w=150&h=150&fit=crop&crop=face",
    lastMessage: "Hey! How are you doing?",
    timestamp: "2m ago",
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: "2",
    name: "Hayate Beauty",
    avatar: "https://www.pinterest.com/pin/227994799876527977/",
    lastMessage: "Thanks for the help!",
    timestamp: "1h ago",
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: "3",
    name: "Simdi Technologies",
    avatar: "https://www.pinterest.com/pin/3166662229958986/",
    lastMessage: "Meeting at 3 PM today",
    timestamp: "3h ago",
    unreadCount: 5,
    isOnline: true,
  },
];

export default function ChatPage() {
  const { chatId } = useParams<{ chatId?: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const filteredChats = mockChats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleNewChat = () => {
    alert("🛠️ New chat feature coming soon...");
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Chats
          </h1>
          <button
            onClick={handleNewChat}
            aria-label="Start new chat"
            className="p-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Search chats..."
            aria-label="Search chats"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8" />
            </div>
            <p className="text-lg font-medium">No chats found</p>
            <p className="text-sm">Try searching for something else</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredChats.map((chat) => {
              const isActive = chat.id === chatId;
              return (
                <Link
                  key={chat.id}
                  to={`/chat/${chat.id}`}
                  className={`block p-4 transition-colors ${
                    isActive
                      ? "bg-gray-100 dark:bg-gray-800"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {/* Avatar */}
                    <div className="relative">
                      <img
                        src={chat.avatar}
                        alt={chat.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {chat.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {chat.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {chat.timestamp}
                          </span>
                          <button
                            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                            aria-label="More options"
                          >
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {chat.lastMessage}
                        </p>
                        {chat.unreadCount > 0 && (
                          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-primary rounded-full">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
