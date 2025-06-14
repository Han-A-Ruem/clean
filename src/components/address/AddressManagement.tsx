
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import AddressSearch from "./AddressSearch";
import AddressEditForm from "./AddressEditForm";
import AddAddressStep from "../AddAdressStep";
import { ServiceArea } from "./AddressSearch";
import { useUser } from "@/contexts/UserContext";

interface Address {
  id: string;
  address: string | null;
  user: string | null;
  created_at: string;
  name: string | null;
  area?: number | null;
}

const AddressManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { userData, fetchUserData } = useUser();
  const [showAddressSearch, setShowAddressSearch] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [selectedAddressDetails, setSelectedAddressDetails] = useState<ServiceArea | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const { data: addresses, isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      if (!userData?.user_id) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user', userData.user_id)
        .order('created_at', { ascending: false });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "오류가 발생했습니다",
          description: "주소를 불러오는데 실패했습니다.",
        });
        throw error;
      }
      
      return data as Address[];
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: async (addressId: string) => {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast({
        title: "주소가 삭제되었습니다",
        description: "주소가 성공적으로 삭제되었습니다.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "오류가 발생했습니다",
        description: "주소 삭제에 실패했습니다: " + error.message,
      });
    },
  });

  const setAsPrimaryAddressMutation = useMutation({
    mutationFn: async (addressId: string) => {
      if (!userData?.user_id) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from('users')
        .update({ address: addressId })
        .eq('user_id', userData.user_id);

      if (error) throw error;
    },
    onSuccess: () => {
      if (userData?.user_id) {
        fetchUserData(userData.user_id);
      }
      
      toast({
        title: "주소가 업데이트되었습니다",
        description: "기본 주소가 성공적으로 변경되었습니다.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "오류가 발생했습니다",
        description: "기본 주소 설정에 실패했습니다: " + error.message,
      });
    },
  });

  const handleSetAsPrimary = (addressId: string) => {
    setAsPrimaryAddressMutation.mutate(addressId);
  };

  const handleDeleteAddress = (addressId: string) => {
    if (window.confirm("정말로 이 주소를 삭제하시겠습니까?")) {
      deleteAddressMutation.mutate(addressId);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddressSelect = (address: ServiceArea) => {
    setSelectedAddressDetails(address);
    setShowAddForm(true);
    setShowAddressSearch(false);
  };

  const handleAddressAdded = () => {
    queryClient.invalidateQueries({ queryKey: ['addresses'] });
  };

  if (showAddressSearch) {
    return (
      <AddressSearch
        onBack={() => setShowAddressSearch(false)}
        onAddressSelect={handleAddressSelect}
      />
    );
  }

  if (showAddForm && selectedAddressDetails) {
    return (
      <AddAddressStep
        selectedAddress={selectedAddressDetails}
        onBack={() => {
          setShowAddForm(false);
          setSelectedAddressDetails(null);
        }}
        onAddressAdded={handleAddressAdded}
      />
    );
  }

  if (editingAddress) {
    return (
      <AddressEditForm
        address={editingAddress}
        onBack={() => setEditingAddress(null)}
        onSave={() => {
          setEditingAddress(null);
          queryClient.invalidateQueries({ queryKey: ['addresses'] });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white relative pb-24">
      <div className="p-4 border-b sticky top-0 bg-white z-10">
        <button onClick={handleBack} className="flex items-center gap-2">
          <ArrowLeft className="h-6 w-6" />
          <span className="text-lg font-medium">주소 관리</span>
        </button>
      </div>

      <div className="px-4 py-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-xl font-bold mb-1">내 주소</h1>
            <p className="text-gray-500 text-sm">예약에 사용할 주소를 관리하세요</p>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {addresses && addresses.length > 0 ? (
                addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`w-full p-4 border rounded-lg space-y-2 ${
                      userData?.address_id === address.id ? 'border-primary-user bg-primary-user/5' : ''
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="font-medium">{address.name || "주소 " + address.id}</span>
                        {userData?.address_id === address.id && (
                          <span className="ml-2 px-2 py-1 bg-primary-user/20 text-primary-user text-xs rounded-full">
                            기본 주소
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setEditingAddress(address)}
                          className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-full"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteAddress(address.id)}
                          className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-full"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600">{address.address}</p>
                    
                    {userData?.address_id !== address.id && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetAsPrimary(address.id)}
                        className="mt-2"
                      >
                        기본 주소로 설정
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>저장된 주소가 없습니다</p>
                  <p className="text-sm mt-1">새로운 주소를 추가해보세요</p>
                </div>
              )}
              
              <button
                onClick={() => setShowAddressSearch(true)}
                className="w-full p-4 border border-dashed rounded-lg hover:border-primary text-left space-y-1 group transition-colors flex items-center justify-center gap-2 text-gray-500 hover:text-primary"
              >
                <Plus className="w-5 h-5" />
                <span>새로운 주소 추가하기</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressManagement;
