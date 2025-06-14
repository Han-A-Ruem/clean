
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";
import { Reservation, parseServiceRequests } from "@/types/reservation";
import BookingCard from "@/components/bookings/BookingCard";
import BookingDetail from "@/components/bookings/BookingDetail";
import { Skeleton } from "@/components/ui/skeleton";

const Bookings = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [selectedBooking, setSelectedBooking] = useState<Reservation | null>(null);
  const { user } = useUser();
  
  // Direct TanStack Query to fetch user reservations
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
      return data.map(res => ({
        ...res,
        additional_service_requests: parseServiceRequests(res.additional_service_requests)
      })) as Reservation[];
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: true,
  });
  
  const handleBookingClick = (booking: Reservation) => {
    setSelectedBooking(booking);
    setActiveTab("details");
  };
  
  const handleBackToList = () => {
    // Refetch reservations when going back to list to see updated data
    refetch();
    setActiveTab("list");
    setSelectedBooking(null);
  };
  
  return (
    <div className="mx-auto max-w-4xl relative">
      {activeTab === "list" ? (
        <>
          {/* Header with title */}
          <div className="mb-6 text-center">
            <h1 className="text-xl font-semibold">예약내역</h1>
          </div>
    
          {/* Custom Tab Navigation (Sticky) */}
          <div className="mb-6 border-b border-gray-200 sticky top-0 bg-white z-20 px-4">
            <div className="flex space-x-8">
              <button 
                className={`pb-2.5 px-1 font-medium text-lg ${
                  true ? "border-b-2 border-black text-black" : "text-gray-400"
                }`}
              >
                가정집
              </button>
              <button 
                className={`pb-2.5 px-1 font-medium text-lg text-gray-400`}
              >
                이사/입주
              </button>
            </div>
          </div>
    
          {/* Booking List */}
          <div className="space-y-4 px-4 pt-4 pb-20">
            {isLoading ? (
              // Skeleton loader while loading
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </div>
              ))
            ) : reservations && reservations.length > 0 ? (
              // Render bookings when loaded
              reservations.map((booking) => (
                <BookingCard 
                  key={booking.id} 
                  booking={booking} 
                  onClick={() => handleBookingClick(booking)} 
                />
              ))
            ) : (
              // No bookings message
              <div className="text-center py-8">
                <p className="text-gray-500">예약 내역이 없습니다.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <BookingDetail 
          booking={selectedBooking} 
          onBack={handleBackToList} 
        />
      )}
    </div>
  );
};

export default Bookings;
