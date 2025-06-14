
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Notification } from "@/types/notification";
import { PageHeader } from "../Utils";

interface NotificationsListProps {
  onSelectNotification: (notification: {
    id: string;
    title: string;
    message?: string;
    type?: string;
    action_url?: string;
  }) => void;
}

const NotificationsList = ({ onSelectNotification }: NotificationsListProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast({
            variant: "destructive",
            title: "인증 오류",
            description: "알림을 불러올 권한이 없습니다.",
          });
          return;
        }
        
        // Fetch notifications for the current user
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching notifications:', error);
          toast({
            variant: "destructive",
            title: "알림을 불러올 수 없습니다",
            description: error.message,
          });
          return;
        }
        
        // Type assertion to ensure data conforms to the Notification type
        const typedData = data.map(item => ({
          ...item,
          type: item.type as Notification['type'],
          status: item.status as Notification['status']
        }));
        
        setNotifications(typedData);
      } catch (err) {
        console.error('Error in notifications fetch:', err);
        toast({
          variant: "destructive",
          title: "오류가 발생했습니다",
          description: "알림을 불러오는 중 문제가 발생했습니다.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
    
    // Set up a real-time subscription for notifications
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'notifications' 
        },
        () => fetchNotifications()
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);
  
  const handleNotificationClick = async (notification: Notification) => {
    try {
      // Mark the notification as read if it's unread
      if (notification.status === 'unread') {
        const { error } = await supabase
          .from('notifications')
          .update({ 
            status: 'read',
            read_at: new Date().toISOString()
          })
          .eq('id', notification.id);
          
        if (error) {
          console.error('Error updating notification status:', error);
        } else {
          // Update the local state
          setNotifications(notifications.map(n => 
            n.id === notification.id ? { ...n, status: 'read', read_at: new Date().toISOString() } : n
          ));
        }
      }
      
      // Call the callback to show the notification detail
      onSelectNotification({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        action_url: notification.action_url
      });
    } catch (err) {
      console.error('Error handling notification click:', err);
    }
  };
  
  const formatNotificationTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { 
        addSuffix: true,
        locale: ko 
      });
    } catch (e) {
      return '시간 정보 없음';
    }
  };
  
  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => n.status === (activeTab === 'unread' ? 'unread' : 'read'));
  
  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  return (
    <div className="">
    <PageHeader title="알림"/>
      
      <Tabs defaultValue="all" className="w-full pt-2 px-4" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="all">전체 ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">안 읽음 ({unreadCount})</TabsTrigger>
          <TabsTrigger value="read">읽음 ({notifications.length - unreadCount})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          {renderNotificationsList(filteredNotifications, loading, handleNotificationClick, formatNotificationTime)}
        </TabsContent>
        
        <TabsContent value="unread" className="mt-0">
          {renderNotificationsList(filteredNotifications, loading, handleNotificationClick, formatNotificationTime)}
        </TabsContent>
        
        <TabsContent value="read" className="mt-0">
          {renderNotificationsList(filteredNotifications, loading, handleNotificationClick, formatNotificationTime)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const renderNotificationsList = (
  notifications: Notification[], 
  loading: boolean,
  onNotificationClick: (notification: Notification) => void,
  formatTime: (timestamp: string) => string
) => {
  if (loading) {
    return Array(3).fill(0).map((_, i) => (
      <div key={i} className="mb-4 p-4 border rounded-lg">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    ));
  }
  
  if (notifications.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        알림이 없습니다.
      </div>
    );
  }
  
  return notifications.map((notification) => (
    <div 
      key={notification.id} 
      className={`mb-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
        notification.status === 'unread' ? 'bg-blue-50 border-blue-200' : ''
      }`}
      onClick={() => onNotificationClick(notification)}
    >
      <div className="flex justify-between items-start">
        <h3 className={`font-medium ${notification.status === 'unread' ? 'font-bold' : ''}`}>
          {notification.title}
        </h3>
        {notification.status === 'unread' && (
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        )}
      </div>
      {notification.message && (
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{notification.message}</p>
      )}
      <p className="text-gray-400 text-xs mt-2">
        {formatTime(notification.created_at)}
      </p>
    </div>
  ));
};

export default NotificationsList;
