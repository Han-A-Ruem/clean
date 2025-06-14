
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Loader, Check, Clock, X } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { fetchClientsWithLatestReservation } from '@/services/insightService';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface ClientsListProps {
  onSelectClient: (clientId: string) => void;
  selectedClientId?: string;
}

const ClientsList: React.FC<ClientsListProps> = ({ onSelectClient, selectedClientId }) => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'customer' | 'cleaner'>('all');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const clientsData = await fetchClientsWithLatestReservation(searchTerm);
        setClients(clientsData);
        setError(null);
      } catch (error: any) {
        console.error("Error fetching clients:", error);
        setError("고객 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    // Add debounce to avoid too many requests
    const debounceTimer = setTimeout(() => {
      fetchClients();
    }, 300);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [searchTerm]);

  const formatDate = (dateStr: string[] | null) => {
    if (!dateStr || !Array.isArray(dateStr) || dateStr.length === 0) return "날짜 없음";
    try {
      return format(new Date(dateStr[0]), "yyyy.MM.dd");
    } catch (e) {
      return "날짜 형식 오류";
    }
  };

  const getStatusIcon = (status: string | null) => {
    if (!status) return null;
    
    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'pending':
      case 'matching':
      case 'matched':
      case 'payment_complete':
      case 'confirmed':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'cancelled':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getUserInitials = (name: string | null) => {
    if (!name) return "NA";
    return name.charAt(0).toUpperCase();
  };

  const getUserTypeLabel = (type: string | null) => {
    if (type === 'customer') return '사용자';
    if (type === 'cleaner') return '매니저';
    return '사용자';
  };

  const filteredClients = clients.filter(client => {
    if (activeTab === 'all') return true;
    return client.type === activeTab;
  });

  return (
    <div className="h-full flex flex-col bg-white rounded-md shadow-sm overflow-hidden">
      <div className="p-4 border-b">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="이름으로 검색..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Tabs defaultValue="all" onValueChange={(value) => setActiveTab(value as 'all' | 'customer' | 'cleaner')}>
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">전체</TabsTrigger>
            <TabsTrigger value="customer" className="flex-1">사용자</TabsTrigger>
            <TabsTrigger value="cleaner" className="flex-1">매니저</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500 p-4 text-center">
            {error}
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 p-4 text-center">
            {searchTerm ? '검색 결과가 없습니다.' : '데이터가 없습니다.'}
          </div>
        ) : (
          <ul className="divide-y">
            {filteredClients.map((client) => (
              <li 
                key={client.id} 
                className={cn(
                  "p-4 hover:bg-gray-50 cursor-pointer",
                  selectedClientId === client.id && "bg-gray-100"
                )}
                onClick={() => onSelectClient(client.id)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    {client.profile_photo ? (
                      <AvatarImage src={client.profile_photo} alt={client.name || '사용자'} />
                    ) : (
                      <AvatarFallback>
                        {getUserInitials(client.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium truncate">
                        {client.name || '이름 없음'}
                      </h3>
                      <span className="text-xs bg-gray-100 rounded-full px-2 py-1">
                        {getUserTypeLabel(client.type)}
                      </span>
                    </div>
                    
                    <div className="flex mt-1 items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {client.latest_reservation 
                          ? formatDate(client.latest_reservation.date)
                          : "예약 없음"}
                      </span>
                      
                      {client.latest_reservation && (
                        <div className="flex items-center">
                          {getStatusIcon(client.latest_reservation.status)}
                          <span className="text-xs ml-1">
                            {client.latest_reservation.status === 'completed' ? '완료됨' : 
                             client.latest_reservation.status === 'cancelled' ? '취소됨' : '진행중'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ClientsList;
