
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

// Chat item props interface
interface ChatItemProps {
  chat: any;
  onSelect: (chat: any) => void;
}

const formatDate = (date: Date) => {
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 1) {
    return '방금 전';
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}시간 전`;
  } else if (diffInHours < 48) {
    return '어제';
  } else {
    return format(date, 'M월 d일', { locale: ko });
  }
};

const ChatItem: React.FC<ChatItemProps> = ({ chat, onSelect }) => {
  return (
    <div
      className="p-4 bg-white shadow-sm rounded-lg mb-2 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => onSelect(chat)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-12 w-12 mr-3">
            {chat.profileImage ? (
              <AvatarImage src={chat.profileImage} alt={chat.customerName} />
            ) : (
              <AvatarFallback className="bg-gray-100">
                <User className="h-6 w-6 text-gray-500" />
              </AvatarFallback>
            )}
          </Avatar>
          
          <div>
            <h3 className="font-medium text-gray-800">{chat.customerName}</h3>
            <div className="text-sm text-gray-600 mt-1">
              {chat.lastMessage ? (
                <p className="truncate max-w-[200px]">{chat.lastMessage.message}</p>
              ) : (
                <p className="text-gray-400">No messages yet</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          {chat.lastMessage && (
            <span className="text-xs text-gray-400 mb-1">
              {formatDate(new Date(chat.lastMessage.created_at))}
            </span>
          )}
          {chat.unreadCount > 0 && (
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
