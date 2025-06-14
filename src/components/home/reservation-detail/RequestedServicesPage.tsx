
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ReservationData, ServiceRequest, parseServiceRequests, isServiceRequestArray } from '@/types/reservation';
import { services } from '@/components/home/AdditionalServices';
import { useToast } from '@/hooks/use-toast';
import { useNotification } from '@/hooks/useNotification';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WashingMachine, Frame, Home, Shirt, Building, PawPrint, Check, X, ArrowLeft } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { PageHeader } from '@/components/Utils';

const RequestedServicesPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();
  const { createNotification } = useNotification();
  const [reservation, setReservation] = useState<ReservationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchReservation = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('reservations')
          .select('*, address:address(id, address, area, name, user)')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        // Convert the address to the correct type
        const address = data.address ? {
          id: data.address.id,
          address: data.address.address,
          area: data.address.area,
          name: data.address.name,
          user: data.address.user,
          // Add the missing fields for Address type
          created_at: new Date().toISOString(), // Use a placeholder
          latitude: null,
          longitude: null
        } : null;

        // Parse service requests
        const serviceRequests = parseServiceRequests(data.additional_service_requests);

        const reservationData: ReservationData = {
          ...data,
          address: address,
          additional_service_requests: serviceRequests
        };

        setReservation(reservationData);
      } catch (error) {
        console.error('Error fetching reservation:', error);
        toast({
          variant: 'destructive',
          title: '예약 정보를 불러올 수 없습니다',
          description: '오류가 발생했습니다. 다시 시도해주세요.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [id, toast]);

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

  // Handle entire request (approve or decline all services in request)
  const handleRequestAction = async (requestIndex: number, action: 'approved' | 'declined') => {
    if (!reservation || !reservation.id || processing) {
      return;
    }

    try {
      setProcessing(true);
      
      // Get the current requests
      let requests: ServiceRequest[] = [];
      
      if (reservation.additional_service_requests) {
        requests = isServiceRequestArray(reservation.additional_service_requests)
          ? [...reservation.additional_service_requests]
          : parseServiceRequests(reservation.additional_service_requests);
      }
      
      if (!requests[requestIndex]) {
        throw new Error('Request not found');
      }

      const currentRequest = requests[requestIndex];
      
      // Update the request status for all services in this request
      requests[requestIndex] = {
        ...currentRequest,
        status: action
      };

      // If approved, add all services to additional_service
      let updatedAdditionalServices = [...(reservation.additional_service || [])];
      if (action === 'approved') {
        // Add all services in this request to additional_service if they don't already exist
        currentRequest.services.forEach(serviceId => {
          if (!updatedAdditionalServices.includes(serviceId)) {
            updatedAdditionalServices.push(serviceId);
          }
        });
      }

      // Convert requests back to JSON for storage
      const requestsJson = JSON.stringify(requests);

      // Update the reservation
      const { error } = await supabase
        .from('reservations')
        .update({
          additional_service_requests: requestsJson,
          additional_service: updatedAdditionalServices
        })
        .eq('id', reservation.id);

      if (error) {
        throw error;
      }

      // Send notification to the cleaner
      if (reservation.cleaner_id) {
        const serviceNames = currentRequest.services.map(
          serviceId => getServiceInfo(serviceId).title
        ).join(', ');
        
        await createNotification({
          userId: reservation.cleaner_id,
          title: action === 'approved' ? '서비스 요청 승인됨' : '서비스 요청 거절됨',
          message: `요청하신 서비스(${serviceNames})가 ${action === 'approved' ? '승인' : '거절'}되었습니다.`,
          type: 'system',
          action_url: `/reservation/detail/${reservation.id}`
        });
      }

      // Update local state
      setReservation({
        ...reservation,
        additional_service_requests: requests,
        additional_service: updatedAdditionalServices
      });

      toast({
        title: action === 'approved' ? '요청 승인됨' : '요청 거절됨',
        description: `서비스 요청이 ${action === 'approved' ? '승인' : '거절'}되었습니다.`,
      });
    } catch (error) {
      console.error('Error processing service action:', error);
      toast({
        variant: 'destructive',
        title: '오류 발생',
        description: '서비스 요청을 처리하는 중 문제가 발생했습니다.',
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">예약 정보를 불러오는 중...</div>;
  }

  // Get pending requests using the parsed data
  const pendingRequests = reservation?.additional_service_requests
    ? isServiceRequestArray(reservation.additional_service_requests)
      ? reservation.additional_service_requests.filter(req => req.status === 'pending')
      : parseServiceRequests(reservation.additional_service_requests).filter(req => req.status === 'pending')
    : [];

  return (
    <div className="pb-20 bg-gray-100 min-h-screen">
      <PageHeader title='추가 서비스 요청' className='mb-3'/>
        <p className="text-gray-500 text-sm">청소 담당자로부터 받은 추가 서비스 요청을 확인하고 승인 또는 거절할 수 있습니다.</p>

      <div className="p-4">
        {pendingRequests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">처리할 서비스 요청이 없습니다.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate(`/more/notifications`)}
            >
              예약 상세 페이지로 돌아가기
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-medium mb-4">처리 대기 중인 요청</h2>
            
            {pendingRequests.map((request, requestIndex) => (
              <div key={request.requested_at} className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">
                    요청 시간: {new Date(request.requested_at).toLocaleString()}
                  </span>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">대기중</Badge>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-medium text-lg mb-4">요청된 서비스 목록</h3>
                  
                  {request.services.map((serviceId) => {
                    const serviceInfo = getServiceInfo(serviceId);
                    
                    return (
                      <div key={serviceId} className="flex items-center gap-3 mb-4">
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
                  
                  <div className="flex gap-2 mt-6">
                    <Button
                      variant="outline"
                      className="flex-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800"
                      onClick={() => handleRequestAction(requestIndex, 'approved')}
                      disabled={processing}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      {processing ? '처리 중...' : '모두 승인'}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800"
                      onClick={() => handleRequestAction(requestIndex, 'declined')}
                      disabled={processing}
                    >
                      <X className="w-4 h-4 mr-1" />
                      {processing ? '처리 중...' : '모두 거절'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestedServicesPage;
