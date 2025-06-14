import React, { useEffect, useState, useCallback, memo } from "react";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { PageHeader } from "@/components/Utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { format, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { MessageSquare, User, ArrowRight } from "lucide-react";
import { useChat } from "@/hooks/useChat";

interface ChatMessage {
  message: string;
  created_at: string;
}

interface Reservation {
  id: string;
  date: string[];
  status: string;
  address: string;
  amount: number;
}

interface ChatItemProps {
  chat: {
    id: string;
    cleanerName?: string;
    customerName?: string;
    profileImage?: string | null;
    lastMessage?: ChatMessage | null;
    unreadCount?: number;
    reservation?: Reservation | null;
  };
  formatDate: (dateString: string) => string;
  userType: string | null;
  onSelect: (chatId: string) => void;
}

const ChatItem = memo(({ chat, formatDate, userType, onSelect }: ChatItemProps) => {
  const displayName = userType === "user" ? chat.cleanerName : chat.customerName;
  
  const getStatusClass = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };
  
  const getStatusText = (status: string) => {
    switch(status) {
      case 'completed': return '완료됨';
      case 'cancelled': return '취소됨';
      default: return '예약됨';
    }
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return '방금 전';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}시간 전`;
    } else if (diffInHours < 48) {
      return '어제';
    } else if (diffInHours < 72) {
      return '그제';
    } else {
      return format(date, 'M월 d일', { locale: ko });
    }
  };

  return (
    <div
      className="p-4 bg-white shadow-sm rounded-lg mb-2 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => onSelect(chat.id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-12 w-12 mr-3">
            {chat.profileImage ? (
              <AvatarImage src={chat.profileImage} alt={displayName || "User"} />
            ) : (
              <AvatarFallback className="bg-gray-100">
                <User className="h-6 w-6 text-gray-500" />
              </AvatarFallback>
            )}
          </Avatar>
          
          <div>
            <h3 className="font-medium text-gray-800">{displayName}</h3>
            {chat.reservation && (
              <div className="text-sm text-gray-600 mt-1">
                <div className="flex flex-col space-y-1">
                  <div>청소 예약: {formatDate(chat.reservation.date[0])}</div>
                  <div className="truncate max-w-[200px]">주소: {chat.reservation.address}</div>
                  <div>금액: {chat.reservation.amount.toLocaleString()}원</div>
                  <div className="mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(chat.reservation.status)}`}>
                      {getStatusText(chat.reservation.status)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          {chat.lastMessage && (
            <span className="text-xs text-gray-400 mb-1">
              {formatMessageTime(chat.lastMessage.created_at)}
            </span>
          )}
          {chat.unreadCount > 0 && (
            <span className="bg-primary-user text-white text-xs px-2 py-1 rounded-full">
              {chat.unreadCount}
            </span>
          )}
          <ArrowRight className="h-4 w-4 text-gray-400 mt-2" />
        </div>
      </div>
    </div>
  );
});

ChatItem.displayName = "ChatItem";

const ChatListSkeleton = () => {
  return (
    <>
      {[1, 2, 3].map((index) => (
        <div key={index} className=" bg-white shadow-sm rounded-lg mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Skeleton className="h-12 w-12 rounded-full mr-3" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-3 w-36" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
            <div className="flex flex-col items-end">
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-5 w-5 rounded-full mt-2" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

const EmptyState = () => (
  <div className="text-center">
    <PageHeader title=""/>
    <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
    <h3 className="text-lg font-semibold mb-2">대화가 없습니다</h3>
    <p className="text-gray-500 mb-4">
      예약이 있고 담당 클리너가 배정되면 채팅이 가능합니다.
    </p>
  </div>
);

const ChatList = () => {
  const { user, userData } = useUser();
  const [chats, setChats] = useState<ChatItemProps["chat"][]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getAllChats } = useChat();

  const fetchChats = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const chatData = await getAllChats();
      
      // Filter visible chats
      const visibleChats = chatData.filter(chat => chat.isVisible);
      setChats(visibleChats);
    } catch (error: any) {
      console.error("Error fetching chats:", error);
      toast({
        variant: "destructive",
        title: "Failed to load chats",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }, [user, getAllChats, toast]);

  useEffect(() => {
    if (!user) return;
    fetchChats();
  }, [user, fetchChats]);

  const handleChatSelect = useCallback((chatId: string) => {
    navigate(`${chatId}`);
  }, [navigate]);

  const formatDateString = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'yyyy년 MM월 dd일 HH:mm');
  }, []);

  if (loading) {
    return (
      <div className="">
        <PageHeader title="관리자"/>
        <ChatListSkeleton />
      </div>
    );
  }

  if (chats.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="">
      <PageHeader title="관리자"/>
      <div className="space-y-2">
        {chats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            formatDate={formatDateString}
            userType={userData?.type}
            onSelect={handleChatSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatList;
