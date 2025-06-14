import { ArrowLeft, Mail } from "lucide-react";
import Logo from "../ui/Logo";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PromotionConfig } from "../promotions";


export function ResetPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const u = searchParams.get("u");
    const isCleaner = u === "cleaner";
    const [resetEmailSent, setResetEmailSent] = useState(false);

   const handleForgotPassword = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      
      try {
        if (!email) {
          throw new Error("이메일을 입력해주세요.");
        }
        
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/sign-in/change-password${isCleaner ? '?u=cleaner' : ''}`,
        });
        
        if (error) throw error;
        
        setResetEmailSent(true);
        toast({
          title: "비밀번호 재설정 이메일 발송됨",
          description: "이메일을 확인하여 비밀번호를 재설정하세요.",
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "비밀번호 재설정 오류",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };
  

    if (resetEmailSent) {
        return (
          <PromotionConfig>
          <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md space-y-8 text-center">
              <div className="text-center">
                <Mail className={`mx-auto h-12 w-12 ${isCleaner ? "text-primary-cleaner" : "text-gray-400"} mb-4`} />
                <h2 className="text-2xl font-bold mb-4">비밀번호 재설정 이메일 전송됨</h2>
                <p className="text-gray-600 mb-4">
                  {email}로 비밀번호 재설정 링크를 보냈습니다. 이메일의 링크를 클릭하여 비밀번호를 재설정하세요.
                </p>
                <p className="text-gray-500 text-sm mb-6">
                  이메일이 도착하지 않았다면 스팸 폴더를 확인해보세요.
                </p>
                <Button
                  onClick={() => {
                    setResetEmailSent(false);
                  }}
                  className={`w-full ${isCleaner ? "bg-primary-cleaner hover:bg-primary-cleaner/90" : "bg-primary-user bg-primary-user/90"}`}
                >
                  로그인 화면으로 돌아가기
                </Button>
              </div>
            </div>
          </div>
          </PromotionConfig>
        );
      }
    

    
    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-white to-gray-50">
          <div className="w-full max-w-md space-y-8 animate-fade-in">
            <div className="flex flex-col items-center">
              <Logo size="lg" className="mb-6" type={isCleaner ? 'cleaner' : 'user'} />
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800">비밀번호 재설정</h2>
                <p className="text-gray-500 mt-2">
                  가입한 이메일 주소를 입력하세요
                </p>
              </div>
            </div>
  
            <form onSubmit={handleForgotPassword} className="space-y-6 bg-white p-8 rounded-xl shadow-sm">
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-gray-50 border-gray-200"
                    required
                  />
                </div>
              </div>
  
              <Button 
                type="submit" 
                className={`w-full ${isCleaner ? "bg-primary-cleaner hover:bg-primary-cleaner/90" : "bg-primary-user bg-primary-user/90"} h-12 text-base font-medium shadow-sm`} 
                disabled={loading}
              >
                {loading ? "처리 중..." : "비밀번호 재설정 링크 전송"}
              </Button>
            </form>
            
            <button
              onClick={() => navigate(isCleaner ? "/sign-in?u=cleaner" : "/sign-in")}
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 justify-center mt-4 text-center w-full"
            >
             로그인 화면으로 돌아가기
            </button>
          </div>
        </div>
      );
}