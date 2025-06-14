
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AreaSelectionSheet from "@/components/AreaSelectionSheet";
import { PageHeader } from '@/components/Utils';
import { Address } from "@/types/reservation";

interface AddressEditProps {
  addressId?: string;
}

const AddressEdit: React.FC<AddressEditProps> = ({ addressId }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [address, setAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form fields
  const [name, setName] = useState("");
  const [addressText, setAddressText] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [area, setArea] = useState<number | undefined>();
  const [isAreaSheetOpen, setIsAreaSheetOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [sameAsReservation, setSameAsReservation] = useState(true);

  useEffect(() => {
    if (addressId) {
      fetchAddressDetails(addressId);
    }
  }, [addressId]);

  const fetchAddressDetails = async (id: string) => {
    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        toast({
          title: "인증이 필요합니다",
          description: "주소를 관리하려면 로그인이 필요합니다.",
          variant: "destructive"
        });
        navigate('/sign-in');
        return;
      }
      
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('id', id)
        .eq('user', user.user.id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setAddress(data as Address);
        setName(data.name || "");
        setAddressText(data.address || "");
        
        // Split address and detail if possible
        const addressParts = data.address?.split(',') || [];
        if (addressParts.length > 1) {
          const mainPart = addressParts.slice(0, -1).join(',');
          const detailPart = addressParts[addressParts.length - 1].trim();
          setAddressText(mainPart);
          setDetailAddress(detailPart);
        }
        
        setArea(typeof data.area === 'string' ? parseInt(data.area) : data.area);
      }
    } catch (error) {
      console.error('Error fetching address details:', error);
      toast({
        title: "주소 정보 불러오기 실패",
        description: "주소 정보를 불러오는 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "집 이름을 입력해주세요.",
      });
      return;
    }

    if (!addressId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "주소 ID가 없습니다.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Combine address and detail
      const fullAddress = detailAddress 
        ? `${addressText}, ${detailAddress}` 
        : addressText;

      const { error } = await supabase
        .from('addresses')
        .update({
          name: name,
          address: fullAddress,
          area: area
        })
        .eq('id', addressId);

      if (error) throw error;
      
      toast({
        title: "성공",
        description: "주소가 업데이트되었습니다.",
      });
      
      navigate('/more/address');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "주소 업데이트에 실패했습니다.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAreaSave = (newArea: number) => {
    setArea(newArea);
  };

  const openAreaSheet = () => {
    setIsAreaSheetOpen(true);
  };

  const handleBack = () => {
    navigate('/more/address');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-4">
        <PageHeader title="주소 수정" onBack={handleBack} />
        <div className="flex justify-center items-center h-64">
          <p>주소 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      <PageHeader title="주소 수정" onBack={handleBack} />
      
      <div className="px-4">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-lg font-medium">주소</label>
            <div className="space-y-1">
              <p className="font-medium">{addressText}</p>
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

export default AddressEdit;
