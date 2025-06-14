
import React, { useState, useEffect } from "react";
import { Reservation } from "@/types/reservation";
import { PageHeader } from "@/components/Utils";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CreditCard, 
  Info, 
  User, 
  Phone, 
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { formatDate, formatTime, formatPrice } from "./utils/bookingUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CleanArrowDetails from "./CleanArrowDetails";
import AdditionalServicesDetail from "./AdditionalServicesDetail";
import StatusBadge from "./StatusBadge";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";

interface BookingV2DetailProps {
}

const BookingV2Detail: React.FC<BookingV2DetailProps> = ({
}) => {
  const [booking, setBooking] = useState<Reservation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdditionalServices, setShowAdditionalServices] = useState(true);
  const [showCleaningProcess, setShowCleaningProcess] = useState(true);
  const [showHouseholdDetails, setShowHouseholdDetails] = useState(true);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(true);
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchBooking = async () => {
      if (!id) {
        setError("Booking ID not provided");
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('reservations')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          // Process additional_service_requests if needed
          if (typeof data.additional_service_requests === 'string') {
            try {
              data.additional_service_requests = JSON.parse(data.additional_service_requests);
            } catch (e) {
              console.error("Error parsing additional_service_requests:", e);
              data.additional_service_requests = [];
            }
          }

          setBooking(data as unknown as Reservation);
        } else {
          setError("Booking not found");
        }
      } catch (err) {
        console.error("Error fetching booking:", err);
        setError("Failed to load booking details");
        toast({
          title: "Error",
          description: "Failed to load booking details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [id, toast]);

  if (isLoading) {
    return (
      <div className="pb-6 bg-gray-50">
        <PageHeader title="예약 상세" />
        <div className="p-4 space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }



  return (
    <div className="pb-6 min-h-screen bg-gray-50/80">
      <PageHeader title="예약 상세" className="backdrop-blur-md bg-white/60 border-b border-white/30" />
      
      {isLoading ? (
        <div className="p-4 space-y-4">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-36 w-full rounded-xl" />
          <Skeleton className="h-36 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      ) : (
        <>
          {/* Header Card with Service Type and Status */}
          <div className="backdrop-blur-md bg-white/70 p-5 shadow-sm mb-4 rounded-b-2xl border-b border-white/40">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center shadow-sm">
                  <img 
                    src="/lovable-uploads/b292a0d9-c716-4e55-b135-48eae6a3e237.png" 
                    alt="Mascot" 
                    className="w-8 h-8 object-contain" 
                  />
                </div>
                <div>
                  <h3 className="font-medium text-lg text-gray-800">매주 가사청소</h3>
                  <p className="text-gray-500">
                    {formatDate(booking?.date)} {formatTime(booking?.time)}
                  </p>
                </div>
              </div>
              {booking && <StatusBadge status={booking.status} date={booking.date} />}
            </div>
          </div>
          
          {/* Service Details */}
          <div className="backdrop-blur-md bg-white/60 mx-4 rounded-2xl mb-4 shadow-sm overflow-hidden border border-white/40">
            <div className="p-4 border-b border-gray-100/70">
              <h3 className="text-lg font-medium text-gray-800">서비스 정보</h3>
            </div>
            
            <div className="p-5 space-y-5">
              {/* Date and Time */}
              <div className="flex items-start gap-4">
                <Calendar className="w-5 h-5 text-blue-500 shrink-0 mt-1" />
                <div>
                  <p className="text-gray-500 text-sm">예약 일시</p>
                  <p className="font-medium text-gray-800">{formatDate(booking?.date)} {formatTime(booking?.time)}</p>
                </div>
              </div>
              
              {/* Duration */}
              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-blue-500 shrink-0 mt-1" />
                <div>
                  <p className="text-gray-500 text-sm">서비스 시간</p>
                  <p className="font-medium text-gray-800">{booking?.duration || 4}시간</p>
                </div>
              </div>
              
              {/* Payment Amount */}
              <div className="flex items-start gap-4">
                <CreditCard className="w-5 h-5 text-blue-500 shrink-0 mt-1" />
                <div>
                  <p className="text-gray-500 text-sm">결제 금액</p>
                  <p className="font-medium text-gray-800">{formatPrice(booking?.amount)}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Address Info */}
          <div className="backdrop-blur-md bg-white/60 mx-4 rounded-2xl mb-4 shadow-sm overflow-hidden border border-white/40">
            <div className="p-4 border-b border-gray-100/70">
              <h3 className="text-lg font-medium text-gray-800">주소 정보</h3>
            </div>
            
            <div className="p-5">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-1" />
                <div>
                  <p className="text-gray-500 text-sm">주소</p>
                  <p className="font-medium text-gray-800">{booking?.address || "주소 미입력"}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Cleaner Info */}
          {booking?.cleaner_id && (
            <div className="backdrop-blur-md bg-white/60 mx-4 rounded-2xl mb-4 shadow-sm overflow-hidden border border-white/40">
              <div className="p-4 border-b border-gray-100/70">
                <h3 className="text-lg font-medium text-gray-800">청소가 정보</h3>
              </div>
              
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <User className="w-5 h-5 text-blue-500 shrink-0 mt-1" />
                  <div>
                    <p className="text-gray-500 text-sm">청소가</p>
                    <p className="font-medium text-gray-800">{booking.cleaner_id}</p>
                  </div>
                </div>
                
                {booking.phone_number && (
                  <div className="flex items-start gap-4 mt-5">
                    <Phone className="w-5 h-5 text-blue-500 shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-500 text-sm">연락처</p>
                      <p className="font-medium text-gray-800">{booking.phone_number}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Additional Services */}
          <div className="backdrop-blur-md bg-white/60 mx-4 rounded-2xl mb-4 shadow-sm overflow-hidden border border-white/40">
            <div 
              className="p-4 border-b border-gray-100/70 flex justify-between items-center cursor-pointer"
              onClick={() => setShowAdditionalServices(!showAdditionalServices)}
            >
              <h3 className="text-lg font-medium text-gray-800">추가 서비스</h3>
              {showAdditionalServices ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>
            
            {showAdditionalServices && booking && (
              <div className="p-5">
                <AdditionalServicesDetail 
                  additionalServices={booking.additional_service || []} 
                  serviceRequests={booking.additional_service_requests || []}
                />
              </div>
            )}
          </div>
          
          {/* Cleaning Process */}
          <div className="backdrop-blur-md bg-white/60 mx-4 rounded-2xl mb-4 shadow-sm overflow-hidden border border-white/40">
            <div 
              className="p-4 border-b border-gray-100/70 flex justify-between items-center cursor-pointer"
              onClick={() => setShowCleaningProcess(!showCleaningProcess)}
            >
              <h3 className="text-lg font-medium text-gray-800">청소 과정</h3>
              {showCleaningProcess ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>
            
            {showCleaningProcess && (
              <div className="py-4">
                <CleanArrowDetails showAppBar={false}/>
              </div>
            )}
          </div>
          
          {/* Household Details */}
          <div className="backdrop-blur-md bg-white/60 mx-4 rounded-2xl mb-4 shadow-sm overflow-hidden border border-white/40">
            <div 
              className="p-4 border-b border-gray-100/70 flex justify-between items-center cursor-pointer"
              onClick={() => setShowHouseholdDetails(!showHouseholdDetails)}
            >
              <h3 className="text-lg font-medium text-gray-800">가구 정보</h3>
              {showHouseholdDetails ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>
            
            {showHouseholdDetails && booking && (
              <div className="p-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/50 p-3 rounded-xl">
                    <p className="text-gray-500 text-sm mb-1">반려동물</p>
                    <p className="font-medium text-gray-800">{booking.pet || "없음"}</p>
                  </div>
                  
                  <div className="bg-white/50 p-3 rounded-xl">
                    <p className="text-gray-500 text-sm mb-1">영유아</p>
                    <p className="font-medium text-gray-800">{booking.infant !== null ? (booking.infant ? "있음" : "없음") : "미입력"}</p>
                  </div>
                  
                  <div className="bg-white/50 p-3 rounded-xl">
                    <p className="text-gray-500 text-sm mb-1">주차</p>
                    <p className="font-medium text-gray-800">{booking.parking === 'available' ? "가능" : "불가능"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Additional Information */}
          {booking && (booking.custom_message || booking.supply_location) && (
            <div className="backdrop-blur-md bg-white/60 mx-4 rounded-2xl mb-4 shadow-sm overflow-hidden border border-white/40">
              <div 
                className="p-4 border-b border-gray-100/70 flex justify-between items-center cursor-pointer"
                onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
              >
                <h3 className="text-lg font-medium text-gray-800">추가 정보</h3>
                {showAdditionalInfo ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>
              
              {showAdditionalInfo && (
                <div className="p-5 space-y-4">
                  {booking.supply_location && (
                    <div className="bg-white/50 p-3 rounded-xl">
                      <p className="text-gray-500 text-sm mb-1">청소용품 위치</p>
                      <p className="font-medium text-gray-800">{booking.supply_location}</p>
                    </div>
                  )}
                  
                  {booking.custom_message && (
                    <div className="bg-white/50 p-3 rounded-xl">
                      <p className="text-gray-500 text-sm mb-1">요청사항</p>
                      <p className="font-medium text-gray-800">{booking.custom_message}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookingV2Detail;
