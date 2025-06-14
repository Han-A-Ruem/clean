
import React, { useState, useEffect } from 'react';
import { ReservationData, ServiceRequest, parseServiceRequests, isServiceRequestArray } from "@/types/reservation";
import { WashingMachine, Frame, Home, Shirt, Building, PawPrint, Plus, Check, Clock, X } from "lucide-react";
import { services } from "@/components/home/AdditionalServices";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";
import { useNotification } from "@/hooks/useNotification";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface AdditionalServicesInfoProps {
  reservation: ReservationData | null;
}

const AdditionalServicesInfo = ({ reservation }: AdditionalServicesInfoProps) => {
  const { toast } = useToast();
  const { user } = useUser();
  const { createNotification } = useNotification();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localReservation, setLocalReservation] = useState<ReservationData | null>(null);

  // Update local state when reservation prop changes
  useEffect(() => {
    if (reservation) {
      setLocalReservation(reservation);
    }
  }, [reservation]);

  // Parse service requests if needed
  const serviceRequests = localReservation?.additional_service_requests
    ? isServiceRequestArray(localReservation.additional_service_requests)
      ? localReservation.additional_service_requests
      : parseServiceRequests(localReservation.additional_service_requests)
    : [];

  const availableServices = services.filter(service => 
    !localReservation?.additional_service?.includes(service.id) &&
    !serviceRequests.some(req => 
      req.services.includes(service.id) && req.status === 'pending'
    )
  );

  const requestedServices = serviceRequests.filter(
    req => req.status === 'pending'
  );

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const handleRequestServices = async () => {
    if (!localReservation?.id || !localReservation?.user || selectedServices.length === 0) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Fetch current additional_service_requests
      const { data, error: fetchError } = await supabase
        .from('reservations')
        .select('additional_service_requests')
        .eq('id', localReservation.id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // Parse the current requests, ensuring it's an array
      const currentRequests = data?.additional_service_requests 
        ? parseServiceRequests(data.additional_service_requests)
        : [];

      // Format the new service request
      const serviceRequest: ServiceRequest = {
        requested_at: new Date().toISOString(),
        requested_by: user?.id || '',
        services: selectedServices,
        status: 'pending',
      };

      // Append the new request
      const updatedRequests = [...currentRequests, serviceRequest];

      // Convert to JSON string for storage
      const updatedRequestsJson = JSON.stringify(updatedRequests);

      // Update reservation with the new service request
      const { error: updateError } = await supabase
        .from('reservations')
        .update({
          additional_service_requests: updatedRequestsJson
        })
        .eq('id', localReservation.id);

      if (updateError) {
        throw updateError;
      }

      // Create notification for the user
      await createNotification({
        userId: localReservation.user,
        title: "추가 서비스 요청",
        message: `청소 담당자가 다음 추가 서비스를 요청했습니다: ${selectedServices.map(id => 
          services.find(s => s.id === id)?.title || id
        ).join(', ')}`,
        type: "system",
        action_url: `/reservation/requested-service/${localReservation.id}`
      });

      // Update local state immediately
      setLocalReservation({
        ...localReservation,
        additional_service_requests: updatedRequests
      });

      toast({
        title: "추가 서비스 요청 전송됨",
        description: "고객에게 추가 서비스 요청이 전송되었습니다.",
      });

      setIsDialogOpen(false);
      setSelectedServices([]);
    } catch (err) {
      console.error('Error requesting additional services:', err);
      toast({
        variant: "destructive",
        title: "오류 발생",
        description: "추가 서비스 요청을 보내는 중 문제가 발생했습니다.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

  // Check if current user is the cleaner (to show request button)
  const isCleaner = user?.id === localReservation?.cleaner_id;

  if (!localReservation) {
    return null;
  }

  return (
    <div className="mb-6 p-6 rounded-sm shadow-sm bg-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">추가 서비스</h3>
        {isCleaner && availableServices.length > 0 && (
          <Button 
            onClick={() => setIsDialogOpen(true)}
            variant="outline" 
            className="flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span>서비스 요청</span>
          </Button>
        )}
      </div>

      {/* Active services */}
      {(!localReservation?.additional_service || localReservation.additional_service.length === 0) ? (
        requestedServices.length === 0 && (
          <p className="text-gray-500 py-2">선택된 추가 서비스가 없습니다.</p>
        )
      ) : (
        <div className="space-y-4 mb-6">
          <h4 className="font-medium text-sm text-gray-600">승인된 서비스</h4>
          {localReservation.additional_service.map((serviceId) => {
            const serviceInfo = getServiceInfo(serviceId);
            return (
              <div key={serviceId} className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-gray-50">
                  {getServiceIcon(serviceId)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-lg">{serviceInfo.title}</h4>
                    <Badge variant="success" className="bg-green-100 text-green-800">승인됨</Badge>
                  </div>
                  <p className="text-gray-500 text-sm">{serviceInfo.subTitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Requested services */}
      {requestedServices.length > 0 && (
        <div className="space-y-4 mt-6 border-t pt-4">
          <h4 className="font-medium text-sm text-gray-600">요청된 서비스</h4>
          {requestedServices.map((request, requestIdx) => (
            <div key={`request-${requestIdx}-${request.requested_at}`} className="border p-3 rounded-md mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">
                  요청 시간: {new Date(request.requested_at).toLocaleString()}
                </span>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 요청됨
                </Badge>
              </div>
              
              {request.services.map((serviceId) => {
                const serviceInfo = getServiceInfo(serviceId);
                return (
                  <div key={`${serviceId}-${request.requested_at}`} className="flex items-center gap-3 mt-3">
                    <div className="p-2 rounded-md bg-gray-50">
                      {getServiceIcon(serviceId)}
                    </div>
                    <div className="flex-1">
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

      {/* Additional Service Request Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>추가 서비스 요청</DialogTitle>
            <DialogDescription>
              고객에게 추가 서비스를 요청합니다. 고객의 승인이 필요합니다.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 max-h-[300px] overflow-y-auto">
            {availableServices.length > 0 ? (
              availableServices.map((service) => (
                <div key={service.id} className="flex items-start space-x-3 mb-4">
                  <Checkbox 
                    id={service.id} 
                    checked={selectedServices.includes(service.id)}
                    onCheckedChange={() => handleServiceToggle(service.id)}
                  />
                  <div className="flex items-center gap-3 w-full">
                    <div className="p-2 rounded-md bg-gray-50">
                      {getServiceIcon(service.id)}
                    </div>
                    <div>
                      <label htmlFor={service.id} className="font-medium text-lg cursor-pointer">
                        {service.title}
                      </label>
                      <p className="text-gray-500 text-sm">{service.subTitle}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">요청 가능한 추가 서비스가 없습니다.</p>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button 
              onClick={handleRequestServices} 
              disabled={selectedServices.length === 0 || isSubmitting}
            >
              {isSubmitting ? "요청 중..." : "요청하기"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdditionalServicesInfo;
