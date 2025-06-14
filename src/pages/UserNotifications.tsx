import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import TabBar from "@/components/TabBar";
import NotificationsList from "@/components/notifications/NotificationsList";
import NotificationDetail from "@/components/notifications/NotificationDetail";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/Utils";

const UserNotifications = () => {
  const { user } = useUser();
  const [selectedNotification, setSelectedNotification] = useState<{
    id: string;
    title: string;
    message?: string;
    type?: string;
    action_url?: string;
  } | null>(null);

  const navigate = useNavigate();

  const handleSelectNotification = (notification: {
    id: string;
    title: string;
    message?: string;
    type?: string;
    action_url?: string;
  }) => {
    // If there's an action_url, navigate to it
    if (notification.action_url && notification.action_url.trim() !== '') {
      navigate(notification.action_url);
    } else {
      // Otherwise, show the notification detail
      setSelectedNotification(notification);
    }
  };

  const handleCloseDetail = () => {
    setSelectedNotification(null);
  };

  // Show notification detail if a notification is selected and doesn't have an action_url
  if (selectedNotification && (!selectedNotification.action_url || selectedNotification.action_url.trim() === '')) {
    return (
      <NotificationDetail
        isOpen={true}
        onClose={handleCloseDetail}
        title={selectedNotification.title}
        content={selectedNotification.message}
        type={selectedNotification.type}
      />
    );
  }

  return (
    <>
      <div className="pb-16">
        <NotificationsList onSelectNotification={handleSelectNotification} />
      </div>
    </>
  );
};

export default UserNotifications;
