
import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Reservation, ReservationData, ServiceRequest } from '@/types/reservation';
import { useNavigate } from 'react-router-dom';

interface RecommendedWorkListProps {
  onBack: () => void;
  selectedRegions?: string[];
  selectedFilter?: string;
  workTime?: string;
}


const RecommendedWorkList: React.FC<RecommendedWorkListProps> = ({ 
  onBack, 
  selectedRegions = [], 
  selectedFilter = 'any',
  workTime = 'all'
}) => {
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);
      try {
        let query = supabase.from('reservations').select(`* , address:address(id, address, area, name, user, created_at, latitude, longitude)`).or('cleaner_id.is.null'); 
        
        // Filter by region if regions are selected
        if (selectedRegions.length > 0) {
          console.log('sel', selectedRegions)
          // This is a simplified approach - in a real app, you'd use proper geocoding
          // Here we're just checking if any part of the address contains the region name
          const regionFilters = selectedRegions.map(region => 
            `address.address.ilike.%${region}%`
          ).join(',');
          
          if (regionFilters) {
            query = query.or(regionFilters);
          }
        }
        
        // Filter by work time
        if (workTime === 'morning') {
          query = query.lt('time', '12:00:00');
        } else if (workTime === 'afternoon') {
          query = query.gte('time', '12:00:00').lt('time', '18:00:00');
        } else if (workTime === 'evening') {
          query = query.gte('time', '18:00:00');
        }
        
        // Get results
        const { data, error } = await query.limit(10);
        
        if (error) throw error;
        
        let filteredData = (data || []).map((item: any) => ({
          ...item,
          additional_service_requests: item.additional_service_requests as ServiceRequest[]
        }));
        
        // Sort based on filter type
        if (selectedFilter === 'highest-pay') {
          filteredData = filteredData.sort((a, b) => (b.amount || 0) - (a.amount || 0));
        }
        // Note: 'closest' filter would require actual geocoding to implement properly
        
        setReservations(filteredData);
      } catch (error) {
        console.error('Error fetching reservations:', error);
        toast({
          title: "Error",
          description: "Failed to load recommended work",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReservations();
  }, [selectedRegions, selectedFilter, workTime, toast]);

  // Helper function to format time display
  const formatTimeRange = (time: string | null) => {
    if (!time) return '';
    
    // Simple time formatting - in a real app, you'd use proper date manipulation
    const hour = parseInt(time.split(':')[0], 10);
    let displayTime = '';
    
    if (hour < 12) {
      displayTime = `오전 ${hour.toString().padStart(2, '0')}:${time.split(':')[1]}`;
    } else {
      displayTime = `오후 ${(hour === 12 ? 12 : hour - 12).toString().padStart(2, '0')}:${time.split(':')[1]}`;
    }
    
    // Adding an estimated end time (2-3 hours later)
    const endHour = (hour + 2) % 24;
    const endTime = `${endHour.toString().padStart(2, '0')}:${time.split(':')[1]}`;
    const displayEndTime = endHour < 12 ? `오전 ${endTime}` : `오후 ${endHour === 12 ? 12 : endHour - 12}:${time.split(':')[1]}`;
    
    return `${displayTime} ~ ${displayEndTime} (2시간)`;
  };

  const handleItemClick = (reservationId: string) => {
    navigate(`/search/recommended-work/${reservationId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 border-b">
        <button onClick={onBack} className="p-2">
          <ArrowLeft className="h-6 w-6" />
        </button>
        
        <div className="mt-4">
          <h1 className="text-2xl font-medium">Dear Partner,</h1>
          <p className="text-lg mt-2">Here's the next recommended work</p>
          
          {selectedRegions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {selectedRegions.map(region => (
                <span key={region} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {region}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500">Loading recommendations...</p>
          </div>
        ) : reservations.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500">No recommended jobs found for your filters</p>
          </div>
        ) : (
          reservations.map((reservation) => (
            <div 
              key={reservation.id} 
              className="border rounded-lg p-4 cursor-pointer hover:border-blue-300 transition-colors"
              onClick={() => handleItemClick(reservation.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-500">
                  {reservation.reservation_type === '정기' 
                    ? `${reservation.days?.length || 0} times a week (${(reservation.days || []).join(',')})`
                    : '한 번만'}
                </span>
                <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-sm">
                  {reservation.type || 'Household'}
                </span>
              </div>
              
              <div className="text-lg mb-2">{formatTimeRange(reservation.time)}</div>
              
              <div className="rounded-lg p-3 mb-2">
                {reservation.address?.address|| 'User address here (up to Precinct)'}
              </div>
              
              <div className="flex items-center text-gray-600">
                <span className={`${
                  reservation.reservation_type === '정기' ? 'bg-orange-100' : 'bg-blue-100'
                } rounded-full w-5 h-5 flex items-center justify-center mr-2`}>
                  {reservation.reservation_type === '정기' ? '3' : '1'}
                </span>
                {reservation.address?.address.substring(0, 10) || '대방역 7분(5분 출구)'}
              </div>

              {(reservation.amount && reservation.amount > 0) && (
                <div className="mt-3 inline-block px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm">
                  🌟 도번팬부터 + {reservation.amount?.toLocaleString()}원
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecommendedWorkList;
