
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { getReservationComponent } from "@/routes/reservationRoutes";
import TabBar from "@/components/TabBar";
import { useReservation } from "@/contexts/ReservationContext";
import { useUser } from "@/contexts/UserContext";
import { Toaster } from "@/components/ui/toaster";

const ReservationRouteHandler: React.FC = () => {
  const { id } = useParams<{ id: string; }>();
  const navigate = useNavigate();
  const { reservationData, setReservationData, createReservation } = useReservation();
  const { user } = useUser();

  // If no id is provided, redirect to the address step
  if (!id) {
    return <Navigate to="/reservation/address" replace />;
  }
  
  // Get the component for the current route
  const component = getReservationComponent(id, { 
    navigate, 
    reservationData: reservationData as any, 
    setReservationData, 
    createReservation, 
    user
  });
  
  if (!component) {
    return <Navigate to="/reservation/address" replace />;
  }
  
  // Display TabBar for test-wage-selector
  const showTabBar = id !== 'test-wage-selector';
  
  return (
    <>
      <div className="pb-16">
        {component}
      </div>
      {!showTabBar && <TabBar />}
      <Toaster />
    </>
  );
};

export default ReservationRouteHandler;
