
import React from "react";
import { ServiceRequest } from "@/types/reservation";
import { 
  WashingMachine, 
  Frame, 
  Home, 
  Shirt, 
  Building, 
  PawPrint, 
  Check, 
  Clock, 
  X 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { services } from "@/components/home/AdditionalServices";

interface AdditionalServicesDetailProps {
  additionalServices: string[];
  serviceRequests: ServiceRequest[];
}

const AdditionalServicesDetail: React.FC<AdditionalServicesDetailProps> = ({
  additionalServices,
  serviceRequests
}) => {
  const getServiceIcon = (serviceId: string) => {
    switch (serviceId) {
      case 'laundry':
        return <WashingMachine className="w-10 h-10" strokeWidth={1} />;
      case 'windowFrame':
        return <Frame className="w-10 h-10" strokeWidth={1} />;
      case 'veranda':
        return <Home className="w-10 h-10" strokeWidth={1} />;
      case 'ironing':
        return <Shirt className="w-10 h-10" strokeWidth={1} />;
      case 'duplex':
        return <Building className="w-10 h-10" strokeWidth={1} />;
      case 'petCare':
        return <PawPrint className="w-10 h-10" strokeWidth={1} />;
      default:
        return <Home className="w-10 h-10" strokeWidth={1} />;
    }
  };

  const getServiceInfo = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service || { 
      id: serviceId, 
      title: serviceId, 
      subTitle: "", 
      category: "free" as const 
    };
  };

  // Get the pending service requests
  const pendingRequests = serviceRequests.filter(req => req.status === 'pending');
  const approvedServices = additionalServices || [];

  if (approvedServices.length === 0 && pendingRequests.length === 0) {
    return (
      <div className="text-gray-500 py-2">선택된 추가 서비스가 없습니다.</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Approved Services */}
      {approvedServices.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-gray-600">승인된 서비스</h4>
          {approvedServices.map((serviceId, index) => {
            const serviceInfo = getServiceInfo(serviceId);
            return (
              <div key={`approved-${serviceId}-${index}`} className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-gray-50">
                  {getServiceIcon(serviceId)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-lg">{serviceInfo.title}</h4>
                    <Badge variant="outline" className="bg-green-100 text-green-800 flex items-center gap-1">
                      <Check className="w-3 h-3" /> 승인됨
                    </Badge>
                  </div>
                  <p className="text-gray-500 text-sm">{serviceInfo.subTitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pending Services */}
      {pendingRequests.length > 0 && (
        <div className="space-y-4 mt-4">
          <h4 className="font-medium text-sm text-gray-600">요청된 서비스</h4>
          {pendingRequests.map((request, requestIdx) => (
            <div key={`request-${requestIdx}-${request.requested_at}`} className="border p-3 rounded-md">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">
                  요청 시간: {new Date(request.requested_at).toLocaleString()}
                </span>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 요청됨
                </Badge>
              </div>
              
              {request.services.map((serviceId, serviceIdx) => {
                const serviceInfo = getServiceInfo(serviceId);
                return (
                  <div key={`${serviceId}-${requestIdx}-${serviceIdx}`} className="flex items-center gap-3 mt-3">
                    <div className="p-2 rounded-md bg-gray-50">
                      {getServiceIcon(serviceId)}
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">{serviceInfo.title}</h4>
                      <p className="text-gray-500 text-sm">{serviceInfo.subTitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdditionalServicesDetail;
