
import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const PushAlarmSettings = () => {
  const { userData, user } = useUser();
  const { toast } = useToast();
  
  // Default to true if the user preferences don't exist yet
  const [eventNotifications, setEventNotifications] = useState<boolean>(true);
  const [appNotifications, setAppNotifications] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Function to update notification preferences in the database
  const updateNotificationPreference = async (type: 'event' | 'app', enabled: boolean) => {
    if (!user) return;

    setIsUpdating(true);

    try {
      // Here we would update the user's notification preferences in the database
      // This is a placeholder for actual implementation
      // const { error } = await supabase.from('user_preferences').upsert({
      //   user_id: user.id,
      //   [type === 'event' ? 'event_notifications' : 'app_notifications']: enabled
      // });

      // if (error) throw error;

      toast({
        title: "알림 설정이 업데이트되었습니다",
        description: "변경 사항이 성공적으로 저장되었습니다.",
      });
    } catch (error: any) {
      console.error('Error updating notification preferences:', error);
      toast({
        variant: "destructive",
        title: "설정 업데이트 중 오류가 발생했습니다",
        description: error.message || "나중에 다시 시도해 주세요.",
      });
      
      // Revert the state change on error
      if (type === 'event') {
        setEventNotifications(!enabled);
      } else {
        setAppNotifications(!enabled);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEventToggle = (checked: boolean) => {
    setEventNotifications(checked);
    updateNotificationPreference('event', checked);
  };

  const handleAppToggle = (checked: boolean) => {
    setAppNotifications(checked);
    updateNotificationPreference('app', checked);
  };

  return (
    <div className="space-y-8 ">
      {/* Event Notifications */}
      <div className="space-y-1">
        <h3 className="text-lg font-medium">이벤트 소식 알림</h3>
        <div className='flex flex-row items-start justify-between gap-6'>
        <p className="text-gray-500 text-sm">카카오톡, SMS, 앱푸시를 통해 이벤트 소식을 알려드립니다.</p>
        <div className="flex items-center justify-between">
          <Switch 
            checked={eventNotifications}
            onCheckedChange={handleEventToggle}
            disabled={isUpdating}
          />
        </div>
</div>
      </div>

      {/* App Push Notifications */}
      <div className="space-y-1">
        <h3 className="text-lg font-medium">앱 푸시 알림</h3>
        <div className='flex flex-row items-start justify-between'>
        <p className="text-gray-500 text-sm">중요한 서비스 진행 소식을 알려드려요.</p>
        <div className="flex items-center justify-between">
          <Switch 
            checked={appNotifications}
            onCheckedChange={handleAppToggle}
            disabled={isUpdating}
          />
        </div>
        </div>
      
      </div>
    </div>
  );
};

export default PushAlarmSettings;
