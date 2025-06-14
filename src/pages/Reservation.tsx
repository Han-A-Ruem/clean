
import { useNavigate } from "react-router-dom";
import { ReservationProvider } from "@/contexts/ReservationContext";

export default function Reservation() {
  const navigate = useNavigate();

  // Redirect to first step in the reservation process
  navigate('/reservation/address');
  
  return (
    <ReservationProvider>
      <div className="min-h-screen flex items-center justify-center user-theme">
        <p>Redirecting to reservation process...</p>
      </div>
    </ReservationProvider>
  );
}
