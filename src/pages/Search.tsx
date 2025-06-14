
import { MapPin } from "lucide-react";
import SearchComponent from "@/components/search/SearchComponent";
import LocationFilterSheet from "@/components/search/LocationFilterSheet";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [isLocationFiltering, setIsLocationFiltering] = useState(true);
  const [showLocationFilter, setShowLocationFilter] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("closest");
  const navigate = useNavigate();
  
  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
    // We're not immediately closing the filter sheet anymore
    // so users can set all filter options before viewing recommendations
  };
  
  // if (showLocationFilter) {
  //   return (
  //     <LocationFilterSheet
  //       onBack={() => setShowLocationFilter(false)}
  //       onFilterChange={handleFilterChange}
  //       selectedFilter={selectedFilter}
  //     />
  //   );
  // }
  
  return (
    <div className="pb-16">
      <div className="p-4 flex items-center justify-between border-b">
        <h1 className="text-xl font-bold">추천업무</h1>
        <button 
          className={`flex items-center ${isLocationFiltering ? 'text-primary-user' : 'text-gray-600'}`}
          onClick={() => navigate('/search/by-region')}
        >
          <MapPin className="w-5 h-5 mr-1" />
          지역별
        </button>
      </div>
      
      <SearchComponent />
    </div>
  );
};

export default Search;
