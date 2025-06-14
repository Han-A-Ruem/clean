
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clipboard, LogOut, Save, XCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PageHeader } from '@/components/Utils';

const Profile = () => {
  const { userData, fetchUserData } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userData?.name || '');
  const [phone, setPhone] = useState(userData?.phone || '');
  
  useEffect(() => {
    if (userData) {
      setName(userData.name || '');
      setPhone(userData.phone || '');
    }
  }, [userData]);
  
  // Use the referral_code from userData if available
  const referralCode = userData?.referal_code || 
    (userData?.user_id ? `REF-${userData.user_id.substring(0, 8).toUpperCase()}` : 'LOADING...');
    
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "복사 완료!",
      description: "추천인 코드가 클립보드에 복사되었습니다.",
    });
  };
  
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "로그아웃 되었습니다",
        description: "다음에 또 만나요!",
      });
      
      navigate("/sign-in");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "오류가 발생했습니다",
        description: error.message,
      });
    }
  };
  
  const handleLeaveService = async () => {
    if (window.confirm("정말로 서비스를 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      try {
        if (!userData?.user_id) {
          throw new Error("사용자 정보를 찾을 수 없습니다.");
        }
        
        // Update the user's is_active status to false
        const { error: updateError } = await supabase
          .from('users')
          .update({ is_active: false })
          .eq('user_id', userData.user_id);
          
        if (updateError) throw updateError;
        
        // Sign out the user
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) throw signOutError;
        
        toast({
          title: "서비스 탈퇴 완료",
          description: "계정이 성공적으로 비활성화되었습니다. 다시 이용을 원하시면 로그인해주세요.",
        });
        
        navigate("/sign-in");
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "오류가 발생했습니다",
          description: error.message,
        });
      }
    }
  };

  const handleSaveProfile = async () => {
    if (!userData?.user_id) {
      toast({
        variant: "destructive",
        title: "오류가 발생했습니다",
        description: "사용자 정보를 찾을 수 없습니다.",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: name,
          phone_number: phone ? Number(phone) : null
        })
        .eq('user_id', userData.user_id);

      if (error) throw error;
      
      toast({
        title: "프로필 업데이트 완료",
        description: "프로필이 성공적으로 업데이트되었습니다.",
      });
      
      // Refresh user data
      if (fetchUserData) {
        fetchUserData(userData.user_id);
      }
      
      setIsEditing(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "오류가 발생했습니다",
        description: error.message,
      });
    }
  };

  return (
    <div className=" space-y-6">
      <PageHeader title='프로필' rightElement={
!isEditing ? (
  <Button 
    variant="outline" 
    onClick={() => setIsEditing(true)}
  >
    수정하기
  </Button>
) : (
  <Button 
    onClick={handleSaveProfile}
    className="flex items-center gap-2"
  >
    <Save className="h-4 w-4" />
    저장
  </Button>
)
      }/>


      
      <div className="space-y-6 bg-white rounded-lg px-4 shadow-sm">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">이름</label>
          {isEditing ? (
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="이름을 입력하세요"
              className="p-3"
            />
          ) : (
            <p className="p-3 bg-gray-100 rounded-md">{userData?.name || "이름 정보 없음"}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">전화번호</label>
          {isEditing ? (
            <Input 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              placeholder="전화번호를 입력하세요"
              type="tel"
              className="p-3"
            />
          ) : (
            <p className="p-3 bg-gray-100 rounded-md">{userData?.phone || "전화번호 정보 없음"}</p>
          )}
        </div>
        
        <div className="space-y-2 px-4">
          <label className="text-sm font-medium text-gray-700">추천인 코드</label>
          <div className="flex items-center gap-2">
            <p className="p-3 bg-gray-100 rounded-md flex-1 font-mono">{referralCode}</p>
            <Button 
              type="button" 
              variant="outline" 
              size="icon"
              onClick={copyToClipboard}
              title="클립보드에 복사"
            >
              <Clipboard className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500">친구에게 이 코드를 공유하면 포인트를 받을 수 있어요.</p>
        </div>
      </div>
      
      <div className="pt-4 space-y-3 px-4">
        <Button 
          variant="secondary" 
          className="w-full flex justify-center items-center gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          로그아웃
        </Button>
        
        <Button 
          variant="destructive" 
          className="w-full flex justify-center items-center gap-2"
          onClick={handleLeaveService}
        >
          <XCircle className="h-4 w-4" />
          서비스 탈퇴하기
        </Button>
      </div>
    </div>
  );
};

export default Profile;
