import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { PageHeader } from "../Utils";
import { useCleanerRegistration } from "@/contexts/CleanerRegistrationContext";
import { useNavigate } from "react-router-dom";
import { n } from "node_modules/framer-motion/dist/types.d-B50aGbjN";

const NameStep = () => {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false); // Assuming loading state might be needed later
    const {     data, setData} = useCleanerRegistration();
    const navigate = useNavigate(); 

    const handleNameSubmit = () => {
        // Basic validation to prevent submission if name is empty
        if (!name.trim()) {
            // Optionally, show an error message or provide feedback
            console.error("Name cannot be empty");
            return;
        }
        // TODO: Implement actual submission logic (e.g., API call, update context)
        console.log("Submitting name:", name);
        
        setData({
            ...data,
            name: name,
        })
        navigate("/onboarding/how-did-you-hear-about-us");

    };

    // Determine if the button should be disabled
    const isButtonDisabled = loading || !name.trim();

    return (
        <div className="space-y-6 ">
            <PageHeader title={""} />
            <div className="space-y-2 px-8 pt-8" >
                <h1 className="text-2xl font-bold">이름을 입력해주세요</h1>
                {/* Added description */}
                <p className="text-sm text-muted-foreground">
                    개인 또는 사업체명(에이전시 운영 시)을 입력하세요.
                </p>
            </div>

            <div className="space-y-4 px-8">
                <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">이름</label>
                    <Input
                        type="text"
                        placeholder="홍길동"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        aria-label="Name input" // Updated for accessibility
                    />
                </div>
                <Button
                    className="w-full bg-primary-cleaner hover:bg-primary-cleaner"
                    onClick={handleNameSubmit}
                    disabled={isButtonDisabled} // Updated disabled condition
                >
                    {loading ? "저장 중..." : "다음"}
                </Button>
            </div>
        </div>
    );
};

export default NameStep;