
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AreaSelectionSheet from "./AreaSelectionSheet";
import { ServiceArea } from "./address/AddressSearch";

interface AddAddressStepProps {
  onBack: () => void;
  onAddressAdded?: () => void;
  selectedAddress: ServiceArea;
  type?: 'user' | 'cleaner';
}

const AddAddressStep = ({ onBack, onAddressAdded, selectedAddress, type = 'user' }: AddAddressStepProps) => {
  const { toast } = useToast();
  const [detailAddress, setDetailAddress] = useState(""); 
  const [nickname, setNickname] = useState("");//우리집
  const [phone, setPhone] = useState("");//010-2874-1241
  const [area, setArea] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isAreaSheetOpen, setIsAreaSheetOpen] = useState(false);
  const [sameAsReservation, setSameAsReservation] = useState(true);

  const handleSave = async () => {
    if (!nickname || !phone || !area) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "모든 필드를 입력해주세요.",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "로그인이 필요합니다.",
        });
        setIsLoading(false);
        return;
      }
      // Save the address to Supabase with the selectedAddress information
      const { error } = await supabase
        .from('addresses')
        .insert({
          address: `${selectedAddress.fullAddress}${detailAddress ? `, ${detailAddress}` : ''}`,
          name: nickname,
          user: user.id,
          area: area,
          longitude: selectedAddress.longitude,
          latitude: selectedAddress.latitude
        });
      if (error) throw error;
      toast({
        title: "성공",
        description: "주소가 추가되었습니다.",
      });
      // Notify parent component that address was added
      if (onAddressAdded) {
        onAddressAdded();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "주소 추가에 실패했습니다.",
      });
    } finally {
      setIsLoading(false);
      onBack();
    }
  };

  const handleAreaSave = (newArea: number) => {
    setArea(newArea);
  };

  const openAreaSheet = () => {
    setIsAreaSheetOpen(true);
  };

  return (
    <div className={`min-h-screen bg-white pb-24 ${type === 'cleaner' ? 'bg-primary-cleaner' : 'bg-primary-user'}`}>
      <div className="p-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>
      <div className="px-4">
        <h1 className="text-2xl font-bold mb-8">집 정보</h1>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-lg font-medium">주소</label>
            <div className="space-y-1">
              <p className="font-medium">{selectedAddress.mainAddress}</p>
              <p className="text-gray-500">{selectedAddress.detailAddress}</p>
            </div>
            <div className="mt-2">
              <Input 
                value={detailAddress}
                onChange={(e) => setDetailAddress(e.target.value)}
                placeholder="상세 주소 입력"
                className="bg-gray-50 border-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-medium">집 이름</label>
            <Input 
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="우리집"
              className="bg-gray-50 border-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-medium">평수(공급면적)</label>
            <div 
              className={`bg-gray-50 rounded-full p-4 text-center text-primary-${type} w-16 h-16 items-center flex justify-center cursor-pointer`}
              onClick={openAreaSheet}
            >
              {area ? `${area}평` : '입력'}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-lg font-medium">연락처</label>
              <button 
                className={`text-primary-${type} text-sm`}
                onClick={() => setSameAsReservation(!sameAsReservation)}
              >
                {sameAsReservation ? "✓ 예약자와 동일" : "예약자와 동일"}
              </button>
            </div>
            <Input 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-2874-1241"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              className="bg-gray-50 border-none"
            />
            <p className="text-sm text-gray-500">※ 예약 확인 및 매니저님과 통화 용도로 쓰입니다.</p>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t z-10">
        <Button 
          onClick={handleSave}
          className={`w-full bg-primary-${type} hover:bg-primary${type}/90  text-white py-6 text-base"`}
          disabled={isLoading || !nickname || !phone || !area}
        >
          다음
        </Button>
      </div>

      <AreaSelectionSheet
        isOpen={isAreaSheetOpen}
        onClose={() => setIsAreaSheetOpen(false)}
        onSave={handleAreaSave}
        initialValue={area}
        type={type}
      />
    </div>
  );
};

export default AddAddressStep;
