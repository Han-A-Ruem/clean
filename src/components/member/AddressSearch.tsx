
import { useState } from "react";
import { ArrowLeft, Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import debounce from "lodash/debounce";

interface AddressSearchProps {
  onBack: () => void;
  onAddressSelect: (address: AddressResult) => void;
}

export interface AddressResult {
  id: string;
  main: string;
  detail: string;
  full: string;
}

const AddressSearch = ({ onBack, onAddressSelect }: AddressSearchProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AddressResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

  // Debounced function to fetch addresses
  const debouncedSearch = debounce(async (query: string) => {
    if (query.length < 2) return;
    
    setIsLoading(true);
    setNoResults(false);
    
    try {
      // Using OpenStreetMap Nominatim API (open-source)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&countrycodes=kr`,
        {
          headers: {
            'Accept-Language': 'ko' // Request Korean results
          }
        }
      );
      
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      
      const data = await response.json();
      
      if (data.length === 0) {
        setNoResults(true);
        setSearchResults([]);
      } else {
        const formattedResults: AddressResult[] = data.map((item: any, index: number) => {
          // Extract address components from the result
          const mainAddress = item.address?.road || item.display_name.split(',')[0];
          
          const detailAddress = [
            item.address?.suburb,
            item.address?.city,
            item.address?.state,
            item.address?.postcode,
          ].filter(Boolean).join(' ');
          
          return {
            id: item.place_id || `result-${index}`,
            main: mainAddress,
            detail: detailAddress || '',
            full: item.display_name
          };
        });
        
        setSearchResults(formattedResults);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast({
        variant: "destructive",
        title: "검색 오류",
        description: "주소를 검색하는 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, 500);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.length >= 2) {
      debouncedSearch(query);
    } else {
      setSearchResults([]);
      setNoResults(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setNoResults(false);
  };

  return (
    <div className="min-h-screen bg-white cleaner-theme">
      <div className="p-4 flex items-center">
        <button onClick={onBack} className="p-2">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg ml-2">주소 검색</h1>
      </div>

      <div className="px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-10 py-6"
            placeholder="도로명, 건물명 검색 (예: 경기대로 178)"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center p-10">
          <Loader2 className="h-10 w-10 animate-spin text-primary-cleaner" />
        </div>
      )}

      {noResults && !isLoading && (
        <div className="text-center p-10">
          <p className="text-gray-500">검색 결과가 없습니다.</p>
        </div>
      )}

      {searchResults.length > 0 && !isLoading && (
        <div className="px-4 space-y-4">
          {searchResults.map((address) => (
            <button
              key={address.id}
              onClick={() => onAddressSelect(address)}
              className="w-full text-left"
            >
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <p className="font-medium">{address.main}</p>
                  <p className="text-gray-500 mt-1">{address.detail}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressSearch;
