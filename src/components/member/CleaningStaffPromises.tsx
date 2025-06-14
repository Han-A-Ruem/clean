
import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { promises } from "@/data/promiseData";
import { useNavigate } from "react-router-dom";
import { useRegistration } from "@/contexts/RegistrationContext";
import { useToast } from "@/components/ui/use-toast";

interface CleaningStaffPromisesProps {
  onClose: () => void;
}

const CleaningStaffPromises = ({ onClose }: CleaningStaffPromisesProps) => {
  const navigate = useNavigate(); 
  const { toast } = useToast();
  const { agreeToPromises, saveRegistrationData } = useRegistration();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleNext = () => {
    if (currentIndex < promises.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowDialog(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleConfirm = async () => {
    if (isAgreed) {
      setShowDialog(false);
      
      // Update the state in the registration context
      agreeToPromises(true);
      
      // Show loading state
      setSaving(true);
      
      try {
        // Save all the registration data
        await saveRegistrationData();
        
        // Show confirmation screen
        setShowConfirmation(true);
        setCurrentIndex(currentIndex + 1);
      } catch (error) {
        console.error("Error saving data:", error);
        toast({
          variant: "destructive",
          title: "오류가 발생했습니다",
          description: "사용자 정보를 저장하는 중 오류가 발생했습니다.",
        });
      } finally {
        setSaving(false);
      }
    }
  };

  const progressPercentage = ((currentIndex + 1) / (promises.length + 1)) * 100;

  return (
    <div className="fixed inset-0 bg-white z-50 cleaner-theme">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <button onClick={onClose}>
              <X className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-medium">
              청소연구소 매니저가 지켜야할 약속
            </h1>
            <div className="w-6" /> {/* Spacer for alignment */}
          </div>
          <p className="text-center text-sm text-gray-500 mt-2">
            아래 내용에 동의하셔야 입무가 가능합니다.
          </p>
        </div>
        {/* progress bar */}
        <div className="w-full h-1 bg-gray-200">
          <div
            className="h-full bg-primary-cleaner"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="flex-1 p-6 bg-gray-100">
          {showConfirmation ? (
            <div className="bg-white z-50 flex flex-col items-center justify-center px-4 py-10 rounded-sm">
              <div className="w-full max-w-md text-center space-y-8">
                <img
                  src="placeholder.svg"
                  alt="Agreement Complete"
                  className="w-32 h-32 mx-auto mb-6"
                />
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">매니저의 약속에<br />동의 하셨습니다.</h2>
                  <p className="text-gray-500">{new Date().toISOString().split('T')[0].replace(/-/g, '.')}</p>
                </div>
                <Button
                  onClick={() => navigate("/interview-schedule")}
                  className="w-full bg-primary-cleaner hover:bg-primary-cleaner/90 text-white"
                >
                  확인
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary-cleaner text-white flex items-center justify-center text-sm">
                  {currentIndex + 1}
                </div>
                <h2 className="text-lg font-bold">{promises[currentIndex].title}</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {promises[currentIndex].description}
              </p>
              <div className="pt-4 flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1 border-gray-400"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                >
                  이전
                </Button>
                <Button
                  className="flex-1 bg-primary-cleaner hover:bg-primary-cleaner/90"
                  onClick={handleNext}
                >
                  {currentIndex === promises.length - 1 ? "완료" : "다음"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4 px-6 pt-6">매니저의 약속 동의</h2>
            <div className="flex gap-4">
              <div className="pt-6">
                <p className="text-center mb-8 px-6 ">
                  위반 시 이용약관 등에따라 매니저<br />
                  활동의 제한과 필요시 인·형사상<br />
                  책임을 질 수 있음을 확인합니다.
                </p>

                <div className="flex items-center mb-4 mx-6">
                  <input
                    type="checkbox"
                    id="agree"
                    checked={isAgreed}
                    onChange={(e) => setIsAgreed(e.target.checked)}
                    className="mr-2 rounded-full h-5 w-5"
                  />
                  <label htmlFor="agree">네, 동의합니다.</label>
                </div>
                <div className="flex border-t h-12">
                  <button
                    className="flex-1 text-gray-500 border-r"
                    onClick={() => setShowDialog(false)}
                    disabled={saving}
                  >
                    취소
                  </button>
                  <button
                    className="flex-1 text-primary-cleaner"
                    onClick={handleConfirm}
                    disabled={!isAgreed || saving}
                  >
                    {saving ? "저장 중..." : "확인"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CleaningStaffPromises;
