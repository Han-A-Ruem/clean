
import React, { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, MessageSquare, Loader, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useChat } from '@/hooks/useChat';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';

interface ChatDetailProps {
  chat: any;
  onBack: () => void;
}

const ChatDetail: React.FC<ChatDetailProps> = ({ chat, onBack }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { sendMessage } = useChat();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const {user } = useUser();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const { supabase } = await import('@/integrations/supabase/client');
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('chat_id', chat.id)
          .order('created_at', { ascending: true });
          
        if (error) throw error;
        setMessages(data || []);
        
        // Mark messages as read
        const { error: updateError } = await supabase
          .from('chat_messages')
          .update({ is_read: true })
          .eq('chat_id', chat.id)
          .not('sender_id', 'eq', user.id);
        
        if (updateError) console.error("Error marking messages as read:", updateError);
        
        // Set up real-time subscription
        const channel = supabase
          .channel(`chat:${chat.id}`)
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: `chat_id=eq.${chat.id}`
          }, (payload) => {
            setMessages(prev => [...prev, payload.new]);
            
            // Mark new messages as read if they're from the customer
            if (payload.new.sender_id === chat.customer_id) {
              supabase
                .from('chat_messages')
                .update({ is_read: true })
                .eq('id', payload.new.id)
                .then(({ error }) => {
                  if (error) console.error("Error marking message as read:", error);
                });
            }
          })
          .subscribe();
          
        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error: any) {
        console.error("Error fetching messages:", error);
        toast({
          variant: "destructive",
          title: "Error loading messages",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (chat) {
      fetchMessages();
    }
  }, [chat, toast]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    try {
      setSending(true);
      await sendMessage(message, chat.id);
      setMessage('');
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: "Failed to send message",
        description: error.message,
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center py-4 px-2 bg-white border-b">
        <button onClick={onBack} className="p-2 mr-2">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            {chat.profileImage ? (
              <AvatarImage src={chat.profileImage} alt={chat.customerName} />
            ) : (
              <AvatarFallback className="bg-gray-100">
                <User className="h-4 w-4 text-gray-500" />
              </AvatarFallback>
            )}
          </Avatar>
          <h2 className="text-lg font-semibold">{chat.customerName}</h2>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex justify-center">
            <Loader className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender_id !== user.id ? "justify-start" : "justify-end"
              }`}
            >
              {msg.sender_id !== user.id && (
                <div className="mr-2 flex-shrink-0">
                  <Avatar className="h-8 w-8">
                    {chat.profileImage ? (
                      <AvatarImage src={chat.profileImage} alt={chat.customerName} />
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
                  msg.sender_id !== user.id
                    ? "bg-gray-100 text-gray-800 rounded-tl-none"
                    : "bg-primary text-white rounded-tr-none"
                }`}
              >
                <p className="break-words">{msg.message}</p>
                <div
                  className={`text-xs mt-1 ${
                    msg.sender_id !== user.id
                      ? "text-gray-500"
                      : "text-white/80 text-right"
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
      
      <form onSubmit={handleSendMessage} className="p-3 border-t bg-white">
        <div className="flex items-center">
          <Input
            className="flex-1 mr-2"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="bg-primary hover:bg-primary/90 text-white rounded-full"
            disabled={!message.trim() || sending}
          >
            {sending ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <MessageSquare className="h-5 w-5" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatDetail;
