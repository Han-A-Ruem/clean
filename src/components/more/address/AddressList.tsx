
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Home, ChevronRight, MapPin, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/Utils";
import { Address } from "@/types/reservation";

const AddressList: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
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
        .eq('user', user.user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setAddresses(data as Address[]);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast({
        title: "주소 목록 불러오기 실패",
        description: "주소 목록을 불러오는 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    navigate('/more/address/add');
  };

  const handleEditAddress = (id: string) => {
    navigate(`/more/address/edit/${id}`);
  };

  const handleBack = () => {
    navigate('/more');
  };

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="주소 관리" onBack={handleBack} />
      
      <div className="px-4 pt-4">
        <Button 
          variant="outline" 
          className="w-full py-6 border-dashed border-2 border-gray-300 text-gray-500 flex justify-center items-center gap-2"
          onClick={handleAddAddress}
        >
          <PlusCircle size={20} />
          <span>새 주소 추가하기</span>
        </Button>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>주소 목록을 불러오는 중...</p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <h2 className="text-lg font-medium">저장된 주소</h2>
            
            {addresses.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
                저장된 주소가 없습니다
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <div 
                    key={address.id} 
                    className="bg-gray-50 rounded-lg p-4 relative"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-[#00C8B0] rounded-full p-2 text-white">
                        <Home size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold">{address.name}</h3>
                          <button 
                            onClick={() => handleEditAddress(address.id)}
                            className="text-gray-500 p-1 hover:bg-gray-100 rounded-full"
                          >
                            <Edit size={16} />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{address.address}</p>
                        <div className="flex items-center text-sm text-gray-500 mt-2">
                          <MapPin size={14} className="mr-1" />
                          <span>면적: {address.area}평</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressList;
