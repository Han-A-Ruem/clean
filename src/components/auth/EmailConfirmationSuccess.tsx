
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const EmailConfirmationSuccess = () => {
  const navigate = useNavigate();

  const handleGoToSignIn = () => {
    navigate("/sign-in");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold mb-4">이메일 확인 완료!</h2>
          <p className="text-gray-600 mb-6">
            이메일 확인이 완료되었습니다. 이제 로그인하여 서비스를 이용하실 수 있습니다.
          </p>
          
          <Button
            onClick={handleGoToSignIn}
            className="w-full"
          >
            로그인 화면으로 이동
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmationSuccess;
