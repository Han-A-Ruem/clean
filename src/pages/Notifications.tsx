
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import NotificationDetail from "@/components/notifications/NotificationDetail";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/contexts/UserContext";
import DateSelector from "@/components/search/DateSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Notification } from "@/types/notification";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface Notice {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  is_unread: boolean;
}

const Notifications = () => {
  // Common state
  const [activeTab, setActiveTab] = useState<"notices" | "notifications">("notices");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { user } = useUser();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(null);
  
  // Notices state
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loadingNotices, setLoadingNotices] = useState(true);
  let lastDisplayedDate = null;
  const [selectedNotification, setSelectedNotification] = useState<{
    isOpen: boolean;
    title: string;
    subtitle?: string;
  }>({
    isOpen: false,
    title: "",
  });
  
  // Notifications state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  
  const [showNotificationDetail, setNotificationDetail] = useState(false);

  // Fetch notices when filters change
  useEffect(() => {
    if (activeTab === "notices") {
      fetchNotices();
    }
  }, [toast, user, selectedDay, dateRange, activeTab]);

  // Fetch notifications when tab changes
  useEffect(() => {
    if (activeTab === "notifications") {
      fetchNotifications();
    }
  }, [user, activeTab]);

  // Function to fetch notices from Supabase
  const fetchNotices = async () => {
    try {
      setLoadingNotices(true);
      
      // Start building the query
      let query = supabase
        .from('notices')
        .select('*')
        .or(`user_id.is.null,user_id.eq.${user?.id || ''}`);
        
      // Apply date filter if selectedDay is set
      if (selectedDay) {
        query = query.eq('date', selectedDay);
      } 
      // Apply date range filter if dateRange is set
      else if (dateRange && dateRange.from && dateRange.to) {
        // Since date is stored as text like "2025.2.6", we'll fetch all and filter manually
      }
      
      // Execute the query
      const { data, error } = await query.order('date', { ascending: false });
          
      if (error) {
        console.error("Error fetching notices:", error);
        toast({
          variant: "destructive",
          title: "알림을 불러올 수 없습니다",
          description: error.message,
        });
        return;
      }
      
      // If we have a date range, filter the results manually since date is stored as text
      let filteredData = data || [];
      if (dateRange && dateRange.from && dateRange.to && !selectedDay) {
        filteredData = filteredData.filter(notice => {
          // Parse the notice date (format: "YYYY.M.D")
          const dateParts = notice.date.split('.');
          const noticeDate = new Date(
            parseInt(dateParts[0]), 
            parseInt(dateParts[1]) - 1, // Month is 0-indexed
            parseInt(dateParts[2])
          );
          
          // Check if the date is within range
          return noticeDate >= dateRange.from && noticeDate <= dateRange.to;
        });
      }
      
      setNotices(filteredData);
    } catch (err) {
      console.error("Error fetching notices:", err);
      toast({
        variant: "destructive",
        title: "오류가 발생했습니다",
        description: "알림을 불러오는 중 문제가 발생했습니다.",
      });
    } finally {
      setLoadingNotices(false);
    }
  };

  // Function to fetch notifications from Supabase
  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true);
      
      // Get the current user
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
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
        .eq('user_id', currentUser.id)
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
        status: item.status as 'read' | 'unread'
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
      setLoadingNotifications(false);
    }
  };

  const handleNoticeClick = async (notice: Notice) => {
    // Mark as read if it's unread
    if (notice.is_unread) {
      try {
        const { error } = await supabase
          .from('notices')
          .update({ is_unread: false })
          .eq('id', notice.id);
          
        if (error) {
          console.error("Error updating notice status:", error);
        } else {
          // Update local state
          setNotices(prevNotices => 
            prevNotices.map(n => 
              n.id === notice.id ? { ...n, is_unread: false } : n
            )
          );
        }
      } catch (err) {
        console.error("Error updating notice:", err);
      }
    }

    setNotificationDetail(true);
    setSelectedNotification({
      isOpen: true,
      title: notice.title,
      subtitle: notice.subtitle
    });
  };

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
      
      // Check if there's an action_url
      if (notification.action_url && notification.action_url.trim() !== '') {
        // Navigate to the action_url (assuming it's a relative path)
        window.location.href = notification.action_url;
      } else {
        // Show notification detail
        setNotificationDetail(true);
        setSelectedNotification({
          isOpen: true,
          title: notification.title,
          subtitle: notification.message
        });
      }
    } catch (err) {
      console.error('Error handling notification click:', err);
    }
  };

  const handleCloseDetail = () => {
    setNotificationDetail(false);
    setSelectedNotification({
      isOpen: false,
      title: "",
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter notices based on search query
  const filteredNotices = searchQuery 
    ? notices.filter(notice => {
        const normalizedDate = notice.date.replace(/\./g, ""); // Convert "YYYY.M.D" to "YYYY-M-D"
        return (
          normalizedDate.includes(searchQuery.replace(/\./g, "")) ||
          notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          notice.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) 
        );
      })
    : notices;
    
  // Filter notifications based on search query
  const filteredNotifications = searchQuery 
    ? notifications.filter(notification => 
        notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : notifications;

  // Format notification time
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

  if (showNotificationDetail) {
    return <NotificationDetail
      isOpen={selectedNotification.isOpen}
      onClose={handleCloseDetail}
      title={selectedNotification.title}
      content={selectedNotification.subtitle}
    />
  }
  
  return (
    <div className="pb-20">
      {/* Search Header */}
      <div className="p-4 border-b sticky top-0 bg-white">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input 
            className="pl-10 bg-gray-100 border-none" 
            placeholder="검색어 입력 예)후드 락스"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Tabs for Notices/Notifications */}
      <Tabs defaultValue="notices" className="w-full" onValueChange={(value) => setActiveTab(value as "notices" | "notifications")}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="notices">공지사항</TabsTrigger>
          <TabsTrigger value="notifications">알림</TabsTrigger>
        </TabsList>
        
        <TabsContent value="notices" className="mt-0">
          {loadingNotices ? (
            // Loading skeletons for notices
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="p-4">
                <Skeleton className="h-4 w-20 mb-2" />
                <div className="bg-white p-4 rounded-sm shadow-sm border">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))
          ) : filteredNotices.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchQuery ? "검색 결과가 없습니다." : "공지사항이 없습니다."}
            </div>
          ) : (
            filteredNotices.map((notice) => {
              const showDate = notice.date !== lastDisplayedDate;
              lastDisplayedDate = notice.date;
              return (
                <div key={notice.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {showDate && <p className="text-gray-500 text-sm mb-2">{notice.date}</p>}
                      <div 
                        className={`space-y-1 ${notice.is_unread ? 'bg-yellow-50' : 'bg-white'} p-4 rounded-sm shadow-sm border cursor-pointer`}
                        onClick={() => handleNoticeClick(notice)}
                      >
                        <span className="flex flex-row justify-between items-start">
                          <p className="font-medium text-gray-400">{notice.title}</p>
                          {notice.is_unread && (
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                          )}
                        </span>
                        <p className="text-gray-600">{notice.subtitle}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-0">
          {loadingNotifications ? (
            // Loading skeletons for notifications
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="mb-4 p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? "검색 결과가 없습니다." : "알림이 없습니다."}
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`m-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                  notification.status === 'unread' ? 'bg-blue-50 border-blue-200' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex justify-between items-start">
                  <h3 className={`font-medium ${notification.status === 'unread' ? 'font-bold' : ''}`}>
                    {notification.title}
                  </h3>
                  {notification.status === 'unread' && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{notification.message}</p>
                <p className="text-gray-400 text-xs mt-2">
                  {formatNotificationTime(notification.created_at)}
                </p>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;
