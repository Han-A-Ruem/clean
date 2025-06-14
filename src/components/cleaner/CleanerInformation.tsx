
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { PageHeader } from '@/components/Utils';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CleanerReview {
  id: string;
  content: string;
  rating: number;
  created_at: string;
  user_name: string;
}

interface CleanerInfo {
  id: string;
  name: string;
  profile_photo: string;
  work_experience_1: string;
  rank: {
    id: string;
    name: string;
    label: string;
  };
  rating: number;
  activity_count: number;
  reviews: CleanerReview[];
}
interface CleanerInformationType {
  onNext: (cleaner: CleanerInfo) => void
}

const CleanerInformation: React.FC<CleanerInformationType> = ({ onNext }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const cleanerId = searchParams.get("cleanerId");

  const navigate = useNavigate();
  const [cleaner, setCleaner] = useState<CleanerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('schedule');

  useEffect(() => {
    const fetchCleanerDetails = async () => {
      if (!cleanerId) return;
      
      setIsLoading(true);
      try {
        // Fetch cleaner basic info
        const { data, error } = await supabase
          .from('users')
          .select(`
            id, 
            name, 
            profile_photo,
            work_experience_1,
            rank:rank_id (id, name, label)
          `)
          .eq('user_id', cleanerId)
          .eq('type', 'cleaner')
          .single();

        if (error) {
          console.error('Error fetching cleaner:', error);
          return;
        }

        // For demo purposes, create mock reviews
        const mockReviews = Array(5).fill(0).map((_, i) => ({
          id: `review-${i}`,
          content: i % 2 === 0 
            ? '꼼꼼하게 청소해주셨어요 감사합니다' 
            : '깨끗하고 꼼꼼합니다. 만족스러운 청소와 깨끗한 욕실 덕분에 기분이 좋았어요.',
          rating: 5,
          created_at: `2019/0${6-i}/0${3+i}`,
          user_name: `사용자${i}**`
        }));

        // Mock cleaner with reviews and additional data
        const mockCleaner: CleanerInfo = {
          ...data,
          rating: 4.4,
          activity_count: 65,
          reviews: mockReviews,
        };

        setCleaner(mockCleaner);
      } catch (error) {
        console.error('Error in cleaner fetch:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCleanerDetails();
  }, [cleanerId]);

  const handleBack = () => {
    navigate('/reservation/cleaner-selection');
  };

  const selectCleaner = () => {
    if (cleaner) {
      onNext(cleaner);
    }
  };
  
  // Helper function to render stars based on rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              "w-4 h-4",
              i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            )}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <PageHeader title="클리너 정보" onBack={handleBack} />
        <div className="flex justify-center items-center h-64">
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!cleaner) {
    return (
      <div className="min-h-screen bg-white">
        <PageHeader title="클리너 정보" onBack={handleBack} />
        <div className="flex justify-center items-center h-64">
          <p>클리너 정보를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <PageHeader title={`${cleaner.name} 클리너`} onBack={handleBack} />
      
      {/* Cleaner Profile Header */}
      <div className="bg-white p-4">
        <div className="flex flex-col items-center justify-center mb-8">
          <Avatar className="w-28 h-28 mb-4">
            <AvatarImage src={cleaner.profile_photo || "/placeholder.svg"} alt={cleaner.name} />
            <AvatarFallback>{cleaner.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="text-center">
            <div className="text-4xl font-bold mb-1">{cleaner.rating}</div>
            <div className="flex justify-center mb-2">
              {renderStars(Math.floor(cleaner.rating))}
            </div>
            
            <div className="flex justify-center gap-6 text-sm text-gray-500 mb-2">
              <div>일반클리너</div>
              <div className="border-l border-gray-300 pl-6">활동 {cleaner.activity_count}</div>
            </div>
          </div>
        </div>
        
        {/* Tabs for Profile Navigation */}
        <Tabs defaultValue="reviews" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="schedule" onClick={() => setActiveTab('schedule')}>일정</TabsTrigger>
            <TabsTrigger value="info" onClick={() => setActiveTab('info')}>정보</TabsTrigger>
            <TabsTrigger value="reviews" onClick={() => setActiveTab('reviews')}>후기({cleaner.reviews.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="schedule" className="p-2">
            <p className="text-center text-gray-500 py-8">일정 정보가 없습니다.</p>
          </TabsContent>
          
          <TabsContent value="info" className="p-2">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">클리너 소개</h3>
                <p className="text-sm text-gray-600">
                  {cleaner.work_experience_1 || "경력 있는 청소 전문가입니다. 항상 깨끗하고 만족스러운 서비스를 제공하기 위해 노력합니다."}
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">경력</h3>
                <p className="text-sm text-gray-600">{cleaner.work_experience_1 || "6개월 이상"}</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="p-2">
            <div className="space-y-4">
              {cleaner.reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">{review.user_name}</div>
                    <div className="text-sm text-gray-500">{review.created_at}</div>
                  </div>
                  <div className="flex mb-2">
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-sm">{review.content}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Select Cleaner Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <button 
          onClick={selectCleaner}
          className="w-full py-3 bg-primary-user text-white font-medium rounded-lg"
        >
          이 클리너 선택하기
        </button>
      </div>
    </div>
  );
};

export default CleanerInformation;
