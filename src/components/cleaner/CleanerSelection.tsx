
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/Utils';
import { supabase } from '@/integrations/supabase/client';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { useRanks } from '@/hooks/useRanks';
import { Button } from '@/components/ui/button';

interface Cleaner {
  id: string;
  name: string;
  profile_photo: string;
  work_experience_1: string;
  likes_count: number;
  reviews_count: number;
  rank: {
    id: string;
    name: string;
    label: string;
  };
}

interface CleanerSelectionProps {
  cleanerType: 'regular' | 'luxury';
  onBack?: () => void;
  onNext: (cleanerId: string) => void;
}

const CleanerSelection: React.FC<CleanerSelectionProps> = ({ 
  cleanerType, 
  onBack, 
  onNext 
}) => {
  const navigate = useNavigate();
  const { ranks, isLoading: ranksLoading } = useRanks();
  
  // Fetch cleaners based on rank type
  const fetchCleaners = async () => {
    // Determine which ranks to fetch based on cleanerType
    const { data: rankData, error: rankError } = await supabase
      .from('ranks')
      .select('id')
      .in('label', cleanerType === 'regular' ? ['Plum', 'Forsythia'] : ['Rose', 'Sunflower']);

    if (rankError) {
      throw new Error(`Error fetching ranks: ${rankError.message}`);
    }

    const rankIds = rankData.map(rank => String(rank.id));

    const { data: users, error: usersError } = await supabase
      .from('users')
      .select(`
        id, 
        name, 
        profile_photo,
        work_experience_1,
        rank:rank_id (id, name, label)
      `)
      .eq('type', 'cleaner')
      .eq('is_active', true)
      .in('rank_id', rankIds);

    if (usersError) {
      throw new Error(`Error fetching cleaners: ${usersError.message}`);
    }

    // Add mock likes and reviews counts for UI display
    return users.map(cleaner => ({
      ...cleaner,
      likes_count: Math.floor(Math.random() * 10),
      reviews_count: Math.floor(Math.random() * 10)
    }));
  };

  const { data: cleaners = [], isLoading } = useQuery({
    queryKey: ['cleaners', cleanerType],
    queryFn: fetchCleaners,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Group cleaners by rank
  const groupedCleaners = cleaners.reduce((acc, cleaner) => {
    const rankName = cleaner.rank?.name || 'Unknown';
    if (!acc[rankName]) {
      acc[rankName] = [];
    }
    acc[rankName].push(cleaner);
    return acc;
  }, {} as Record<string, Cleaner[]>);

  // Sort rank groups by their order in the ranks array
  const sortedRankNames = Object.keys(groupedCleaners).sort((a, b) => {
    const rankA = ranks?.find(r => r.name === a);
    const rankB = ranks?.find(r => r.name === b);
    return (rankA?.order_index || 0) - (rankB?.order_index || 0);
  });

  const handleSelectCleaner = (cleanerId: string) => {
    onNext(cleanerId);
  };

  const handleSkipSelection = () => {
    // Navigate to the next step without selecting a cleaner
    navigate('/reservation/info');
  };

  const handleViewCleanerDetails = (cleanerId: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default to avoid triggering the parent onClick
    e.stopPropagation(); // Stop propagation to parent elements
    navigate(`/reservation/cleaner-info?cleanerId=${cleanerId}`);
  };

  // Helper function to render stars based on rating (random for demo)
  const renderStars = (cleaner: Cleaner) => {
    const rating = Math.floor(Math.random() * 2) + 4; // Random rating between 4-5
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              "w-5 h-5",
              i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="가사 정소" onBack={onBack} rightElement={    <Button 
            variant="outline" 
            className="w-full border-primary-user text-primary-user" 
            onClick={handleSkipSelection}
          >
            건너뛰기
          </Button>}/>
      
      <div className="p-4">
        {isLoading || ranksLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>로딩 중...</p>
          </div>
        ) : cleaners.length === 0 ? (
          <div className="text-center py-8">
            <p>이용 가능한 클리너가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedRankNames.map(rankName => (
              <div key={rankName} className="mb-6">
                <h2 className="text-lg font-bold mb-3 px-2 py-1 bg-gray-50 rounded">{rankName}</h2>
                <div className="space-y-4">
                  {groupedCleaners[rankName].map((cleaner, index) => (
                    <React.Fragment key={cleaner.id}>
                      <div 
                        className="flex items-center p-4 bg-white cursor-pointer"
                        onClick={() => handleSelectCleaner(cleaner.id)}
                      >
                        <div 
                          className="flex-shrink-0 mr-4"
                          onClick={(e) => handleViewCleanerDetails(cleaner.id, e)}
                        >
                          <img 
                            src={cleaner.profile_photo || "/placeholder.svg"} 
                            alt={cleaner.name} 
                            className="w-16 h-16 rounded-full object-cover border border-gray-200"
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 
                                className="font-medium text-lg underline text-blue-600"
                                onClick={(e) => handleViewCleanerDetails(cleaner.id, e)}
                              >
                                {cleaner.name} 클리너
                              </h3>
                              <p className="text-sm text-gray-600">경력 {cleaner.work_experience_1 || "6개월 미만"}</p>
                            </div>
                            <div className="text-right">
                              {renderStars(cleaner)}
                              <div className="text-sm text-gray-500">
                                <span>{cleaner.likes_count} 활동</span>
                                <span className="ml-2">{cleaner.reviews_count} 후기</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Add separator except for the last item */}
                      {index < groupedCleaners[rankName].length - 1 && (
                        <div className="h-px bg-gray-200 w-full"></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Skip button added at the bottom */}
        {/* <div className="mt-6 px-4">
      
        </div> */}
        
        {/* Bottom banner */}
        {cleanerType === 'luxury' && (
          <div className="bg-gray-100 p-4 rounded-md mt-4 flex items-center">
            <div className="text-red-500 mr-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L20 18H4L12 4Z" fill="currentColor" />
              </svg>
            </div>
            <span className="text-sm">선택 날짜에 가능</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CleanerSelection;
