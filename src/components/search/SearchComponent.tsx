import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import DateSelector from "./DateSelector";
import TagSelector from "./TagSelector";
import ReservationList from "./ReservationList";
import { format, isWithinInterval, parseISO, startOfDay, endOfDay } from "date-fns";

interface SearchComponentProps {
  userId?: string;
  className?: string;
}


interface Address {
  id: string;
  address: string | null;
  user: string | null;
  name: string | null;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ userId, className }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userAddresses, setUserAddresses] = useState<Address[]>([]);
  const [isNearbySearch, setIsNearbySearch] = useState(true);
  
  useEffect(() => {
    const fetchUserAddresses = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('addresses')
          .select('id, address, user, name')
          .eq('user', user.id);
          
        if (error) throw error;
        setUserAddresses(data || []);
      } catch (error) {
        console.error('Error fetching user addresses:', error);
      }
    };
    
    fetchUserAddresses();
  }, [user?.id]);
  
  const addressesAreSimilar = (address1: string | null, address2: string | null): boolean => {
    if (!address1 || !address2) return false;
    
    const getAddressParts = (addr: string): string[] => {
      return addr.split(' ').filter(part => part.length > 0);
    };
    
    const parts1 = getAddressParts(address1);
    const parts2 = getAddressParts(address2);
    
    for (let i = 0; i < Math.min(3, parts1.length); i++) {
      if (parts2.includes(parts1[i]) && parts1[i].length > 1) {
        return true;
      }
    }
    
    return false;
  };
  
  const calculateProximityScore = (reservationAddress: string | null): number => {
    if (!reservationAddress || userAddresses.length === 0) return 100;
    
    for (const userAddr of userAddresses) {
      if (addressesAreSimilar(userAddr.address, reservationAddress)) {
        return 0;
      }
    }
    
    let bestScore = 100;
    userAddresses.forEach(userAddr => {
      if (!userAddr.address) return;
      
      let score = 100;
      for (let i = 0; i < Math.min(userAddr.address.length, reservationAddress.length); i++) {
        if (userAddr.address[i] === reservationAddress[i]) {
          score -= 2;
        } else {
          break;
        }
      }
      bestScore = Math.min(bestScore, score);
    });
    
    return bestScore;
  };
  
  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('reservations')
        .select(`
          *,
          address_details:addresses(address, id)
        `)
        .is('cleaner_id', null)
        .order('created_at', { ascending: false }); 
      
      if (userId) {
        query = query.eq('user', userId);
      } else if (user?.id) {
        query = query.neq('user', user.id);
      }
      
      if (selectedDay) {
        query = query.or(`date.eq.{${selectedDay}},date.cs.{${selectedDay}}`);
      }
      
      if (selectedTag) {
        if (selectedTag === "정기" || selectedTag === "1회") {
          query = query.eq('reservation_type', selectedTag);
        } else if (selectedTag === "사무실" || selectedTag === "화장실" || selectedTag === "육아업무") {
          query = query.eq('type', selectedTag);
        }
      }
      
      const { data, error } = await query.limit(20);
      
      if (error) {
        console.error('Error fetching reservations:', error);
        throw new Error(error.message);
      }
      
      let processedData = data?.map(item => {
        let formattedAddress = null;
        
        if (item.address_details && typeof item.address_details === 'object' && item.address_details.address) {
          formattedAddress = item.address_details.address;
        } else if (typeof item.address === 'string') {
          formattedAddress = item.address;
        }
        
        return {
          ...item,
          address: formattedAddress,
        };
      }) || [];
      
      if (dateRange && dateRange.from && dateRange.to) {
        const fromDate = startOfDay(dateRange.from);
        const toDate = endOfDay(dateRange.to);
        
        processedData = processedData.filter(reservation => {
          if (!reservation.date) return false;
          
          const dates = Array.isArray(reservation.date) ? reservation.date : [reservation.date];
          
          return dates.some(dateStr => {
            if (!dateStr) return false;
            try {
              const reservationDate = parseISO(dateStr);
              return isWithinInterval(reservationDate, { start: fromDate, end: toDate });
            } catch (error) {
              console.error('Error parsing date:', dateStr, error);
              return false;
            }
          });
        });
      }
      
      const enhancedData = processedData.map(reservation => ({
        ...reservation,
        distance: calculateProximityScore(reservation.address)
      }));
      
      if (userAddresses.length > 0 && isNearbySearch) {
        enhancedData.sort((a, b) => (a.distance || 100) - (b.distance || 100));
        
        if (enhancedData.length > 0 && isNearbySearch) {
          toast({
            title: "내 주소 기준 정렬",
            description: "내 주소와 가까운 업무가 위로 표시됩니다.",
            duration: 3000,
          });
          setIsNearbySearch(false);
        }
      }
      
      return enhancedData;
    } finally {
      setIsLoading(false);
    }
  };
  
  const { data: reservations = [], error, refetch } = useQuery({
    queryKey: ['reservations', selectedDay, selectedTag, dateRange, userId, userAddresses.length],
    queryFn: fetchReservations,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchInterval: 5 * 60 * 1000,
  });
  
  useEffect(() => {
    refetch();
  }, [selectedDay, selectedTag, dateRange, refetch, userAddresses.length]);
  
  const handleDaySelect = (fullDate: string) => {
    const newSelectedDay = selectedDay === fullDate ? null : fullDate;
    setSelectedDay(newSelectedDay);
    
    if (newSelectedDay) {
      setDateRange(null);
    }
  };
  
  const handleTagSelect = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  const handleDateRangeSelect = (range: { from: Date; to: Date } | null) => {
    console.log("Date range selected:", range);
    if (range && range.from && range.to) {
      setDateRange(range);
      setSelectedDay(null);
    } else {
      setDateRange(null);
    }
  };

  return (
    <div className={className}>
      <DateSelector 
        selectedDay={selectedDay} 
        onSelectDay={handleDaySelect}
        dateRange={dateRange}
        onSelectDateRange={handleDateRangeSelect}
      />
      
      <TagSelector 
        selectedTag={selectedTag} 
        onSelectTag={handleTagSelect} 
      />
      
      <ReservationList 
        reservations={reservations} 
        isLoading={isLoading} 
        error={error} 
        refetch={refetch}
        userId={userId}
      />
    </div>
  );
};

export default SearchComponent;
