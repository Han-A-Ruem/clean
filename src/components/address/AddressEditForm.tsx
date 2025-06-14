
import React, { useState } from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import AreaSelectionSheet from "../AreaSelectionSheet";
import { useUser } from "@/contexts/UserContext";
import AddressSearch, { ServiceArea } from "./AddressSearch";

interface Address {
  id: string; // Changed from number to string
  address: string;
  user: string | null;
  created_at: string;
  name: string | null;
  area?: number | null;
}

interface AddressEditFormProps {
  address: Address;
  onBack: () => void;
  onSave: () => void;
}

const AddressEditForm: React.FC<AddressEditFormProps> = ({ address, onBack, onSave }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { userData } = useUser();
  const [name, setName] = useState(address.name || "");
  const [addressValue, setAddressValue] = useState(address.address || "");
  const [area, setArea] = useState<number | undefined>(address.area || undefined);
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAreaSheetOpen, setIsAreaSheetOpen] = useState(false);
  const [sameAsReservation, setSameAsReservation] = useState(true);
  const [detailAddress, setDetailAddress] = useState("");
  const [showAddressSearch, setShowAddressSearch] = useState(false);
  const [selectedNewAddress, setSelectedNewAddress] = useState<ServiceArea | null>(null);

  // Split the address into main parts if possible
  const addressParts = addressValue.split(',');
  const mainAddress = addressParts.length > 1 ? addressParts.slice(0, -1).join(',') : addressValue;
  const existingDetailAddress = addressParts.length > 1 ? addressParts[addressParts.length - 1].trim() : "";

  const updateAddressMutation = useMutation({
    mutationFn: async (updatedAddress: { name: string; address: string; area?: number }) => {
      const { error } = await supabase
        .from('addresses')
        .update({
          name: updatedAddress.name,
          address: updatedAddress.address,
          area: updatedAddress.area
        })
        .eq('id', address.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast({
        title: "주소가 업데이트되었습니다",
        description: "주소 정보가 성공적으로 저장되었습니다.",
      });
      onSave();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "오류가 발생했습니다",
        description: "주소 업데이트에 실패했습니다: " + error.message,
      });
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        variant: "destructive",
        title: "주소 이름을 입력해주세요",
        description: "주소 이름은 필수 입력 항목입니다.",
      });
      return;
    }

    if (!addressValue.trim() && !selectedNewAddress) {
      toast({
        variant: "destructive",
        title: "주소를 입력해주세요",
        description: "주소는 필수 입력 항목입니다.",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Use the new selected address if available, otherwise use the existing address
    let fullAddress = "";
    if (selectedNewAddress) {
      fullAddress = `${selectedNewAddress.mainAddress}${detailAddress ? `, ${detailAddress}` : ''}`;
    } else {
      fullAddress = detailAddress 
        ? `${mainAddress}${detailAddress ? `, ${detailAddress}` : ''}`
        : addressValue;
    }

    updateAddressMutation.mutate({ 
      name, 
      address: fullAddress,
      area 
    });
  };

  const handleAreaSave = (newArea: number) => {
    setArea(newArea);
  };

  const openAreaSheet = () => {
    setIsAreaSheetOpen(true);
  };

  const handleAddressSelect = (address: ServiceArea) => {
    setSelectedNewAddress(address);
    setShowAddressSearch(false);
  };

  // If showing address search
  if (showAddressSearch) {
    return (
      <AddressSearch
        onBack={() => setShowAddressSearch(false)}
        onAddressSelect={handleAddressSelect}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24 relative">
      <div className="p-4 sticky top-0 bg-white border-b mb-3">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>
      <div className="px-4">
        <h1 className="text-2xl font-bold mb-8">집 정보</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-lg font-medium">주소</label>
            <div className="flex flex-row items-start gap-8 pb-4">
            {selectedNewAddress ? (
              <div className="space-y-1">
                <p className="font-medium">{selectedNewAddress.mainAddress}</p>
                <p className="text-gray-500">{selectedNewAddress.detailAddress}</p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="font-medium">{mainAddress}</p>
              </div>
            )}
<Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowAddressSearch(true)}
              className="flex items-center gap-2 text-gray-500"
            >
              <MapPin className="w-4 h-4" />
              {/* 새 주소 검색하기 */}
            </Button>
            </div>
            <div className="mt-2">
              <Input 
                value={detailAddress || existingDetailAddress}
                onChange={(e) => setDetailAddress(e.target.value)}
                placeholder="상세 주소 입력"
                className="bg-gray-50 border-none"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-lg font-medium">집 이름</label>
            <Input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="우리집"
              className="bg-gray-50 border-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-medium">평수(공급면적)</label>
            <div 
              className="bg-gray-50 rounded-full p-4 text-center text-[#00C8B0] w-16 h-16 items-center flex justify-center cursor-pointer"
              onClick={openAreaSheet}
            >
              {area ? `${area}평` : '입력'}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-lg font-medium">연락처</label>
              <button 
                className="text-[#00C8B0] text-sm"
                onClick={() => setSameAsReservation(!sameAsReservation)}
                type="button"
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
        </form>
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t z-10">
        <Button 
          onClick={handleSubmit}
          className="w-full bg-[#00C8B0] hover:bg-[#00C8B0]/90 text-white py-6 text-base"
          disabled={isSubmitting || !name}
        >
          {isSubmitting ? "저장 중..." : "저장하기"}
        </Button>
      </div>

      <AreaSelectionSheet
        isOpen={isAreaSheetOpen}
        onClose={() => setIsAreaSheetOpen(false)}
        onSave={handleAreaSave}
        initialValue={area}
      />
    </div>
  );
};

export default AddressEditForm;
