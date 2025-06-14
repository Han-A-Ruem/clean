
import React from "react";
import { ArrowLeft, Info, AlertTriangle, Bell, CheckCircle } from "lucide-react";

interface NotificationDetailProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content?: string;
  type?: string;
}

const NotificationDetail: React.FC<NotificationDetailProps> = ({
  isOpen,
  onClose,
  title,
  content,
  type = "system"
}) => {
  if (!isOpen) return null;

  // Get icon based on notification type
  const getIcon = () => {
    switch (type) {
      case "system":
        return <Info className="h-8 w-8 text-blue-500" />;
      case "warning":
      case "late":
        return <AlertTriangle className="h-8 w-8 text-amber-500" />;
      case "reminder":
        return <Bell className="h-8 w-8 text-gray-500" />;
      case "success":
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case "promotion":
        return <Bell className="h-8 w-8 text-purple-500" />;
      default:
        return <Info className="h-8 w-8 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="px-4 py-3 border-b flex items-center">
          <button
            onClick={onClose}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-medium ml-2">알림 상세</h1>
        </div>

        {/* Notification Content */}
        <div className="p-6 flex-grow flex flex-col items-center">
          <div className="mb-6">{getIcon()}</div>
          
          <h2 className="text-xl font-semibold text-center mb-4">{title}</h2>
          
          {content && (
            <div className="prose max-w-none w-full mb-8">
              <p className="text-gray-600 whitespace-pre-line text-center">
                {content}
              </p>
            </div>
          )}
        </div>

        {/* Footer Button */}
        <div className="p-4 border-t mt-auto">
          <button
            onClick={onClose}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetail;
