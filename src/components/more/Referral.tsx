
import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, CheckCircle, Gift, Send, Users, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const Referral = () => {
  const { userData, fetchUserData, user } = useUser();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [friendReferral, setFriendReferral] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  // Get the referral code from userData
  const referralCode = userData?.friend_referal || 'No referral code available';
  
  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    
    toast({
      title: "복사되었습니다",
      description: "친구에게 공유하세요!",
    });
    
    // Reset the copied state after 3 seconds
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const handleSubmitFriendReferral = async () => {
    if (!friendReferral.trim()) {
      toast({
        variant: "destructive",
        title: "추천인 코드를 입력해주세요",
      });
      return;
    }

    // Don't allow users to enter their own referral code
    if (friendReferral === userData?.referal_code) {
      toast({
        variant: "destructive",
        title: "자신의 추천인 코드는 사용할 수 없습니다",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if the entered referral code exists
      if(userData?.friend_referal) return;
      
      // Update the user's friend_referral field
      const { error: updateError } = await supabase
        .from('users')
        .update({ friend_referal: friendReferral })
        .eq('user_id', user?.id);

      if (updateError) {
        throw updateError;
      }

      // Refresh user data
      if (user) {
        await fetchUserData(user.id);
      }

      toast({
        title: "추천인 코드가 등록되었습니다",
        description: "이제 친구의 추천 혜택을 받으실 수 있습니다.",
      });
      
      setFriendReferral('');
    } catch (error: any) {
      console.error("Error submitting referral code:", error);
      toast({
        variant: "destructive",
        title: "추천인 코드 등록 중 오류가 발생했습니다",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">

<div className="sticky top-0 bg-white z-10 border-b">
        <div className="flex items-center p-4 px-0">
          <button onClick={() => navigate('/more')} className="p-2">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="flex justify-between w-full pr-4 items-center">

          <h1 className="text-2xl font-bold">친구 초대</h1>
      
            </div></div></div>
      {/* Friend's Referral Code Section */}
      {!userData?.friend_referal ? (
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          {/* <div className="flex items-center space-x-2 mb-2">
            <Gift className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">추천인 코드 입력</h3>
          </div> */}
          
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">내 추천 코드</h3>
          </div>
          <p className="text-gray-700">
            친구를 초대하고 서비스를 사용하시면 두 분 모두 포인트를 받으실 수 있습니다.
          </p>
          
          <div className="flex space-x-2">
            <Input 
              placeholder="추천인 코드 입력"
              value={friendReferral}
              onChange={(e) => setFriendReferral(e.target.value)}
              className="flex-grow"
            />
            <Button 
              onClick={handleSubmitFriendReferral}
              disabled={isSubmitting}
            >
              <Send className="h-4 w-4 mr-2" />
              등록
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-2">
          <div className="flex items-center space-x-2 mb-2">
          <Users className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">추천인 코드 등록완료</h3>
          </div>
          
          <p className="text-sm text-gray-600">
            추천인 코드가 이미 등록되었습니다: 
          </p>

           {/* Referral code display */}
        <div className="border border-gray-200 rounded-md flex items-center justify-between p-3 bg-gray-50">
          <span className="font-mono text-md">{referralCode}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleCopyReferral}
            className="ml-2"
          >
            {copied ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <Copy className="h-5 w-5" />
            )}
          </Button>
        </div>
        </div>
      )}
      {/* My Referral Code Section */}
      <div className="bg-white rounded-lg p-6 space-y-4 mt-6">
        {/* Instructions */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">사용 방법</h3>
          <ol className="space-y-2 text-sm text-gray-600 list-decimal pl-4">
            <li>친구에게 초대 코드를 공유하세요.</li>
            <li>친구가 회원가입 시 초대 코드를 입력합니다.</li>
            <li>친구가 첫 서비스를 예약하면 두 분 모두 포인트를 받습니다.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Referral;
