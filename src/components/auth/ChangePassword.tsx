import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Lock, ShieldCheck, ArrowLeft } from "lucide-react";
import Logo from "../ui/Logo";

export function ChangePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const u = searchParams.get("u");
  const isCleaner = u === "cleaner";
  const { toast } = useToast();

  // Check if we have an access token in the URL when the component mounts

  const validatePasswords = () => {
    if (newPassword.length < 6) {
      setPasswordError("비밀번호는 최소 6자 이상이어야 합니다.");
      return false;
    } else if (newPassword !== confirmPassword) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
      return false;
    }
    
    setPasswordError("");
    return true;
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswords()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast({
        title: "비밀번호 변경 완료",
        description: "새로운 비밀번호로 로그인하세요.",
      });
      
      // Sign out the user after password change
      await supabase.auth.signOut();
      
      // Redirect to sign in page 
      setTimeout(() => {
        navigate(isCleaner ? "/sign-in?u=cleaner" : "/sign-in");
      }, 1500);
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "비밀번호 변경 오류",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="w-full max-w-md space-y-8 animate-fade-in flex justify-center flex-col">
        <div className="flex flex-col items-center">
          <Logo size="lg" className="mb-6" type={isCleaner ? "cleaner" : "user"} />
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">비밀번호 변경</h2>
            <p className="text-gray-500 mt-2">
              새로운 비밀번호를 입력하세요
            </p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-6 bg-white p-8 rounded-xl shadow-sm">
          <div className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="password"
                placeholder="새 비밀번호"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pl-10 h-12 bg-gray-50 border-gray-200"
                required
                minLength={6}
              />
            </div>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="password"
                placeholder="새 비밀번호 확인"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 h-12 bg-gray-50 border-gray-200"
                required
                minLength={6}
              />
            </div>
            
            {passwordError && (
              <div className="text-red-500 text-sm">
                {passwordError}
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            className={`w-full ${isCleaner ? "bg-primary-cleaner hover:bg-primary-cleaner/90" : "bg-primary-user hover:bg-primary-user/90"} h-12 text-base font-medium shadow-sm`}
            disabled={loading}
          >
            {loading ? "처리 중..." : "비밀번호 변경"}
          </Button>
        </form>
        
        <button
          onClick={() => navigate(isCleaner ? "/sign-in?u=cleaner" : "/sign-in")}
          className="text-sm text-gray-600 hover:text-gray-900 inline-block"
        >
        로그인 화면으로 돌아가기
        </button>
      </div>
    </div>
  );
}