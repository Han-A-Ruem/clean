import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useCleanerRegistration } from "@/contexts/CleanerRegistrationContext";
import { useNavigate } from "react-router-dom";


const Phone = () => {
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
  const {data, setData} = useCleanerRegistration();

  const navigate = useNavigate();

    const handlePhoneSubmit = () => {
        // Basic validation to prevent submission if phone is empty
        if (!phone.trim()) {
            // Optionally, show an error message or provide feedback
            console.error("Phone number cannot be empty");
            return;
        }


            setData({
                ...data,
                phone: phone,
            });
            navigate("/onboarding/name");

    };

    // Determine if the button should be disabled
    const isButtonDisabled = loading || !phone.trim();

    return  <div className="space-y-6 px-8 py-8">
    <div className="space-y-2">
    <h1 className="text-2xl font-bold">휴대폰 번호를 입력해주세요</h1>
    </div>

    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">휴대전화 번호</label>
        <Input
          type="tel"
          placeholder="010-1234-5678"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          aria-label="Phone number input" // Added for accessibility
        />
      </div>
      <Button
        className="w-full bg-primary-cleaner hover:bg-primary-cleaner"
        onClick={handlePhoneSubmit}
        disabled={isButtonDisabled} // Updated disabled condition
      >
        {loading ? "로그인 중..." : "인증번호 받기"}
      </Button>
    </div>
  </div>
}

export default Phone;