
import { useUser } from "@/contexts/UserContext";
import CleanerView from "@/components/home/CleanerView";
import { Skeleton } from "@/components/ui/skeleton";
import UserHome from "@/components/home/UserHome";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import CustomView from "@/components/home/CustomView";
import KitchenServiceDetails from "@/components/KitchenServiceDetails";
import RefrigeratorServiceDetails from "@/components/RefrigeratorServiceDetails";
import ToiletServiceDetails from "@/components/ToiletServiceDetails";

const Index = () => {
  const { userData, loading } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [showServiceView, setShowServiceView] = useState(false);
  const [initialService, setInitialService] = useState<string | null>(null);

  // Handle navigation back to address selection

  // Show loading state while determining user type
  if (loading) {
    return (
      <div className="p-4">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-1/2 mb-3" />
        <Skeleton className="h-4 w-5/6 mb-6" />
        
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-4">
              <Skeleton className="h-4 w-32 mb-4" />
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <div className="flex gap-2 mt-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Once user data is loaded, render the appropriate view
  if (userData?.type === 'cleaner') {
    return <CleanerView />;
  }
  // Handle service selections from home screen
  const handleServiceSelect = (serviceType: string) => {
    setInitialService(serviceType);
    setShowServiceView(true);
  };
  
  // Show UserHome for regular users (default view)
  return <UserHome onServiceSelect={handleServiceSelect} />;
};

export default Index;
