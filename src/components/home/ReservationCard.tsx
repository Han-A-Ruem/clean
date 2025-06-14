
import React from "react";
import { Button } from "@/components/ui/button";
import { Navigation, User, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Reservation } from "@/types/reservation";
import { ReservationWithDetails } from "@/model/Reservation";

interface ReservationCardProps {
  reservation: ReservationWithDetails;
}

const ReservationCard: React.FC<ReservationCardProps> = ({ reservation }) => {
  const navigate = useNavigate();
  
  // Get user name from the joined user_details or fallback to old user field
  const getUserName = () => {
    if (reservation.user_details && reservation.user_details.name) {
      return reservation.user_details.name;
    }
    
    return typeof reservation.user === 'string' ? reservation.user : '고객명';
  };
  
  // Function to handle address display - ensure we have an address to show
  // getAddress with fallback 
  const getAddress = () => {
    if (reservation.address_details && reservation.address_details.address) {
      return reservation.address_details.address;
    }
    return '주소 미제공';
  }

    // Define an interface for the site details expected by openDirections

    const openDirections = (site : any, e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent selection when clicking the direction button
      console.log('Opening directions for:', site);
      // Use site.address for the destination name and ensure coordinates are valid numbers
      const targetUrl = `https://map.kakao.com/link/to/${encodeURIComponent(site.address)},${site.latitude},${site.longitude}`;
      window.open(targetUrl, '_blank');
    };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
      {/* Time section */}
      <div className="mb-5 text-lg font-medium">
        {reservation.time ? (
          `오전 ${reservation.time?.split(':')[0]}:${reservation.time?.split(':')[1]}~오후 1:00`
        ) : '시간 미정'}
      </div>
      
      {/* Location section */}
      <div className="mb-3">
        <h3 className="font-semibold mb-2 text-gray-800">집 정보</h3>
        <p className="text-gray-600 mb-1">주소</p>
        <p className="text-gray-900">{getAddress()}</p>
      </div>
      
      {/* Customer info section - now using user_details */}
      <div className="flex items-center mb-5 mt-4">
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
          <User className="w-5 h-5 text-gray-500" />
        </div>
        <span className="text-gray-800">{getUserName()} (교육용)</span>
      </div>
      
      {/* Action buttons */}
      <div className="flex gap-3 mt-4">
        <Button 
          variant="outline" 
          className="flex-1 h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
          onClick={(event) => openDirections(reservation.address_details, event)}
        >
          <Navigation className="mr-2 h-5 w-5" />
          길 찾기
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
          onClick={() => navigate(`/reservation/detail/${reservation.id}`)}
        >
          <FileText className="mr-2 h-5 w-5" />
          업무 보기
        </Button>
      </div>
    </div>
  );
};

export default ReservationCard;
