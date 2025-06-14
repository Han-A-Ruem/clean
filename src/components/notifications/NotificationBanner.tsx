
import React, { useEffect, useCallback, useState } from "react";
import { Notification } from "@/types/notification";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";
import { X, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotification } from "@/contexts/NotificationContext";

const NotificationBanner = () => {
  const navigate = useNavigate();
  const { userData } = useUser();
  const { config } = useNotification();
  const [activeNotification, setActiveNotification] = useState<Notification | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleNotificationClick = (notification: Notification) => {
    if (notification.action_url) {
      navigate(notification.action_url);
    }
    setIsVisible(false);
  };

  const updateNotificationStatus = async (notificationId: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ 
          status: 'read',
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId);
    } catch (error) {
      console.error('Error updating notification status:', error);
    }
  };

  const dismissNotification = () => {
    if (activeNotification) {
      updateNotificationStatus(activeNotification.id);
    }
    setIsVisible(false);
  };

  const subscribeToNotifications = useCallback(() => {
    if (!userData?.user_id) return null;

    // Create a subscription to new notifications
    const channel = supabase
      .channel('notification-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          const newNotification = payload.new as Notification;
        
          // Check if notification is for this user specifically, for this user's type, or for all users
          if(newNotification.user_id === userData.user_id || 
             newNotification.to_type === userData.type || 
             newNotification.to_type === 'all') {
                // Show the custom notification banner
                setActiveNotification(newNotification);
                setIsVisible(true);
          
                // Automatically hide after 5 seconds
                setTimeout(() => {
                  setIsVisible(false);
                  // Mark as read when auto-hiding
                  updateNotificationStatus(newNotification.id);
                }, 5000);
          }
        }
      )
      .subscribe();

    return channel;
  }, [userData?.user_id, userData?.type]);

  useEffect(() => {
    // Set up subscription
    const channel = subscribeToNotifications();
    
    // Clean up subscription
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [subscribeToNotifications]);

  // Get offset from context or use default
  const topOffset = config.position?.includes('top') 
    ? config.offset || '4rem'
    : '4rem';

  return (
    <AnimatePresence>
      {isVisible && activeNotification && (
        <motion.div 
          className="fixed left-0 right-0 z-50 pt-4"
          style={{ top: topOffset }}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          drag="x"
          onClick={() => handleNotificationClick(activeNotification)}
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => {
            if (Math.abs(info.offset.x) > 100) {
              dismissNotification();
            }
          }}
        >
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mx-4">
            <div className="flex items-start p-3">
              <div className="bg-blue-600 rounded-lg h-12 w-12 flex items-center justify-center mr-3 flex-shrink-0">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-900 text-lg">
                    {activeNotification.title}
                  </h3>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      dismissNotification();
                    }}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label="닫기"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-gray-600 mt-1 text-sm line-clamp-2">
                  {activeNotification.message}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationBanner;
