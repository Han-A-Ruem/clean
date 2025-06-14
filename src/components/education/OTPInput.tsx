
import React, { useEffect } from 'react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  isVerifying?: boolean;
}

const OTPInput = ({ length = 6, onComplete, isVerifying = false }: OTPInputProps) => {
  const [otp, setOtp] = React.useState<string>("");

  useEffect(() => {
    if (otp.length === length) {
      onComplete(otp);
    }
  }, [otp, length, onComplete]);

  return (
    <div className="space-y-4">
      <InputOTP
        maxLength={length}
        value={otp}
        onChange={setOtp}
        disabled={isVerifying}
        className="justify-center"
      >
        {Array.from({ length }).map((_, i) => (
          <InputOTPGroup key={i}>
            <InputOTPSlot index={i} className="rounded-md border text-lg font-semibold" />
          </InputOTPGroup>
        ))}
      </InputOTP>
      <p className="text-center text-muted-foreground text-sm">
        {isVerifying ? "인증 중..." : "인증번호를 입력하세요"}
      </p>
    </div>
  );
};

export default OTPInput;
