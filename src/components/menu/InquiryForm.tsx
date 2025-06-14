import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PageHeader } from '../Utils';
import { Input } from '../ui/input';
import { Send, User, Loader } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useChat } from '@/hooks/useChat';
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";

const InquiryForm = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const { user } = useUser();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const { createAdminChat, sendMessage, messages, currentChat, loading } = useChat(chatId || undefined);
  const [sending, setSending] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Check if user has an existing admin chat
  useEffect(() => {
    let mounted = true;

    const checkExistingChat = async () => {
      if (!user) return;
      try {
        setInitializing(true);
        const existingChatId = await createAdminChat(true);
        if (existingChatId && mounted) {
          setChatId(existingChatId);
        } else if (mounted) {
          // If no existing chat, create a new one
          const newChatId = await createAdminChat();
          if (newChatId && mounted) {
            setChatId(newChatId);
          } else {
            throw new Error("Failed to create chat");
          }
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
        if (mounted) {
          toast.error("채팅을 초기화할 수 없습니다. 다시 시도해 주세요.");
        }
      } finally {
        if (mounted) {
          setInitializing(false);
        }
      }
    };
    
    checkExistingChat();

    return () => {
      mounted = false;
    };
  }, [user, createAdminChat]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;
    
    try {
      setSending(true);
      
      // If no chat exists yet, create one
      if (!currentChat?.id) {
        const chatId = await createAdminChat();
        if (!chatId) {
          throw new Error("Failed to create chat");
        }
      }
      
      // Send message
      const sent = await sendMessage(message);
      if (!sent) {
        throw new Error("Failed to send message");
      }
      
      setMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("메시지를 전송할 수 없습니다. 나중에 다시 시도해 주세요.");
    } finally {
      setSending(false);
    }
  };

  // Only show loading screen during initial load
  if (initializing) {
    return (
      <div className="flex flex-col h-screen">
        <PageHeader title="관리자" backRoute="/menu"/>
        <div className="flex-1 flex items-center justify-center">
          <Loader className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <PageHeader title="관리자" />
      
      <div className="flex-1 p-4 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : messages && messages.length > 0 ? (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender_id === user?.id ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender_id !== user?.id && (
                  <div className="mr-2 flex-shrink-0">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gray-100">
                        <User className="h-4 w-4 text-gray-500" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
                
                <div
                  className={`px-4 py-2 rounded-lg max-w-[75%] ${
                    msg.sender_id === user?.id
                      ? "bg-[#5CE0D8] text-white rounded-tr-none"
                      : "bg-gray-100 text-gray-800 rounded-tl-none"
                  }`}
                >
                  <p className="break-words">{msg.message}</p>
                  <div
                    className={`text-xs mt-1 ${
                      msg.sender_id === user?.id
                        ? "text-white/80 text-right"
                        : "text-gray-500"
                    }`}
                  >
                    {format(new Date(msg.created_at), "HH:mm")}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
        ) : (
          <div className="text-gray-400 text-center h-full flex items-center justify-center">
            대화를 시작하세요
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t bg-white">
        <div className="flex items-center">
          <Input
            className="flex-1 mr-2"
            placeholder="메시지를 입력하세요..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={sending}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="bg-[#5CE0D8] hover:bg-[#4bcdc5] text-white rounded-full"
            disabled={!message.trim() || sending}
          >
            {sending ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InquiryForm;
