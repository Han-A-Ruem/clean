
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EducationApplicationSheetProps {
  isOpen: boolean;
  onClose: () => void;
  locationName: string;
  locationAddress: string;
  date: string;
  time: string;
  parking?: string;
  handleSubmit: () => void;
}

const EducationApplicationSheet = ({
  isOpen,
  onClose,
  locationName,
  locationAddress,
  date,
  time,
  parking,
  handleSubmit,
}: EducationApplicationSheetProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trainingId, setTrainingId] = useState<string | null>(null);
  
  // Check if user already has a pending training application
  useEffect(() => {
    const checkExistingApplication = async () => {
      try {
        // Check if user is authenticated
        const { data: authData } = await supabase.auth.getUser();
        if (!authData.user) return;
        
        // Get stored user data
        const userDataStr = localStorage.getItem('education_user_data');
        if (!userDataStr) return;
        
        const userData = JSON.parse(userDataStr);
        
        // Check if this user already has a training record
        const { data, error } = await supabase
          .from('training')
          .select('id, status')
          .eq('phone_number', parseInt(userData.phone_number))
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setTrainingId(data[0].id);
        }
      } catch (error) {
        console.error("Error checking existing application:", error);
      }
    };
    
    if (isOpen) {
      checkExistingApplication();
    }
  }, [isOpen]);

  const handleApplyTraining = async () => {
    setIsSubmitting(true);
    
    try {
      // Check if user is authenticated
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        toast({
          variant: "destructive",
          title: "인증이 필요합니다",
          description: "서비스를 이용하기 위해 로그인해주세요.",
        });
        return;
      }
      
      // Get stored user data
      const userDataStr = localStorage.getItem('education_user_data');
      if (!userDataStr) {
        toast({
          variant: "destructive",
          title: "오류가 발생했습니다",
          description: "사용자 정보를 찾을 수 없습니다. 다시 시도해주세요.",
        });
        return;
      }
      
      const userData = JSON.parse(userDataStr);
      
      // Create or update user record
      const { error: userError } = await supabase
        .from('users')
        .upsert([
          {
            id: authData.user.id,
            name: userData.name,
            status: 'pending', // Pending education completion
            type: 'cleaner', // Assuming this is for cleaners
          }
        ]);
      
      if (userError) throw userError;
      
      if (trainingId) {
        // Update existing training record
        const { error } = await supabase
          .from('training')
          .update({
            training_area: locationName,
            schedule: `${date} ${time}`,
            status: 'scheduled'
          })
          .eq('id', trainingId);
        
        if (error) throw error;
      } else {
        // Create new training record
        const { error } = await supabase
          .from('training')
          .insert([
            {
              name: userData.name,
              phone_number: parseInt(userData.phone_number),
              resident_id: userData.resident_id,
              training_area: locationName,
              schedule: `${date} ${time}`,
              status: 'scheduled'
            }
          ]);
        
        if (error) throw error;
      }
      
      toast({
        title: "교육 신청이 완료되었습니다",
        description: "선택하신 교육 일정이 등록되었습니다.",
      });
      
      // Close sheet and proceed
      onClose();
      handleSubmit();
    } catch (error: any) {
      console.error("Error applying for training:", error);
      toast({
        variant: "destructive",
        title: "신청 중 오류가 발생했습니다",
        description: error.message || "다시 시도해주세요.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh]">
        <SheetHeader className="relative border-b pb-4">
          <button 
            onClick={onClose}
            className="absolute right-0 top-0"
          >
          </button>
          <SheetTitle className="text-left text-xl">교육 상세정보</SheetTitle>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">교육장</h3>
            <p className="font-medium text-gray-900">{locationName}</p>
            <p className="text-gray-600 mt-1">{locationAddress}</p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">교육일</h3>
            <p className="text-gray-900">{date}</p>
            <p className="text-gray-600 mt-1">{time}</p>
          </div>

          {parking && (
            <div>
              <h3 className="text-lg font-medium mb-2">주차</h3>
              <p className="text-gray-600">{parking}</p>
            </div>
          )}

          <div className="h-64 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src="placeholder.svg"
              alt="Location map"
              className="w-full h-full object-cover"
            />
          </div>

          <Button 
            className="w-full py-6 text-lg bg-primary-cleaner hover:bg-primary-cleaner"
            onClick={handleApplyTraining}
            disabled={isSubmitting}
          >
            {isSubmitting ? "처리 중..." : "교육 신청"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EducationApplicationSheet;
