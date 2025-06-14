
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronRight, 
  Gift, 
  LogOut,
  CreditCard,
  MapPin,
  Ticket,
  User,
  Users,
  Bell,
  Info,
  HelpCircle,
  Phone,
  Trophy,
  Star,
  Settings,
  FileText,
  Home,
  Wallet,
  Receipt,
  Settings2,
  BellRing,
  MessageSquareQuote,
  MessageSquare,
  UserPlus,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MyRank } from "@/components/menu/MyRank";
import { NotificationBadge } from "@/components/ui/notification-badge";
import { useUser } from "@/contexts/UserContext";

const MorePageItems: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [hasChatAccess, setHasChatAccess] = useState(false);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "로그아웃 되었습니다",
        description: "다음에 또 만나요!",
      });
      
      navigate("/sign-in");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "오류가 발생했습니다",
        description: error.message,
      });
    }
  };

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'unread');
        
      if (error) {
        console.error('Error fetching unread notifications:', error);
        return;
      }
      
      setUnreadCount(data?.length || 0);
    };
    
    fetchUnreadNotifications();
    
    // Set up a real-time subscription to update the unread count
    const channel = supabase
      .channel('notification-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user?.id}`
        },
        () => fetchUnreadNotifications()
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Fetch unread chat messages and check if user has access to chat
  useEffect(() => {
    if (!user) return;

    const fetchChatInfo = async () => {
      try {
        // Check if user has any reservations with a cleaner assigned
        const { data: reservations, error: reservationError } = await supabase
          .from('reservations')
          .select('id, cleaner_id')
          .eq('user', user.id)
          .not('cleaner_id', 'is', null)
          .limit(1);

        if (reservationError) throw reservationError;

        // Check if user is a cleaner with assigned reservations
        const { data: cleanerReservations, error: cleanerError } = await supabase
          .from('reservations')
          .select('id')
          .eq('cleaner_id', user.id)
          .limit(1);

        if (cleanerError) throw cleanerError;

        // User has chat access if they have a reservation with cleaner assigned or if they are a cleaner
        const hasAccess = (reservations && reservations.length > 0) || 
                          (cleanerReservations && cleanerReservations.length > 0);
        
        setHasChatAccess(hasAccess);

        if (hasAccess) {
          // Fetch unread chat messages
          const { data: chats, error: chatsError } = await supabase
            .from('chats')
            .select('id')
            .or(`customer_id.eq.${user.id},cleaner_id.eq.${user.id}`);

          if (chatsError) throw chatsError;

          if (chats && chats.length > 0) {
            // For each chat, count unread messages
            let totalUnread = 0;
            for (const chat of chats) {
              const { count, error: countError } = await supabase
                .from('chat_messages')
                .select('id', { count: 'exact' })
                .eq('chat_id', chat.id)
                .eq('is_read', false)
                .not('sender_id', 'eq', user.id);

              if (countError) throw countError;
              totalUnread += count || 0;
            }
            setUnreadChatCount(totalUnread);
          }
        }
      } catch (error) {
        console.error('Error fetching chat information:', error);
      }
    };

    fetchChatInfo();

    // Set up real-time subscription for chat messages
    const channel = supabase
      .channel('chat-message-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages'
        },
        () => fetchChatInfo()
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_messages',
          filter: 'is_read=eq.true'
        },
        () => fetchChatInfo()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const menuItems = [
    // invite
    { icon: UserPlus, label: "친구 초대하기", route: "/more/invite" },
    { icon: Gift, label: "이벤트", route: "/more/events" },
    // { icon: CreditCard, label: "결제 관리", route: "/more/payment" },
    { icon: MapPin, label: "주소 관리", route: "/more/address" },
    { icon: Ticket, label: "쿠폰 관리", route: "/more/coupons" },
    { icon: User, label: "내 정보", route: "/more/profile" },
    { icon: Users, label: "추천인 관리", route: "/more/referral" },
    { 
      icon: MessageSquare, 
      label: "대화", 
      route: "/more/chat",
      badge: unreadChatCount > 0 ? unreadChatCount : undefined
    },
    { 
      icon: Settings2, 
      label: "알림 설정", 
      route: "/more/notifications-settings",
    },
    { 
      icon: BellRing, 
      label: "공고", 
      route: "/more/notifications",
      badge: unreadCount > 0 ? unreadCount : undefined
    },
    { icon: Info, label: "공지사항", route: "/more/notices" },
    { icon: HelpCircle, label: "자주 묻는 질문", route: "/more/faqs" },
    // { icon: Info, label: "이용 안내", route: "/more/usage-guide" },
    { icon: MessageSquareQuote, label: "1:1 문의", route: "/more/inquiry" },
    { icon: FileText, label: "약관 및 정책", route: "/more/terms-policies" },
  ];

  return (
    <div className="mt-4 bg-white rounded-lg overflow-hidden shadow-sm divide-y">
      {menuItems.map((item, index) => {
        return (
          <div 
            key={index}
            className="p-5 flex items-center justify-between cursor-pointer" 
            onClick={() => navigate(item.route)}
          >
            <div className="flex items-center">
              <div className="relative">
                <item.icon className="h-6 w-6 text-gray-500 mr-4" />
                {item.badge !== undefined && (
                  <NotificationBadge count={item.badge} className="right-2 -top-3" />
                )}
              </div>
              <span className="text-md font-medium">{item.label}</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        );
      })}
      
      <div 
        className="p-5 flex items-center justify-between cursor-pointer"
        onClick={handleLogout}
      >
        <div className="flex items-center">
          <LogOut className="h-6 w-6 text-gray-500 mr-4" />
          <span className="text-md font-medium">로그아웃</span>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
};

export default MorePageItems;
