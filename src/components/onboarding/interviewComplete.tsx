import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/Utils';
import { CheckCircle2, CalendarCheck, Bell } from 'lucide-react';
import { useCleanerRegistration } from '@/contexts/CleanerRegistrationContext';
import { supabase } from '@/integrations/supabase/client';

const InterviewComplete: React.FC = () => {
  const navigate = useNavigate();
  

const handleLogout = async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error logging out:', error);
            // Optionally show an error message to the user
        } else {
            // Redirect to home or login page after successful logout
            // Since this component is likely shown after completing a step,
            // navigating to '/' might trigger redirection logic in ProtectedRouteProvider.
            // Navigating directly to '/sign-in' might be clearer if that's the desired outcome.
            navigate('/sign-in'); 
        }
    } catch (err) {
        console.error('Logout failed:', err);
        // Handle unexpected errors during logout
    }
};

  return (
    <div className="min-h-screen bg-gray-50/80">
      <PageHeader
        title="면접 예약 완료"
        className="backdrop-blur-lg bg-white/70 border-b border-white/30"
      />
      
      <div className="p-4 space-y-6 max-w-md mx-auto">
        <div className="flex flex-col items-center justify-center py-6">
          <div className="bg-green-100 rounded-full p-3 mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-center">면접 예약이 완료되었습니다</h2>
          <p className="text-gray-500 text-center mt-2">
            면접 일정 확정 및 추가 안내사항은 SMS를 통해 전달드립니다.
          </p>
        </div>
        
        <Card className="border-none shadow-lg bg-white">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-start">
              <div className="bg-primary-cleaner/10 p-2 rounded-full mr-3">
                <CalendarCheck className="h-5 w-5 text-primary-cleaner" />
              </div>
              <div>
                <h3 className="font-medium">면접 준비사항</h3>
                <ul className="text-sm text-gray-600 mt-2 list-disc list-inside space-y-1">
                  <li>신분증을 반드시 지참해 주세요 (주민등록증, 운전면허증, 여권 등)</li>
                  <li>면접시간보다 15분 일찍 도착하시면 좋습니다</li>
                  <li>간단한 자기소개를 준비해 오시면 도움이 됩니다</li>
                  <li>정장이 아닌 단정한 복장으로 참석하셔도 됩니다</li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-primary-cleaner/10 p-2 rounded-full mr-3">
                <Bell className="h-5 w-5 text-primary-cleaner" />
              </div>
              <div>
                <h3 className="font-medium">알림사항</h3>
                <p className="text-sm text-gray-600 mt-2">
                  면접 확정 및 추가 안내는 등록하신 휴대폰 번호로 SMS를 통해 안내드립니다. 
                  일정 변경 필요시 SMS로 안내받은 연락처로 문의해 주세요.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="pt-4">
          <Button
            className="w-full bg-primary-cleaner hover:bg-primary-cleaner/90"
            onClick={handleLogout} // Assuming handleGoToHome is intended for now, update if logout logic is needed elsewhere
          >
            홈으로 이동
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewComplete;