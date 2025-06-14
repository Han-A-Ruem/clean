import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";

interface ChatMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface ChatDetails {
  id: string;
  customer_id: string;
  cleaner_id: string | null;
  created_at: string;
  updated_at: string;
  reservation_id: string | null;
  is_admin_chat: boolean;
  otherUserName?: string;
  otherUserId?: string;
  profileImage?: string | null;
}

export const useChat = (chatId?: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentChat, setCurrentChat] = useState<ChatDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, userData } = useUser();

  // Function to create an admin chat
  const createAdminChat = useCallback(async (checkOnly = false) => {
    if (!user) return null;
    
    try {
      // First check if the user already has an admin chat
      const { data: existingChats, error: checkError } = await supabase
        .from("chats")
        .select("id, cleaner_id")
        .or(`customer_id.eq.${user.id},cleaner_id.eq.${user.id}`)
        .eq("is_admin_chat", true)
        .limit(1);
        
      if (checkError) throw checkError;
      
      // If a chat exists and we're just checking, return it
      if (existingChats && existingChats.length > 0) {
        return existingChats[0].id;
      }
      
      // If we're just checking and no chat exists, return null
      if (checkOnly) return null;
      
      

      // Otherwise create a new admin chat
      const { data, error } = await supabase
        .from("chats")
        .insert({
          customer_id: userData?.type === 'customer' ? user.id : null, // No specific customer assigned
          cleaner_id: userData?.type === 'cleaner' ? user.id : null , // cleaner assigned
          reservation_id: null, // No reservation associated
          is_admin_chat: true
        })
        .select("id")
        .single();
        
      if (error) throw error;
      
      return data.id;
    } catch (error) {
      console.error("Error with admin chat:", error);
      return null;
    }
  }, [user]);

  // Function to create a new chat
  const createChat = useCallback(async (cleanerId: string, reservationId: string) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from("chats")
        .insert({
          customer_id: user.id,
          cleaner_id: cleanerId,
          reservation_id: reservationId,
          is_admin_chat: false
        })
        .select("id")
        .single();
        
      if (error) throw error;
      
      return data.id;
    } catch (error) {
      console.error("Error creating chat:", error);
      return null;
    }
  }, [user]);

  // Function to get all chats for current user
  const getAllChats = useCallback(async () => {
    if (!user) return [];
    
    try {
      let chatQuery = supabase
        .from("chats")
        .select("*, reservations:reservation_id(id, date, status, address:address(address), amount)");
      
      // Regular users see only their chats
      if (userData?.type !== 'admin') {
        chatQuery = chatQuery.or(`customer_id.eq.${user.id},cleaner_id.eq.${user.id}`);
      } else {
        chatQuery = chatQuery.eq("is_admin_chat", true)
      }

      const { data: chatsData, error } = await chatQuery;

      console.log('chatsData', chatsData);

      if (error) throw error;

      const enhancedChats = await Promise.all(
        (chatsData || []).map(async (chat) => {
          // For admin chats, get customer info
          if (chat.is_admin_chat) {
            // Get user info based on whether they are customer or cleaner
            const userId = chat.customer_id || chat.cleaner_id;
            const { data: userData } = await supabase
              .from("users")
              .select("name, profile_photo , email")
              .eq("user_id", userId)
              .single();
              
            // Get the last message in this chat
            const { data: lastMessageData } = await supabase
              .from("chat_messages")
              .select("message, created_at")
              .eq("chat_id", chat.id)
              .order("created_at", { ascending: false })
              .limit(1)
              .single();

            // Count unread messages
            const { count } = await supabase
              .from("chat_messages")
              .select("id", { count: "exact" })
              .eq("chat_id", chat.id)
              .eq("is_read", false)
              .not("sender_id", "eq", user.id);
              

              console.log('userData', userData);
            return {
              ...chat,
              customerName: userData?.name || userData?.email || "",
              cleanerName: "Customer Support",
              profileImage: userData?.profile_photo || null,
              lastMessage: lastMessageData || null,
              unreadCount: count || 0,
              reservation: null,
              isVisible: true
            };
          }
          
          // Get the other user's info
          const otherUserId = chat.customer_id === user.id ? chat.cleaner_id : chat.customer_id;
          if (!otherUserId) return null; // Skip if no other user (shouldn't happen)
          
          const { data: otherUserData, error: userError } = await supabase
            .from("users")
            .select("name, profile_photo")
            .eq("id", otherUserId)
            .single();

          if (userError && userError.code !== 'PGRST116') {
            throw userError;
          }

          // Get the last message in this chat
          const { data: lastMessageData } = await supabase
            .from("chat_messages")
            .select("message, created_at")
            .eq("chat_id", chat.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          // Get the reservation info
          const { data: reservationData, error: reservationError } = await supabase
            .from("reservations")
            .select("id, date, status, address:address(address), amount")
            .eq("id", chat.reservation_id)
            .single();

          if (reservationError && reservationError.code !== 'PGRST116') {
            throw reservationError;
          }

          // Count unread messages
          const { count } = await supabase
            .from("chat_messages")
            .select("id", { count: "exact" })
            .eq("chat_id", chat.id)
            .eq("is_read", false)
            .not("sender_id", "eq", user.id);

          // Calculate if chat should be visible based on reservation date
          const isVisible = chat.is_admin_chat ? true : 
            (reservationData ? isChatVisible(new Date(reservationData.date[0])) : true);

          return {
            ...chat,
            cleanerName: chat.cleaner_id === otherUserId 
              ? otherUserData?.name || "Cleaner" 
              : otherUserData?.name || "You",
            customerName: chat.customer_id === otherUserId 
              ? otherUserData?.name || "Customer" 
              : otherUserData?.name || "You",
            profileImage: otherUserData?.profile_photo || null,
            lastMessage: lastMessageData || null,
            unreadCount: count || 0,
            reservation: reservationData 
              ? {...reservationData, address: reservationData.address?.address} 
              : null,
            isVisible
          };
        })
      );

      // Filter out nulls and non-visible chats
      return enhancedChats.filter(chat => chat && (chat.isVisible || chat.is_admin_chat));
    } catch (error) {
      console.error("Error fetching chats:", error);
      throw error;
    }
  }, [user, userData]);

  // Function to determine if chat should be visible
  const isChatVisible = (cleaningDate: Date) => {
    const now = new Date();
    const hoursBefore = 72;
    const hoursAfter = 48;

    // Calculate time windows
    const visibilityStart = new Date(cleaningDate);
    visibilityStart.setHours(visibilityStart.getHours() - hoursBefore);

    const visibilityEnd = new Date(cleaningDate);
    visibilityEnd.setHours(visibilityEnd.getHours() + hoursAfter);

    // Check if current time is within the visibility window
    return now >= visibilityStart && now <= visibilityEnd;
  };

  // Function to subscribe to chat updates
  const subscribeToChatUpdates = useCallback((callback: (chats: any[]) => void) => {
    if (!user) return () => {};

    // Subscribe to changes in the chats table
    const chatsSubscription = supabase
      .channel('chats_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chats'
        },
        async () => {
          // When changes occur, fetch the updated chat list
          const updatedChats = await getAllChats();
          callback(updatedChats);
        }
      )
      .subscribe();

    // Subscribe to changes in the chat_messages table
    const messagesSubscription = supabase
      .channel('chat_messages_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages'
        },
        async () => {
          // When changes occur, fetch the updated chat list
          const updatedChats = await getAllChats();
          callback(updatedChats);
        }
      )
      .subscribe();

    // Return cleanup function
    return () => {
      chatsSubscription.unsubscribe();
      messagesSubscription.unsubscribe();
    };
  }, [user, getAllChats]);

  // Fetch messages for a specific chat
  const fetchMessages = useCallback(async () => {
    if (!chatId || !user) return;
    
    try {
      setLoading(true);
      
      // Get chat details and other user's info
      const { data: chatData, error: chatError } = await supabase
        .from("chats")
        .select("*")
        .eq("id", chatId)
        .single();
        
      if (chatError) throw chatError;

      // Handle differently based on whether it's an admin chat or regular chat
      if (chatData.is_admin_chat) {
        // For admin chats, if user is admin, set otherUser to the customer
        // If user is customer, set otherUser to "Customer Support"
        if (userData?.type === 'admin') {
          const { data: customerData, error: userError } = await supabase
            .from("users")
            .select("name, profile_photo")
            .eq("id", chatData.customer_id)
            .single();
            
          if (userError) throw userError;
          
          setCurrentChat({
            ...chatData,
            otherUserName: customerData.name,
            otherUserId: chatData.customer_id,
            profileImage: customerData.profile_photo
          });
        } else {
          setCurrentChat({
            ...chatData,
            otherUserName: "Customer Support",
            otherUserId: null,
            profileImage: null
          });
        }
      } else {
        // Regular chat between customer and cleaner
        const otherUserId = chatData.customer_id === user.id 
          ? chatData.cleaner_id 
          : chatData.customer_id;
          
        if (!otherUserId) {
          throw new Error("No other user found in this chat");
        }
          
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("name, profile_photo")
          .eq("id", otherUserId)
          .single();
          
        if (userError) throw userError;
        
        setCurrentChat({
          ...chatData,
          otherUserName: userData.name,
          otherUserId,
          profileImage: userData.profile_photo
        });
      }
      
      // Get messages
      const { data: messagesData, error: messagesError } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });
        
      if (messagesError) throw messagesError;
      
      // Set initial messages
      setMessages(messagesData || []);
      
      // Mark messages as read
      await supabase
        .from("chat_messages")
        .update({ is_read: true })
        .eq("chat_id", chatId)
        .not("sender_id", "eq", user.id);
        
      // Set up real-time subscription
      const channel = supabase
        .channel(`chat:${chatId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_id=eq.${chatId}`
        }, (payload) => {
          const newMessage = payload.new as ChatMessage;
          // Only add the message if it's not already in the messages array
          setMessages(prev => {
            // Check if message already exists by ID
            if (prev.some(msg => msg.id === newMessage.id)) {
              return prev;
            }
            // Check if message already exists by content and timestamp
            if (prev.some(msg => 
              msg.message === newMessage.message && 
              Math.abs(new Date(msg.created_at).getTime() - new Date(newMessage.created_at).getTime()) < 1000
            )) {
              return prev;
            }
            return [...prev, newMessage];
          });
          
          // Mark as read if from other user
          if (newMessage.sender_id !== user.id) {
            supabase
              .from("chat_messages")
              .update({ is_read: true })
              .eq("id", newMessage.id);
          }
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }, [chatId, user, userData]);

  // Send a message
  const sendMessage = useCallback(async (messageText: string, specificChatId?: string) => {
    const activeChatId = specificChatId || chatId;
    console.log('activeChatId', activeChatId, messageText);
    if (!activeChatId || !user || !messageText.trim()) return false;
    

    console.log('activeChatId', activeChatId, messageText);
    try {
      const { error } = await supabase
        .from("chat_messages")
        .insert({
          chat_id: activeChatId,
          sender_id: user.id,
          message: messageText,
          is_read: false
        });
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      return false;
    }
  }, [chatId, user]);

  // Initialize
  useEffect(() => {
    if (chatId) {
      fetchMessages().then(cleanup => {
        if (cleanup) return () => cleanup();
      });
      return () => {};
    }
  }, [chatId, fetchMessages]);

  return {
    messages,
    currentChat,
    loading,
    sendMessage,
    createChat,
    createAdminChat,
    getAllChats,
    subscribeToChatUpdates
  };
};
