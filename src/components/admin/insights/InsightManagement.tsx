
import React, { useState } from 'react';
import ClientsList from './ClientsList';
import ClientReservationDetails from './ClientReservationDetails';

const InsightManagement = () => {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">인사이트</h2>
        <p className="text-gray-500">고객 및 매니저의 최근 예약 정보를 확인하세요</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-220px)]">
        <div className="md:col-span-1 h-full  border">
          <ClientsList 
            onSelectClient={setSelectedClientId}
            selectedClientId={selectedClientId}
          />
        </div>
        <div className="md:col-span-2 h-full border">
          <ClientReservationDetails clientId={selectedClientId} />
        </div>
      </div>
    </div>
  );
};

export default InsightManagement;
