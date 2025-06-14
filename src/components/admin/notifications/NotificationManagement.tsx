
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNotification } from "@/hooks/useNotification";
import GlobalNotificationModal from "./GlobalNotificationModal";

const NotificationManagement = () => {
  const [modalOpen, setModalOpen] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">알림 관리</h1>
        <Button 
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2"
        >
          알림 전송
        </Button>
      </div>
      
      <div className="bg-muted/20 p-6 rounded-lg">
        <h2 className="text-lg font-medium mb-4">알림 정보</h2>
        <p className="text-muted-foreground">
          여기에서 사용자들에게 알림을 보낼 수 있습니다. 시스템 공지사항 등 전체 사용자에게 
          메시지를 보낼 때 사용하세요.
        </p>
        <div className="mt-4">
          <h3 className="font-medium">알림 유형:</h3>
          <ul className="list-disc list-inside mt-2 text-muted-foreground">
            <li>시스템 알림: 업데이트, 점검 등의 시스템 정보</li>
            <li>프로모션 알림: 신규 프로모션, 할인 정보 등</li>
            <li>정보 알림: 일반 정보 전달을 위한 알림</li>
          </ul>
        </div>
      </div>

      <GlobalNotificationModal 
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
};

export default NotificationManagement;
