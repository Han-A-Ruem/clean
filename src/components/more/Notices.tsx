
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/Utils';

interface Notice {
  id: number;
  title: string;
  date: string;
  isNew: boolean;
  content?: string;
}

const Notices = () => {
  const navigate = useNavigate();
  
  const [notices, setNotices] = useState<Notice[]>([
    {
      id: 1,
      title: "서비스 점검 안내",
      date: "2023-06-15",
      isNew: false,
      content: "서비스 점검을 위해 6월 15일 오전 2시부터 4시까지 서비스 이용이 제한됩니다."
    },
    {
      id: 2,
      title: "앱 업데이트 안내",
      date: "2023-05-30",
      isNew: true,
      content: "새로운 기능과 버그 수정이 포함된 최신 버전이 출시되었습니다. 앱스토어에서 업데이트해 주세요."
    },
    {
      id: 3,
      title: "개인정보처리방침 개정 안내",
      date: "2023-05-10",
      isNew: false,
      content: "2023년 5월 10일부터 적용되는, 개인정보처리방침이 개정되었습니다. 자세한 내용은 설정 > 개인정보처리방침에서 확인하실 수 있습니다."
    },
  ]);
  
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  
  const handleNoticeClick = (notice: Notice) => {
    setSelectedNotice(notice);
    
    // Mark as read if it was new
    if (notice.isNew) {
      setNotices(prevNotices => 
        prevNotices.map(n => 
          n.id === notice.id ? { ...n, isNew: false } : n
        )
      );
    }
  };
  
  const handleBackClick = () => {
    if (selectedNotice) {
      setSelectedNotice(null);
    } else {
      navigate('/more');
    }
  };
  
  return (
    <div className="">
      <PageHeader 
        title={selectedNotice ? selectedNotice.title : '공지사항'} 
        onBack={handleBackClick}
      />
      
      {selectedNotice ? (
        <div className="p-4">
          <div className="mb-2 flex justify-between items-center">
            <p className="text-sm text-gray-500">{selectedNotice.date}</p>
          </div>
          <div className="mt-4">
            <p className="text-gray-800 whitespace-pre-line">{selectedNotice.content}</p>
          </div>
        </div>
      ) : (
        <div className="p-4">
          <div className="space-y-4">
            {notices.map((notice) => (
              <div 
                key={notice.id} 
                className={`border-b pb-3 cursor-pointer ${
                  notice.isNew ? 'bg-yellow-50 p-3 rounded-sm' : 'bg-white p-3'
                }`}
                onClick={() => handleNoticeClick(notice)}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{notice.title}</h3>
                  {notice.isNew && (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 ml-2">
                      New
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">{notice.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notices;
