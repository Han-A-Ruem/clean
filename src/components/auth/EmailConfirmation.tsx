
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail } from "lucide-react";

const EmailConfirmation = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Extract email from URL parameters if available
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location]);

  // Function to handle resending email confirmation (hidden for now)
  const handleResendConfirmation = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "이메일을 입력해주세요",
        description: "확인 이메일을 재전송하려면 이메일 주소를 입력해주세요.",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) throw error;
      
      toast({
        title: "확인 이메일이 재전송되었습니다",
        description: "이메일을 확인하여 계정을 활성화하세요.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "오류가 발생했습니다",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to handle navigation back to sign-in page
  const handleGoBackToSignIn = () => {
    navigate("/sign-in");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="text-center">
          <Mail className="mx-auto h-12 w-12 text-primary-user mb-4" />
          <h2 className="text-2xl font-bold mb-4">이메일 확인이 필요합니다</h2>
          <p className="text-gray-600 mb-6">
            <strong>{email}</strong>로 확인 이메일을 보냈습니다. 이메일의 링크를 클릭하여 계정을 활성화하세요.
          </p>
          <p className="text-gray-500 text-sm mb-6">
            이메일이 도착하지 않았다면 스팸 폴더를 확인해보세요.
          </p>
          
          <div className="space-y-4">
            {/* Resend button is hidden for now, but code is kept for future use */}
            {/* <Button
              onClick={handleResendConfirmation}
              className="w-full"
              disabled={loading}
            >
              {loading ? "처리 중..." : "확인 이메일 재전송"}
            </Button> */}
            
            <Button
              onClick={handleGoBackToSignIn}
              variant="outline"
              className="w-full"
            >
              로그인 화면으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmation;
