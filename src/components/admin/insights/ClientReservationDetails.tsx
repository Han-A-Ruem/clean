
import React, { useState, useEffect } from 'react';
import { fetchClientReservationDetails } from '@/services/insightService';
import { Loader, User, Calendar, Clock, MapPin, Phone, Mail, Edit, UserPlus, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface ClientReservationDetailsProps {
  clientId: string | null;
}

const ClientReservationDetails: React.FC<ClientReservationDetailsProps> = ({ clientId }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!clientId) {
        setData(null);
        return;
      }
      
      try {
        setLoading(true);
        const details = await fetchClientReservationDetails(clientId);
        setData(details);
        setError(null);
      } catch (error: any) {
        console.error("Error fetching client details:", error);
        setError("고객 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [clientId]);

  if (!clientId) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        왼쪽에서 고객을 선택하세요.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!data || !data.client) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        고객 정보를 찾을 수 없습니다.
      </div>
    );
  }

  const { client, reservation } = data;

  const formatDate = (dateStr: string[] | null) => {
    if (!dateStr || !Array.isArray(dateStr) || dateStr.length === 0) return "날짜 없음";
    try {
      return format(new Date(dateStr[0]), "yyyy년 MM월 dd일");
    } catch (e) {
      return "날짜 형식 오류";
    }
  };

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return "시간 미정";
    return timeStr;
  };

  const getServiceType = (type: string | null) => {
    if (!type) return "서비스 타입 없음";
    
    const serviceTypes: {[key: string]: string} = {
      'regular': '가사 청소',
      'deep': '특수 청소',
      'move': '이사 청소',
      'kitchen': '주방 청소',
      'bathroom': '화장실 청소',
      'fridge': '냉장고 청소'
    };
    
    return serviceTypes[type] || type;
  };

  const getStatusColor = (status: string | null) => {
    if (!status) return "bg-gray-200 text-gray-800";
    
    const statusColors: {[key: string]: string} = {
      'pending': "bg-amber-100 text-amber-800",
      'matching': "bg-blue-100 text-blue-800",
      'matched': "bg-purple-100 text-purple-800",
      'payment_complete': "bg-indigo-100 text-indigo-800",
      'confirmed': "bg-cyan-100 text-cyan-800",
      'completed': "bg-green-100 text-green-800", 
      'cancelled': "bg-red-100 text-red-800",
      'on_the_way': "bg-orange-100 text-orange-800",
      'cleaning': "bg-teal-100 text-teal-800"
    };
    
    return statusColors[status] || "bg-gray-200 text-gray-800";
  };

  const getStatusLabel = (status: string | null) => {
    if (!status) return "상태 없음";
    
    const statusLabels: {[key: string]: string} = {
      'pending': "대기중",
      'matching': "매칭중",
      'matched': "매칭완료",
      'payment_complete': "결제완료",
      'confirmed': "확정됨",
      'completed': "완료됨", 
      'cancelled': "취소됨",
      'on_the_way': "이동중",
      'cleaning': "청소중"
    };
    
    return statusLabels[status] || status;
  };

  const getUserInitials = (name: string | null) => {
    if (!name) return "NA";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="h-full bg-white rounded-md shadow-sm p-6 overflow-y-auto">
      {/* Client Information */}
      <div className="pb-6 border-b">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            {client.profile_photo ? (
              <AvatarImage src={client.profile_photo} alt={client.name || '사용자'} />
            ) : (
              <AvatarFallback className="text-xl">
                {getUserInitials(client.name)}
              </AvatarFallback>
            )}
          </Avatar>
          
          <div>
            <h2 className="text-xl font-semibold">{client.name || '이름 없음'}</h2>
            <div className="flex items-center text-gray-500 mt-1">
              <Badge variant="outline" className="mr-2">
                {client.type === 'customer' ? '사용자' : '매니저'}
              </Badge>
              {client.email && (
                <div className="flex items-center mr-4">
                  <Mail className="h-4 w-4 mr-1" />
                  <span className="text-sm">{client.email}</span>
                </div>
              )}
              {client.phone_number && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  <span className="text-sm">{client.phone_number}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Reservation Information */}
      {reservation ? (
        <div className="py-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-medium">최근 예약 정보</h3>
            <Badge className={getStatusColor(reservation.status)}>
              {getStatusLabel(reservation.status)}
            </Badge>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-500 mr-3" />
              <div>
                <div className="font-medium">예약 날짜</div>
                <div className="text-gray-600">{formatDate(reservation.date)}</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-500 mr-3" />
              <div>
                <div className="font-medium">예약 시간</div>
                <div className="text-gray-600">{formatTime(reservation.time)}</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-500 mr-3" />
              <div>
                <div className="font-medium">서비스 유형</div>
                <div className="text-gray-600">{getServiceType(reservation.type)}</div>
              </div>
            </div>
            
            {reservation.address_details && (
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-500 mr-3" />
                <div>
                  <div className="font-medium">주소</div>
                  <div className="text-gray-600">{reservation.address_details}</div>
                </div>
              </div>
            )}
            
            {/* Assigned Cleaner or Customer */}
            {client.type === 'customer' && reservation.cleaner_details ? (
              <div className="flex items-start mt-6 p-4 bg-gray-50 rounded-lg">
                <Avatar className="h-10 w-10 mr-3">
                  {reservation.cleaner_details.profile_photo ? (
                    <AvatarImage 
                      src={reservation.cleaner_details.profile_photo} 
                      alt={reservation.cleaner_details.name || '매니저'} 
                    />
                  ) : (
                    <AvatarFallback>
                      {getUserInitials(reservation.cleaner_details.name)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <div className="font-medium">담당 매니저</div>
                  <div className="text-gray-600">{reservation.cleaner_details.name || '이름 없음'}</div>
                  {reservation.cleaner_details.phone_number && (
                    <div className="flex items-center text-gray-500 mt-1">
                      <Phone className="h-3 w-3 mr-1" />
                      <span className="text-xs">{reservation.cleaner_details.phone_number}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : client.type === 'cleaner' && reservation.customer_details ? (
              <div className="flex items-start mt-6 p-4 bg-gray-50 rounded-lg">
                <Avatar className="h-10 w-10 mr-3">
                  {reservation.customer_details.profile_photo ? (
                    <AvatarImage 
                      src={reservation.customer_details.profile_photo} 
                      alt={reservation.customer_details.name || '고객'} 
                    />
                  ) : (
                    <AvatarFallback>
                      {getUserInitials(reservation.customer_details.name)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <div className="font-medium">예약 고객</div>
                  <div className="text-gray-600">{reservation.customer_details.name || '이름 없음'}</div>
                  {reservation.customer_details.phone_number && (
                    <div className="flex items-center text-gray-500 mt-1">
                      <Phone className="h-3 w-3 mr-1" />
                      <span className="text-xs">{reservation.customer_details.phone_number}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
          
          {/* Quick Actions */}
          {/* <div className="flex items-center gap-3 mt-8">
            <Button size="sm" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              예약 수정
            </Button>
            
            {!reservation.cleaner_id && client.type === 'customer' && (
              <Button size="sm" variant="secondary" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                매니저 배정
              </Button>
            )}
            
            {reservation.status !== 'cancelled' && reservation.status !== 'completed' && (
              <Button size="sm" variant="destructive" className="flex items-center gap-2">
                <X className="h-4 w-4" />
                예약 취소
              </Button>
            )}
          </div> */}
        </div>
      ) : (
        <div className="py-10 text-center text-gray-500">
          최근 예약 정보가 없습니다.
        </div>
      )}
    </div>
  );
};

export default ClientReservationDetails;
