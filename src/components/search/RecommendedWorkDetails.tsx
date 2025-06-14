
import React, { useEffect, useState } from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { ReservationData, ServiceRequest, parseServiceRequests } from '@/types/reservation';
import { Button } from '@/components/ui/button';
import { formatDateArray } from '@/utils/formatters';
import { translateType, translateReservationType, formatTimeRange } from '@/utils/translators';

const RecommendedWorkDetails: React.FC = () => {
  const [reservation, setReservation] = useState<ReservationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { "*": respath } = useParams<{ "*": string }>();
  const id = respath.split('/')[1];

  useEffect(() => {
    const fetchReservationDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('reservations')
          .select(`* , address:address(id, address, area, name, user, created_at, latitude, longitude)`)
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        // Create a copy of the data for type safety
        const reservationData = { ...data };
        
        // Parse the additional_service_requests from Json to ServiceRequest[]
        if (reservationData && reservationData.additional_service_requests) {
          reservationData.additional_service_requests = parseServiceRequests(reservationData.additional_service_requests);
        }
        
        setReservation(reservationData as unknown as ReservationData);
      } catch (error) {
        console.error('Error fetching reservation details:', error);
        toast({
          title: "오류",
          description: "작업 상세 정보를 불러오는데 실패했습니다",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReservationDetails();
  }, [id, toast]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleDirections = () => {
    if (reservation?.address?.latitude && reservation?.address?.longitude) {
      // Use actual coordinates from reservation data with Naver Maps
      const mapUrl = `https://map.naver.com/v5/directions/-/${reservation.address.longitude},${reservation.address.latitude},${encodeURIComponent(reservation.address.address || '목적지')}/-/walk?c=${reservation.address.longitude},${reservation.address.latitude},15,0,0,0,dh`;
      window.open(mapUrl, '_blank');
    } else {
      // Use dummy coordinates for Seoul if no real coordinates
      const dummyLat = 37.5665;
      const dummyLng = 126.9780;
      const mapUrl = `https://map.naver.com/v5/directions/-/${dummyLng},${dummyLat},서울특별시/-/walk?c=${dummyLng},${dummyLat},15,0,0,0,dh`;
      window.open(mapUrl, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">작업 상세 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-gray-500 mb-4">작업을 찾을 수 없습니다</p>
        <Button onClick={handleBack}>돌아가기</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 border-b">
        <button onClick={handleBack} className="p-2">
          <ArrowLeft className="h-6 w-6" />
        </button>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <div className="inline-block px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm mb-2">
            {translateType(reservation.type)}
          </div>
          <h1 className="text-2xl font-medium">파트너님, 안녕하세요</h1>
          <div className="text-lg mt-2">
            {translateReservationType(reservation.reservation_type)}
          </div>
        </div>

        <div className="text-gray-700 mb-4">
          <div className="mb-1">
            {formatDateArray(reservation.date)}
            {reservation.days && reservation.days.length > 0 && `(${reservation.days.join(', ')})`}
          </div>
          <div>{formatTimeRange(reservation.time)}</div>
        </div>

        {reservation.address && (
          <div className="bg-gray-100 rounded-lg p-3 mb-6">
            <div className="flex items-start mb-2">
              <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-1 flex-shrink-0" />
              <span>{reservation.address.address || '주소 정보 없음'}</span>
            </div>
            
            {/* Map placeholder - in a real app, you would integrate with a map service */}
            <div className="w-full h-40 bg-gray-200 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 opacity-50">
                {/* This is where you'd render a real map with the location */}
              </div>
            </div>
          </div>
        )}

        <button 
          onClick={handleDirections}
          className="w-full hover:bg-primary-cleaner hover:text-white transition-all duration-300 border py-3 rounded-md flex justify-center items-center mb-4"
        >
          <span className="text-lg font-medium">길 안내</span>
        </button>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">추가 정보</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            {reservation.custom_message ? (
              <p>{reservation.custom_message}</p>
            ) : (
              <p className="text-gray-500">추가 정보가 없습니다</p>
            )}
          </div>
        </div>

        {(reservation.amount && reservation.amount > 0) && (
          <div className="mt-4 inline-block px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm">
            🌟 보너스 + {reservation.amount.toLocaleString()}원
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendedWorkDetails;
