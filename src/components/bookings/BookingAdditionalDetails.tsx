
import React from "react";
import { Reservation } from "@/types/reservation";
import { Package, Baby, PawPrint, Sparkles, ParkingCircle, ParkingCircleOff } from "lucide-react";

interface BookingAdditionalDetailsProps {
  booking: Reservation;
}

const BookingAdditionalDetails: React.FC<BookingAdditionalDetailsProps> = ({
  booking
}) => {
  return (
    <div className="space-y-4">
      {booking.supply_location && (
        <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-md">
          <Package className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-sm text-muted-foreground">청소용품 위치</h3>
            <p className="text-base">{booking.supply_location}</p>
          </div>
        </div>
      )}
      
      {booking.infant !== null && (
        <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-md">
          <Baby className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-sm text-muted-foreground">영유아 여부</h3>
            <p className="text-base">{booking.infant ? "있음" : "없음"}</p>
          </div>
        </div>
      )}
      
      {booking.pet && (
        <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-md">
          <PawPrint className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-sm text-muted-foreground">반려동물</h3>
            <p className="text-base">
              {booking.pet === 'dog' ? '강아지' : 
               booking.pet === 'cat' ? '고양이' : booking.pet}
            </p>
          </div>
        </div>
      )}
      
      {booking.parking && (
        <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-md">
          {booking.parking === 'available' ? (
            <ParkingCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          ) : (
            <ParkingCircleOff className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          )}
          <div>
            <h3 className="font-medium text-sm text-muted-foreground">주차 가능 여부</h3>
            <p className="text-base">{booking.parking === 'available' ? "가능" : "불가능"}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingAdditionalDetails;
