
import { useNavigate } from 'react-router-dom';
import PushAlarmSettings from './notifications/PushAlarmSettings';
import { PageHeader } from '@/components/Utils';
import { NotificationConfig } from '@/contexts/NotificationContext';

const NotificationsSettings = () => {
  const navigate = useNavigate();
  
  return (
    <NotificationConfig position='top-center' offset='5rem'  reset={true} >
    <div className="">
      <PageHeader 
        title="알림 설정" 
        onBack={() => navigate('/more')}
      />
      
      <div className="p-4">
        <PushAlarmSettings />
      </div>
    </div></NotificationConfig>
  );
};

export default NotificationsSettings;
