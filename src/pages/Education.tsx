import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRightToLine, Award, CalendarCheck, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import TermsStep from "@/components/education/TermsStep";
import OTPInput from "@/components/education/OTPInput";
import { supabase } from "@/integrations/supabase/client";
import EducationRegionSelect from "@/components/education/EducationRegionSelect";
import { EducationLocations } from "@/components/education/EducationLocations";
import EducationScheduleStep from "@/components/education/EducationScheduleStep";

type EducationStep = "phone" | "otp" | "info" | "terms" | "schedule" | "region" | "location";

const Education = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<EducationStep>("phone");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [referralSource, setReferralSource] = useState<{source: string, customSource?: string} | null>(null);
  
  // In a real app, this would be generated on the server side
  const mockOtp = "123456";

  // Get referral source from localStorage
  useEffect(() => {
    const sourceData = localStorage.getItem("referral_source");
    if (sourceData) {
      try {
        setReferralSource(JSON.parse(sourceData));
      } catch (e) {
        console.error("Failed to parse referral source:", e);
      }
    }
  }, []);

  const handlePhoneSubmit = async () => {
    if (!phone || phone.length < 10) {
      toast({
        variant: "destructive",
        title: "전화번호를 확인해주세요",
        description: "올바른 전화번호를 입력해주세요",
      });
      return;
    }
    
    // Check if this is the special mock account
    if (phone === "11111111111") {
      setLoading(true);
      try {
        // Use the mock cleaner credentials
        const { error } = await supabase.auth.signInWithPassword({
          email: "cleaner@clean.com",
          password: "test123",
        });

        if (error) throw error;
        
        // Update user type to cleaner if logged in successfully
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Check if user exists in the users table
          const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('user_id', user.id)
            .single();
            
          // If user doesn't exist in users table, create entry
          if (!existingUser) {
            await supabase
              .from('users')
              .upsert([{
                id: user.id,
                email: user.email,
                type: 'cleaner',
                name: '청소 매니저',
                status: 'active'
              }]);
          } else if (existingUser.type !== 'cleaner') {
            // Update user type to cleaner if it's not already
            await supabase
              .from('users')
              .update({ type: 'cleaner' })
              .eq('user_id', user.id);
          }
        }

        toast({
          title: "로그인 성공",
          description: "청소 매니저로 로그인되었습니다.",
        });
        
        setStep("otp");
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "로그인 실패",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
      return;
    }
    
    // Simulate sending OTP via SMS
    toast({
      title: "인증번호가 발송되었습니다",
      description: "입력하신 번호로 인증번호가 발송되었습니다.",
    });
    
    // Start countdown timer for OTP expiration
    setCountdown(180); // 3 minutes
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setStep("otp");
  };
  
  const handleVerifyOtp = async (enteredOtp: string) => {
    setIsVerifying(true);
    
    try {
      // Simulate API verification delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (enteredOtp === mockOtp) {
        toast({
          title: "인증이 완료되었습니다",
          description: "휴대폰 번호가 인증되었습니다.",
        });
        setStep("info");
      } else {
        toast({
          variant: "destructive",
          title: "인증번호가 일치하지 않습니다",
          description: "올바른 인증번호를 입력해주세요.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "오류가 발생했습니다",
        description: "다시 시도해주세요.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleInfoSubmit = () => {
    if (!name || !registrationNumber) {
      toast({
        variant: "destructive",
        title: "정보를 확인해주세요",
        description: "모든 필드를 입력해주세요",
      });
      return;
    }
    setStep("terms");
  };

  const handleTermsSubmit = async () => {
    if (!agreed) {
      toast({
        variant: "destructive",
        title: "약관 동의가 필요합니다",
        description: "서비스 이용을 위해 약관에 동의해주세요",
      });
      return;
    }
    
    try {
      // Save initial user data to localStorage to be used later in the flow
      // This will be used by the EducationApplicationSheet component
      const userData = {
        name,
        phone_number: phone.replace(/-/g, ''),
        resident_id: registrationNumber,
        status: 'pending',
        referral_source: referralSource?.source,
        referral_custom_source: referralSource?.customSource
      };
      
      localStorage.setItem('education_user_data', JSON.stringify(userData));
      
      // setStep("schedule");
      navigate('/recruitment/how-did-you-hear')
    } catch (error: any) {
      console.error("Error storing user data:", error);
      toast({
        variant: "destructive",
        title: "오류가 발생했습니다",
        description: "다시 시도해주세요.",
      });
    }
  };
  
  const formatCountdown = () => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleBack = () => {
    if (step === "otp") {
      setStep("phone");
    } else if (step === "info") {
      setStep("otp");
    } else if (step === "terms") {
      setStep("info");
    } else if (step === "schedule") {
      setStep("terms");
    } else if (step === "region") {
      setStep("schedule");
    } else if (step === "location") {
      setStep("region");
    }
    else {
      navigate(-1);
    }
  };
  
  const [loading, setLoading] = useState(false);

  // // Render education schedule step
  // if (step === "schedule") {
  //   return (
  //     <EducationScheduleStep onContinue={} handleBack={}/>
  //   );
  // }

  // Render region selection step
  if (step === "region") {
    return (
      <EducationRegionSelect 
        onBack={handleBack}
        onSelectRegion={(region) => {
          setSelectedRegion(region);
          setStep("location");
        }}
      />
    );
  }

  // Render location selection step
  if (step === "location") {
    return (
      <EducationLocations 
        region={selectedRegion}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container px-4 pt-4">
        <button 
          onClick={handleBack}
          className="flex items-center text-muted-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          뒤로가기
        </button>

        {step === "phone" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">회원가입을 위해</h1>
              <h1 className="text-2xl font-bold">정보를 입력해 주세요.</h1>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">휴대전화 번호</label>
                <Input
                  type="tel"
                  placeholder="010-1234-5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">인증 시 입력한 전화번호는 업무 용도 외에 절대 사용되지 않습니다.</p>
                <p className="text-xs text-gray-500">테스트 로그인: 11111111111 입력</p>
              </div>
              <Button className="w-full bg-primary-cleaner hover:bg-primary-cleaner" onClick={handlePhoneSubmit} disabled={loading}>
                {loading ? "로그인 중..." : "인증번호 받기"}
              </Button>
            </div>
          </div>
        )}
        
        {step === "otp" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">인증번호를</h1>
              <h1 className="text-2xl font-bold">입력해 주세요.</h1>
              <p className="text-muted-foreground">{phone}로 발송된 인증번호 6자리를 입력하세요.</p>
            </div>

            <div className="space-y-4">
              <OTPInput
                length={6}
                onComplete={handleVerifyOtp}
                isVerifying={isVerifying}
              />
              
              {countdown > 0 && (
                <p className="text-center text-muted-foreground">
                  남은 시간: {formatCountdown()}
                </p>
              )}
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setStep("phone")}
                  disabled={isVerifying}
                >
                  번호 변경
                </Button>
                <Button 
                  className="flex-1 bg-primary-cleaner hover:bg-primary-cleaner"
                  onClick={handlePhoneSubmit}
                  disabled={isVerifying || countdown > 0}
                >
                  {countdown > 0 ? `재발송 (${formatCountdown()})` : "재발송"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === "info" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">내 정보 입력</h1>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">이름</label>
                <Input
                  placeholder="한글명"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">주민등록번호</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="941020"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                  />
                  <Input
                    className="w-16"
                    placeholder="2"
                    maxLength={1}
                    disabled
                  />
                  <div className="flex items-center">
                    <span className="text-2xl">* * * * * *</span>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-primary-cleaner hover:bg-primary-cleaner" onClick={handleInfoSubmit}>
                다음
              </Button>
            </div>
          </div>
        )}

        {step === "terms" && (
          <TermsStep 
            agreed={agreed}
            setAgreed={setAgreed}
            onSubmit={handleTermsSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default Education;
