
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AddAddressStep from './AddAdressStep';
import AddressSearch, { ServiceArea } from './address/AddressSearch';
import { PageHeader } from './Utils';

export interface Address {
  id: string; // Changed from number to string to match database
  address: string;
  user: string | null;
  created_at: string;
  name: string;
  area?: number | null;
}

interface AddressSelectionProps {
  onBack?: () => void;
  onNext: (address: Address) => void;
  type?: 'user' | 'cleaner';
}

const AddressSelection = ({ onBack, onNext,type = 'user' }: AddressSelectionProps) => {
  const { toast } = useToast();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showSearcAddress, setShowSearchAddress] = useState(false);
  const [showAddForm, setShowAddFrom] = useState(false);
  const [detailedAddress, setDetailAddress] = useState<ServiceArea | null>(null); 

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const { data: addresses, isLoading, refetch } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "로그인이 필요합니다.",
        });
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "주소를 불러오는데 실패했습니다.",
        });
        throw error;
      }
      
      return data as Address[];
    },
  });

  const handleNextClick = () => {
    if (selectedAddress) {
      // Update the reservation context with the selected address
      // updateReservationByField('address', selectedAddress.address);
      // updateReservationByField('area_thresh', selectedAddress.area);

      // Then call the parent component's onNext handler
      onNext(selectedAddress);
    } else {
      toast({
        title: "알림",
        description: "주소를 선택해주세요.",
      });
    }
  };

  if (showSearcAddress) {
    return (
      <AddressSearch type={type} onBack={() => {
        setShowSearchAddress(false);
      }} onAddressSelect={
        (address) => {
          setShowSearchAddress(false);
          setShowAddFrom(true);
          setDetailAddress(address);
        }
      }/>
    );
  }

  if(showAddForm && detailedAddress) {
    return (
      <AddAddressStep 
        type={type}
        selectedAddress={detailedAddress} 
        onBack={() => {
          setShowAddFrom(false);
          setDetailAddress(null);
        }}
        onAddressAdded={() => {
          refetch();
        }}
      />
    );
  }

  

  return (
    <div className="min-h-screen bg-white relative pb-24">
      <PageHeader onBack={onBack} title=''/>
      <div className="px-4 pt-4">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">예약 할</h1>
            <h1 className="text-2xl font-bold">주소를 선택해 주세요.</h1>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {addresses?.map((address) => (
                <button
                  key={address.id}
                  onClick={() => setSelectedAddress(selectedAddress?.id === address.id ? null : address)}
                  className={`w-full p-4 border rounded-lg text-left space-y-1 group transition-colors
                    ${selectedAddress?.id === address.id 
                      ? `border-primary-${type} bg-primary-${type}/5` 
                      : `hover:border-primary-${type}`}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{address.name}</span>
                    <div className={`w-6 h-6 rounded-full border-2 transition-colors
                      ${selectedAddress?.id === address.id 
                        ? `border-primary-${type} bg-primary-${type}` 
                        : `border-gray-200 group-hover:border-primary-${type}`}`} 
                    />
                  </div>
                  <p className="text-gray-600">{address.address}</p>
                </button>
              ))}
              
              <button
                onClick={() => setShowSearchAddress(true)}
                className={`w-full p-4 border border-dashed rounded-lg hover:border-primary-${type} text-left space-y-1 group transition-colors flex items-center justify-center gap-2 text-gray-500 hover:text-primary-${type}`}
              >
                <Plus className="w-5 h-5" />
                <span>새로운 주소 추가하기</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t z-10">
        <Button 
          onClick={handleNextClick} 
          className={`w-full py-6 text-base bg-primary-${type} hover:bg-primary-${type}`} 
          size="lg"
        >
          다음
        </Button>
      </div>
    </div>
  );
};

export default AddressSelection;
