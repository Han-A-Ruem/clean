
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { house } from '@/data/customerFields';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import PasswordInputDialog from "@/components/home/PasswordInputDialog";
import { ReservationFormData } from "@/types/reservation";

interface EntryInfoProps {
  customerInfo: ReservationFormData;
  onCustomerInfoChange: (info: Partial<ReservationFormData>) => void;
  className?: string;
}

const EntryInfo: React.FC<EntryInfoProps> = ({
  customerInfo,
  onCustomerInfoChange,
  className,
}) => {
  const [selectedHomeOption, setSelectedHomeOption] = useState(customerInfo.entry || "home");
  const [showLobbyPasswordDialog, setShowLobbyPasswordDialog] = useState(false);
  const [showUnitPasswordDialog, setShowUnitPasswordDialog] = useState(false);

  useEffect(() => {
    onCustomerInfoChange({
      entry: customerInfo.entry || "home"
    })
  }, [])

  const handleHomeOptionSelect = (value: string) => {
    setSelectedHomeOption(value);
    onCustomerInfoChange({ entry: value });
  };

  const handleLobbyPasswordSave = (password: string) => {
    onCustomerInfoChange({ lobby_pass: password });
  };

  const handleUnitPasswordSave = (password: string) => {
    onCustomerInfoChange({ unit_pass: password });
  };

  return (
    <div className={cn("pt-4", className)}>
      <h2 className="text-xl font-semibold mb-2">출입 정보</h2>
      <RadioGroup
        value={selectedHomeOption}
        onValueChange={handleHomeOptionSelect}
        className="flex flex-col space-y-3"
      >
        {house.map((option) => (
          <div key={option.value} className="w-full">
            <label className="cursor-pointer w-full block">
              <Card className={cn(
                "w-full transition-all hover:bg-gray-50",
                selectedHomeOption === option.value 
                  ? "border-primary-user bg-primary-user/5" 
                  : "border-gray-200"
              )}>
                <div className="flex items-center p-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center mr-3",
                    selectedHomeOption === option.value ? "bg-primary-user text-white" : "bg-gray-100"
                  )}>
                    {React.cloneElement(option.icon, {
                      className: cn(
                        "w-6 h-6",
                        selectedHomeOption === option.value ? "text-white" : "text-gray-600"
                      )
                    })}
                  </div>
                  <span className="flex-grow font-medium">{option.name}</span>
                  <RadioGroupItem value={option.value} className="text-primary-user" />
                </div>
              </Card>
            </label>
          </div>
        ))}
      </RadioGroup>
      
      {/* Password Fields - Only shown when password option is selected */}
      {selectedHomeOption === "password" && (
        <div className="space-y-4 pt-4 mt-3 bg-gray-50 p-4 rounded-lg">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-gray-700">공동현관 비밀번호</label>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-3 rounded-full border"
                onClick={() => setShowLobbyPasswordDialog(true)}
              >
                입력
              </Button>
            </div>
            {customerInfo.lobby_pass && (
              <p className="text-sm text-gray-500">설정됨 (●●●●●●)</p>
            )}
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-gray-700">개별현관 비밀번호</label>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-3 rounded-full border"
                onClick={() => setShowUnitPasswordDialog(true)}
              >
                입력
              </Button>
            </div>
            {customerInfo.unit_pass && (
              <p className="text-sm text-gray-500">설정됨 (●●●●●●)</p>
            )}
          </div>
        </div>
      )}

      {/* Password input dialogs */}
      <PasswordInputDialog
        type="lobby"
        isOpen={showLobbyPasswordDialog}
        onClose={() => setShowLobbyPasswordDialog(false)}
        onSave={handleLobbyPasswordSave}
        initPass={customerInfo.lobby_pass}
      />
      
      <PasswordInputDialog
        type="unit"
        isOpen={showUnitPasswordDialog}
        onClose={() => setShowUnitPasswordDialog(false)}
        onSave={handleUnitPasswordSave}
        initPass={customerInfo.unit_pass}
      />
    </div>
  );
};

export default EntryInfo;
