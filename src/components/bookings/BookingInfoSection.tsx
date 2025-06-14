
import React from "react";
import { Reservation } from "@/types/reservation";
import { formatDate, formatTime, getServiceType, formatPrice } from "./utils/bookingUtils";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, CreditCard, ShieldCheck } from "lucide-react";

interface BookingInfoSectionProps {
  booking: Reservation;
  onShowCancellationPolicy: () => void;
}

const BookingInfoSection: React.FC<BookingInfoSectionProps> = ({
  booking,
  onShowCancellationPolicy
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">예약 정보</h3>
        <Button 
          variant="outline" 
          size="sm"
          className="text-xs flex items-center gap-1"
          onClick={onShowCancellationPolicy}
        >
          <ShieldCheck className="w-3 h-3" />
          취소 정책
        </Button>
      </div>
      
      <div className="flex flex-col space-y-4">
        <div className="flex items-start gap-3 bg-muted/30 p-3 rounded-md">
          <Calendar className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-muted-foreground text-sm">예약 일시</p>
            <p className="font-medium">{formatDate(booking.date)} {formatTime(booking.time)}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-muted/30 p-3 rounded-md">
          <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-muted-foreground text-sm">주소</p>
            <p className="font-medium">{booking.address || "주소 미입력"}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-muted/30 p-3 rounded-md">
          <CreditCard className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-muted-foreground text-sm">결제 금액</p>
            <p className="font-medium">{formatPrice(booking.amount)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingInfoSection;
