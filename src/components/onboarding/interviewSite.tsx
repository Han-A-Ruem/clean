import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/Utils';
import { toast } from 'sonner';
import { useCleanerRegistration } from '@/contexts/CleanerRegistrationContext';

interface InterviewSite {
  id: string;
  title: string;
  address: string;
  longitude: number;
  latitude: number;
}
const InterviewSite: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSite, setSelectedSite] = useState<string | null>(null);

const { data , setData} = useCleanerRegistration();

console.log(data);
  
  // Define interview sites with location data
  const interviewSites: InterviewSite[] = [
    {
      id: "eulji",
      title: "을지로 입구",
      address: "서울 중구 남대문로9길 24 패스트파이브 타워 3-12층",
      longitude: 126.9826,
      latitude: 37.5649
    },
    {
      id: "hongdae",
      title: "홍대",
      address: "서울 마포구 양화로 161 케이스퀘어 5-8층",
      longitude: 126.9237,
      latitude: 37.5559
    },
    {
      id: "ttukseom",
      title: "뚝섬(서울숲)",
      address: "서울특별시 성동구 왕십리로 125 KD운송타워 2-12층",
      longitude: 127.0448,
      latitude: 37.5474
    },
    {
      id: "gangnam",
      title: "강남",
      address: "서울 강남구 강남대로94길 10 케이스퀘어 6-12층",
      longitude: 127.0281,
      latitude: 37.5016
    },
    {
      id: "chungmuro",
      title: "충무로",
      address: "서울 중구 퇴계로30길 14 바이브빌딩 2-5층",
      longitude: 126.9972,
      latitude: 37.5611
    }
  ];

  // Open directions in Kakao Map with starting location
  const openDirections = (site: InterviewSite, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent selection when clicking the direction button
    console.log('Opening directions for:', site);
    const targetUrl = `https://map.kakao.com/link/to/${encodeURIComponent(site.address)},${site.latitude},${site.longitude}`;
    // Fallback if browser doesn't support geolocation
    console.log('Opening directions for:', targetUrl);
    return;
    window.open(targetUrl, '_blank');
  };
  
  // Handle site selection
  const handleSiteSelect = (siteId: string) => {
    setSelectedSite(siteId);
  };
  
  // Handle completion - only proceed if a site is selected
  const handleComplete = () => {
    if (!selectedSite) {
      toast.error("면접 장소를 선택해주세요");
      return;
    }

    setData({
      ...data,
      selectedSite: selectedSite
    })
    navigate('/onboarding/details');
  };

  return (
    <div className="min-h-screen bg-gray-50/80">
      <PageHeader
        title="면접 장소"
        className="backdrop-blur-lg bg-white/70 border-b border-white/30"
      />
      
      <div className="p-4 space-y-6">
        {/* Introduction */}
        <div className="text-center">
          <h2 className="text-xl font-semibold">면접 센터 위치</h2>
          <p className="text-sm text-gray-600 mt-1">아래 위치 중 하나를 선택하여 면접에 참석해 주세요</p>
        </div>
        {/* Interview Sites List - Simplified without maps */}
        <div className="space-y-4">
          {interviewSites.map((site) => (
            <Card 
              key={site.id} 
              className={`overflow-hidden border transition-all cursor-pointer ${
                selectedSite === site.id
                  ? "border-primary-cleaner bg-primary-cleaner/5 shadow-md"
                  : "border-gray-200 hover:shadow-md"
              }`}
              onClick={() => handleSiteSelect(site.id)}
            >
              <CardContent className="p-4">
                {/* Header with location icon and selection indicator */}
                <div className="flex items-start mb-3">
                  <div className={`p-2 rounded-full mr-3 ${
                    selectedSite === site.id 
                      ? "bg-primary-cleaner" 
                      : "bg-primary-cleaner/10"
                  }`}>
                    {selectedSite === site.id ? (
                      <Check className="h-5 w-5 text-white" />
                    ) : (
                      <MapPin className="h-5 w-5 text-primary-cleaner" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{site.title}</h3>
                    <p className="text-gray-600">{site.address}</p>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <Button
                    variant="outline"
                    className="flex-1 text-primary-cleaner border-primary-cleaner hover:bg-primary-cleaner hover:text-white"
                    onClick={(e) => openDirections(site, e)}
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    길찾기
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="pt-4">
          <Button 
            className="w-full bg-primary-cleaner hover:bg-primary-cleaner/90 disabled:bg-gray-300 disabled:cursor-not-allowed"
            onClick={handleComplete}
            disabled={!selectedSite}
          >
            {selectedSite ? "선택 완료" : "면접 장소를 선택해주세요"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewSite;