import React, { useState, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ChatItem from './ChatItem';
import ChatListSkeleton from './ChatListSkeleton';
import ChatDetail from './ChatDetail';
import EmptyState from './EmptyState';

const InquiryManagement: React.FC = () => {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('all');
  const { getAllChats, subscribeToChatUpdates } = useChat();
  const { toast } = useToast();

  // Calculate total unread count
  const totalUnreadCount = chats.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const chatData = await getAllChats();
        
        // Filter for admin chats only
        const adminChats = chatData.filter(chat => chat.is_admin_chat);
        setChats(adminChats);
      } catch (error: any) {
        console.error("Error fetching chats:", error);
        toast({
          variant: "destructive",
          title: "Failed to load inquiries",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchChats();
  }, [getAllChats, toast]);

  useEffect(() => {
    // Subscribe to chat updates
    const unsubscribe = subscribeToChatUpdates((updatedChats) => {
      const adminChats = updatedChats.filter(chat => chat.is_admin_chat);
      setChats(adminChats);
    });

    return () => {
      unsubscribe();
    };
  }, [subscribeToChatUpdates]);

  const handleChatSelect = (chat: any) => {
    setSelectedChat(chat);
  };

  const handleBack = () => {
    setSelectedChat(null);
  };

  const filterChats = () => {
    if (activeTab === 'all') {
      return chats;
    } else if (activeTab === 'unread') {
      return chats.filter(chat => chat.unreadCount > 0);
    }
    return chats;
  };

  if (selectedChat) {
    return <ChatDetail chat={selectedChat} onBack={handleBack} />;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Customer Inquiries</h1>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList className="w-full">
          <TabsTrigger value="all" className="flex-1">
            All Inquiries
          </TabsTrigger>
          <TabsTrigger value="unread" className="flex-1">
            Unread
            {totalUnreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                {totalUnreadCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-2">
          {loading ? (
            <ChatListSkeleton />
          ) : filterChats().length > 0 ? (
            <div className="space-y-2">
              {filterChats().map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  onSelect={handleChatSelect}
                />
              ))}
            </div>
          ) : (
            <EmptyState type="all" />
          )}
        </TabsContent>
        
        <TabsContent value="unread" className="mt-2">
          {loading ? (
            <ChatListSkeleton />
          ) : filterChats().length > 0 ? (
            <div className="space-y-2">
              {filterChats().map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  onSelect={handleChatSelect}
                />
              ))}
            </div>
          ) : (
            <EmptyState type="unread" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InquiryManagement;
