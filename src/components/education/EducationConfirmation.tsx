
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EducationConfirmationProps {
  locationName: string;
  locationAddress: string;
  date: string;
  time: string;
  directions: string;
  handleChangeLocation: () => void;
}

const EducationConfirmation = ({
  locationName,
  locationAddress,
  date,
  time,
  directions,
  handleChangeLocation
}: EducationConfirmationProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [trainingId, setTrainingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchTrainingRecord = async () => {
      try {
        const userDataStr = localStorage.getItem('education_user_data');
        if (!userDataStr) return;
        
        const userData = JSON.parse(userDataStr);
        
        const { data, error } = await supabase
          .from('training')
          .select('id')
          .eq('phone_number', parseInt(userData.phone_number))
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setTrainingId(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching training record:", error);
      }
    };
    
    fetchTrainingRecord();
  }, []);
  
  const handleChangeReservation = () => {
    handleChangeLocation();
  };
  
  const handleCancelReservation = async () => {
    if (!trainingId) {
      toast({
        variant: "destructive",
        title: "오류가 발생했습니다",
        description: "교육 예약 정보를 찾을 수 없습니다.",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('training')
        .update({ status: 'cancelled' })
        .eq('id', trainingId);
      
      if (error) throw error;
      
      toast({
        title: "교육 예약이 취소되었습니다",
      });
      
      navigate("/education");
    } catch (error: any) {
      console.error("Error cancelling reservation:", error);
      toast({
        variant: "destructive",
        title: "취소 중 오류가 발생했습니다",
        description: error.message || "다시 시도해주세요.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleContinue = () => {
    navigate("/Member");
  };
  
  return (
    <div className="min-h-screen bg-white">
      <div className="container px-4">
        <div className="flex justify-end items-center py-4">
          <Menu className="h-6 w-6" />
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">교육장에서</h1>
            <h2 className="text-2xl font-bold">1월 7일에 뵙겠습니다.</h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg">교육 일시</h3>
              <p className="text-gray-900 mt-2">{date}</p>
              <p className="text-gray-900">{time}</p>
              <p className="text-gray-600 text-sm mt-2">※ 식사시간은 별도로 제공하지 않습니다.</p>
            </div>

            <div>
              <h3 className="text-lg">준비물</h3>
              <p className="text-gray-900 mt-2">
                휴대폰, 신분증
                <br />
                (회사와의 첫 만남인 만큼 단정한 모습으로 참석부탁드립니다.)
              </p>
            </div>

            <div>
              <h3 className="text-lg">교육 장소</h3>
              <p className="text-gray-900 mt-2">{locationName}</p>
              <p className="text-gray-600">{locationAddress}</p>
              
              <div className="mt-4 rounded-lg overflow-hidden">
                <img
                  src="placeholder.svg"
                  alt="Location map"
                  className="w-full h-48 object-cover"
                />
              </div>
              
              <p className="text-gray-600 mt-4 text-sm leading-relaxed">
                {directions}
              </p>
            </div>
          </div>

          {/* Added Continue Button */}
          <div className="mb-10">
            <Button 
              onClick={handleContinue}
              className="w-full bg-primary-cleaner hover:bg-primary-cleaner text-white"
            >
              완료 후 계속하기
            </Button>
          </div>

          <div className="p-4 bg-white border-t pb-20">
            <div className="container flex gap-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleChangeReservation}
                disabled={isLoading}
              >
                교육 예약 변경
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                onClick={handleCancelReservation}
                disabled={isLoading}
              >
                {isLoading ? "처리 중..." : "교육 예약 취소"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationConfirmation;
