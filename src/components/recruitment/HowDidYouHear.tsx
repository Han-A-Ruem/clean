
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/Utils";
import { useCleanerRegistration } from "@/contexts/CleanerRegistrationContext";
import { set } from "date-fns";

interface HowDidYouHearProps {
  onComplete?: (source: string, customSource?: string) => void;
}

const HowDidYouHear: React.FC<HowDidYouHearProps> = ({ onComplete }) => {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [customSource, setCustomSource] = useState<string>("");
  const { error } = useToast();
  const navigate = useNavigate();
  const { data , setData } = useCleanerRegistration();

  const sources = [
    { id: "friends", label: "친구" },
    { id: "advertisement", label: "광고" },
    { id: "sns", label: "SNS" },
    { id: "search_portal", label: "검색 포털" },
    { id: "other", label: "기타" },
  ];

  const handleSubmit = () => {
    if (!selectedSource) {
      error({
        title: "선택해주세요",
        description: "어떻게 알게 되셨는지 선택해주세요",
      });
  };


    if (selectedSource === "other" && !customSource.trim()) {
      error({
        title: "입력해주세요",
        description: "기타 경로를 입력해주세요",
      });
      return;
    }

    // Store the source in localStorage for later use in the registration flow
    const sourceData = {
      source: selectedSource,
      customSource: selectedSource === "other" ? customSource : undefined,
    };
    localStorage.setItem("referral_source", JSON.stringify(sourceData));
    // onComplete(selectedSource, selectedSource === "other" ? customSource : undefined);
    setData({
      ...data,
      referral_source: selectedSource,
    });
    navigate("/onboarding/working-area");
  };

  return (
    <div className="min-h-screen bg-background pb-24 cleaner-theme">
      <div className="">
        <PageHeader title="어떻게 청소연구소를 알게 되셨나요?"  />
        <div className="space-y-6 mt-6 px-4" >
          <div className="space-y-4">
            {sources.map((source) => (
              <div 
                key={source.id}
                className={`p-4 border rounded-lg cursor-pointer ${
                  selectedSource === source.id 
                    ? "border-primary-cleaner bg-primary-cleaner/5" 
                    : "border-gray-200"
                }`}
                onClick={() => setSelectedSource(source.id)}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      selectedSource === source.id 
                        ? "border-primary-cleaner" 
                        : "border-gray-300"
                    }`}
                  >
                    {selectedSource === source.id && (
                      <div className="w-3 h-3 rounded-full bg-primary-cleaner" />
                    )}
                  </div>
                  <span>{source.label}</span>
                </div>
              </div>
            ))}

            {selectedSource === "other" && (
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">기타 경로</label>
                <Input
                  placeholder="어떻게 알게 되셨는지 입력해주세요"
                  value={customSource}
                  onChange={(e) => setCustomSource(e.target.value)}
                />
              </div>
            )}

            <Button 
              className="w-full mt-4 bg-primary-cleaner hover:bg-primary-cleaner/90" 
              onClick={handleSubmit}
            >
              다음
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowDidYouHear;
