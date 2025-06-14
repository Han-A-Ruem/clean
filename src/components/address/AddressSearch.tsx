
import React, { useState, useEffect } from "react";
import { ArrowLeft, Search, X, AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import DaumPostcode from "react-daum-postcode";

interface AddressSearchProps {
  onBack: () => void;
  onAddressSelect: (address: ServiceArea) => void;
  type?: 'user' | 'cleaner';
}

export interface ServiceArea {
  id: number;
  mainAddress: string;
  detailAddress: string;
  fullAddress: string;
  longitude?: number | null;
  latitude?: number | null;
}

const AddressSearch: React.FC<AddressSearchProps> = ({ onBack, onAddressSelect, type = 'user' }) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<ServiceArea[]>([]);
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('recentAddressSearches');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRecentSearches(parsed);
      } catch (e) {
        console.error("Failed to parse recent searches", e);
      }
    }
  }, []);

  const saveToRecentSearches = (address: ServiceArea) => {
    const updatedRecent = [address, ...recentSearches.filter(a => a.id !== address.id)].slice(0, 5);
    setRecentSearches(updatedRecent);
    localStorage.setItem('recentAddressSearches', JSON.stringify(updatedRecent));
  };

  const handleComplete = (data: any) => {
    // Handle the selected address from Daum Postcode service
    const { address, addressType, bname, buildingName, zonecode } = data;
    
    // Create a formatted address object
    const addressObject: ServiceArea = {
      id: Date.now(), // Use timestamp as a unique ID
      mainAddress: address,
      detailAddress: buildingName ? `${buildingName}${zonecode ? ` (${zonecode})` : ''}` : (zonecode || ''),
      fullAddress: buildingName ? `${address} ${buildingName}` : address,
      // Daum postcode doesn't provide coordinates directly
      longitude: null,
      latitude: null
    };
    
    // Save to recent searches and pass to parent component
    saveToRecentSearches(addressObject);
    onAddressSelect(addressObject);
    
    toast({
      title: "주소 선택 완료",
      description: "선택하신 주소가 저장되었습니다.",
    });
  };

  const handleAddressSelect = (address: ServiceArea) => {
    saveToRecentSearches(address);
    onAddressSelect(address);
  };

  const toggleSearchMode = () => {
    setIsSearchMode(!isSearchMode);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white z-10 p-4">
        <button onClick={onBack} className="p-2">
          <ArrowLeft className="h-6 w-6" />
        </button>
        
        <div className="mt-4">
          <h2 className="text-2xl font-semibold mb-2">
            주소, 도로명, 건물명으로 검색해주세요.
          </h2>
          
          <div className="mt-6">
            <Button 
              onClick={toggleSearchMode}
              className={`w-full py-6 flex items-center justify-center gap-2 ${type === 'cleaner' ? 'bg-primary-cleaner hover:bg-primary-cleaner/90' : 'bg-primary-user hover:bg-primary-user/90'}`}
              variant={isSearchMode ? "outline" : "default"}
            >
              <Search className="h-5 w-5" />
              <span>주소 검색하기</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4">
        {isSearchMode ? (
          <div className="mt-4 border rounded-lg overflow-hidden">
            <DaumPostcode
              onComplete={handleComplete}
              style={{ height: 500 }}
              autoClose={false}
              defaultQuery={searchQuery}
            />
          </div>
        ) : (
          recentSearches.length > 0 && (
            <div className="mt-4">
              <p className="text-gray-500 mb-2">최근 검색</p>
              <div className="space-y-4">
                {recentSearches.map((area) => (
                  <button
                    key={area.id}
                    onClick={() => handleAddressSelect(area)}
                    className="w-full text-left"
                  >
                    <div className="border-b pb-4">
                      <p className="text-[#2b96cc] font-medium">{area.mainAddress}</p>
                      <p className="text-gray-500 mt-1">{area.detailAddress}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )
        )}

        {!isSearchMode && recentSearches.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-40">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-12 w-12 text-gray-300" />
              </div>
              <p className="text-gray-400">최근 검색 내역이 없습니다</p>
              <p className="text-gray-400 mt-2">주소 검색 버튼을 눌러 검색을 시작하세요</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressSearch;
