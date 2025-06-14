
import React, { useState, useEffect, useRef } from "react";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useChat } from "@/hooks/useChat";
import { PageHeader } from "@/components/Utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, User, Loader } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";

interface ChatMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface ChatDetails {
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

const ChatDetail = () => {
  const { user } = useUser();
  const { messages, currentChat, loading, sendMessage } = useChat();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      setSending(true);
      await sendMessage(message);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {currentChat ? (
        <>
          <PageHeader 
            title={currentChat.otherUserName || "Chat"} 
            backRoute={currentChat.is_admin_chat ? "/menu/inquiry" : "/menu/chat"}
            showBackButton={true}
          />
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender_id === user?.id ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender_id !== user?.id && (
                    <div className="mr-2 flex-shrink-0">
                      <Avatar className="h-8 w-8">
                        {currentChat.profileImage ? (
                          <AvatarImage src={currentChat.profileImage} alt={currentChat.otherUserName} />
                        ) : (
                          <AvatarFallback className="bg-gray-100">
                            <User className="h-4 w-4 text-gray-500" />
                          </AvatarFallback>
                        )}
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
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">No messages yet</p>
              </div>
            )}
            <div ref={messageEndRef} />
          </div>
          
          <form onSubmit={handleSubmit} className="p-3 border-t bg-white">
            <div className="flex items-center">
              <Input
                className="flex-1 mr-2"
                placeholder="메시지를 입력하세요..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button 
                type="submit" 
                size="icon" 
                className="bg-[#5CE0D8] hover:bg-[#4bcdc5] text-white rounded-full"
                disabled={!message.trim() || sending}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <Loader className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}
    </div>
  );
};

export default ChatDetail;
