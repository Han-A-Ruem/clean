
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Notification } from "@/types/notification";

interface CreateNotificationParams {
  userId?: string | null;
  title: string;
  message: string;
  type: Notification['type'];
  action_url?: string;
  to_type?: string;
}

export function useNotification() {
  const { toast } = useToast();

  const createNotification = async ({ userId, title, message, type, action_url, to_type }: CreateNotificationParams) => {
    try {
      // Ensure required fields are present
      if ((!userId && !to_type) || !title || !message || !type) {
        console.error("Missing required fields for notification");
        toast({
          variant: "destructive",
          title: "알림 생성 실패",
          description: "필수 필드가 누락되었습니다.",
        });
        return null;
      }

      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title,
          message,
          type,
          action_url,
          status: "unread",
          to_type
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating notification:', error);
        toast({
          variant: "destructive",
          title: "알림 생성 실패",
          description: error.message,
        });
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error in createNotification:', err);
      toast({
        variant: "destructive",
        title: "오류 발생",
        description: "알림을 생성하는 중 문제가 발생했습니다.",
      });
      return null;
    }
  };

  // New function to test sending a notification (can be used for development testing)
  const sendTestNotification = async (userId?: string) => {
    return createNotification({
      userId,
      title: "테스트 알림",
      message: "이것은 테스트 알림입니다. 이 기능이 잘 작동하는지 확인하기 위한 것입니다.",
      type: "system",
      action_url: "/",
      to_type: userId ? undefined : "all"
    });
  };

  return { 
    createNotification,
    sendTestNotification
  };
}
