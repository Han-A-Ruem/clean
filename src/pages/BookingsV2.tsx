
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";
import { Reservation, parseServiceRequests } from "@/types/reservation";
import { PageHeader } from "@/components/Utils";
import BookingV2List from "@/components/bookings/BookingV2List";
import BookingV2Detail from "@/components/bookings/BookingV2Detail";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

const BookingsV2 = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const { user } = useUser();

  const navigator = useNavigate();
  
  // Query to fetch user reservations
  const { 
    data: reservations, 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['reservations', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('user', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching reservations:', error);
        throw error;
      }
      
      // Process each reservation to convert additional_service_requests
      return data.map(res => {
        // Make sure to parse the JSON string if it's not already an object
        const serviceRequests = parseServiceRequests(res.additional_service_requests);
        
        return {
          ...res,
          additional_service_requests: serviceRequests
        };
      }) as Reservation[];
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: true,
  });
  
  const handleBookingClick = (booking: Reservation) => {
    navigator(`/bookings/${booking.id}`);
  };
  
  const handleBackToList = () => {
    // Refetch reservations when going back to list to see updated data
    refetch();
    setActiveTab("list");
    setSelectedBookingId(null);
  };
  
  return (
    <div className="mx-auto max-w-4xl relative bg-gray-50/80 min-h-screen">
      <div className="backdrop-blur-sm bg-white/60 rounded-b-2xl shadow-sm">
        <BookingV2List 
          reservations={reservations} 
          isLoading={isLoading} 
          onBookingClick={handleBookingClick} 
        />
      </div>
    </div>
  );
};

export default BookingsV2;
