import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import Logo from "@/components/ui/Logo";

const Cleaner = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignIn) {
        // Sign in existing user
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        // Check if the user is active and is a cleaner
        if (data.user) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('is_active, type, name')
            .eq('user_id', data.user.id)
            .single();
            
          if (userError) throw userError;
          
          if (userData.is_active === false) {
            // Sign out if user is inactive
            await supabase.auth.signOut();
            throw new Error("계정이 비활성화되었습니다. 관리자에게 문의하세요.");
          }

          if (userData.type !== 'cleaner') {
            // Sign out if user is not a cleaner
            await supabase.auth.signOut();
            toast({
              variant: "destructive",
              title: "접근 제한",
              description: "일반 사용자는 고객 로그인 페이지를 이용해주세요.",
            });
            navigate("/sign-in");
            return;
          }

          // Display welcome toast with the cleaner's name or email if name is not available
          const cleanerName = userData.name || email.split('@')[0];
          toast({
            title: "로그인 성공",
            description: `${cleanerName} 환영합니다!`,
          });

          navigate("/");
        }
      } else {
        // Sign up new user with email confirmation
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + "/cleaner",
          }
        });
        
        if (signUpError) throw signUpError;


        console.log("asd" , authData);
        // If sign-up successful, create user record
        if (authData?.user) {
          setEmailSent(true);
          
          // First, get the plum rank
          const { data: plumRank, error: rankError } = await supabase
            .from('ranks')
            .select('id')
            .eq('label', 'Plum')
            .single();

          if (rankError) {
            console.error("Error fetching plum rank:", rankError);
            throw new Error("랭크 정보를 가져오는데 실패했습니다.");
          }

          // Create user record with cleaner type and plum rank
          const { error: userError } = await supabase
            .from('users')
            .insert({
              user_id: authData.user.id,
              email: authData.user.email,
              type: 'cleaner',
              is_active: true,
              status: 'pending',
              rank_id: plumRank.id
            });
            
          if (userError) {
            console.error("Error creating user record:", userError);
            throw userError;
          }

          toast({
            title: "회원가입 이메일이 발송되었습니다",
            description: "이메일을 확인하여 계정을 활성화하세요.",
          });
          return;
        }
      }
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

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          // Note: User data creation (checking if the user exists in your 'users' table
          // and creating a record if not) should happen *after* this redirect,
          // typically in a useEffect hook within your main App component or layout,
          // which checks the user session upon loading or authentication state change.
          // Supabase automatically creates the auth.users entry upon successful OAuth.
          // You need to handle the creation of the corresponding entry in your public.users table.
        },
      });
      
      if (error) throw error;
      
      // The redirect to Google happens automatically if there's no error.
      // The user will be redirected back to `redirectTo` after authentication.
      // Session handling and subsequent user data checks/creation occur after the redirect.
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Google 로그인 오류",
        description: error.message,
      });
      setLoading(false); // Set loading to false only if an error occurs before redirecting
    }
    // Do not set loading to false here if the OAuth flow initiated successfully,
    // as the page will navigate away.
  };

  const handleKakaoSignIn = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: `${window.location.origin}/`,
          scopes: '',

        },
      });
      
      if (error) throw error;
      
      // The redirect will happen automatically
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Kakao 로그인 오류",
        description: error.message,
      });
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="text-center">
            <Mail className="mx-auto h-12 w-12 text-primary-cleaner mb-4" />
            <h2 className="text-2xl font-bold mb-4">이메일 확인이 필요합니다</h2>
            <p className="text-gray-600 mb-4">
              {email}로 확인 이메일을 보냈습니다. 이메일의 링크를 클릭하여 계정을 활성화하세요.
            </p>
            <p className="text-gray-500 text-sm mb-6">
              이메일이 도착하지 않았다면 스팸 폴더를 확인해보세요.
            </p>
            <Button
              onClick={() => {
                setEmailSent(false);
                setIsSignIn(true);
              }}
              className="w-full bg-primary-cleaner hover:bg-primary-cleaner/90"
            >
              로그인 화면으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="w-full max-w-md space-y-8 flex flex-col animate-fade-in">
        <div className="flex flex-col items-center">
          <Logo size="lg" className="mb-6" type="cleaner" />
          <div className="text-center relative">
            <h2 className="text-3xl font-bold text-gray-800">
              {isSignIn ? "청소 매니저 로그인" : "청소 매니저 회원가입"}
            </h2>
            <p className="text-gray-500 mt-2">
              {isSignIn ? "매니저님 환영합니다" : "새로운 매니저 계정을 만들어보세요"}
            </p>
          </div>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-6 bg-white p-8 rounded-xl shadow-sm">
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
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-12 bg-gray-50 border-gray-200"
                required
                minLength={6}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary-cleaner hover:bg-primary-cleaner/90 h-12 text-base font-medium shadow-sm" 
            disabled={loading}
          >
            {loading
              ? "처리 중..."
              : isSignIn
              ? "로그인"
              : "회원가입"}
          </Button>
          <div className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 justify-end">
            <button
              type="button"
              onClick={() => navigate("/sign-in/reset-password?u=cleaner")}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              비밀번호를 잊으셨나요?
            </button>
          </div>
        </form>


        <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">또는</span>
            </div>
          </div>

<div>

          <Button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 h-12 text-base font-medium shadow-sm flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
            </svg>
            Google로 로그인
          </Button>
          <Button
            type="button"
            onClick={handleKakaoSignIn}
            disabled={loading}
            className="w-full bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#191919] h-12 text-base font-medium shadow-sm flex items-center justify-center gap-2 mt-3"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M9 0.73291C4.03064 0.73291 0 3.88256 0 7.74079C0 10.2537 1.55832 12.4563 3.93787 13.7491L2.93287 17.2255C2.84498 17.5151 3.17221 17.7384 3.42166 17.5813L7.55631 14.9605C8.03979 15.0126 8.5348 15.0405 9 15.0405C13.9694 15.0405 18 11.8908 18 7.74079C18 3.88256 13.9694 0.73291 9 0.73291Z" fill="black"/>
            </svg>
            Kakao로 로그인
          </Button>
</div>
        
        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsSignIn(!isSignIn)}
            className="text-sm text-primary-cleaner hover:underline font-medium"
          >
            {isSignIn
              ? "계정이 없으신가요? 회원가입"
              : "이미 계정이 있으신가요? 로그인"}
          </button>
        </div>
        <button
          onClick={() => navigate("/sign-in")}
          className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 justify-center"
        >
          <span>일반 사용자로 로그인</span>
        </button>

      </div>
    </div>
  );
};

export default Cleaner;
