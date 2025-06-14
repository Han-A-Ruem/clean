
import React, { useState, useEffect } from 'react';
import { ChevronUp, AlertCircle } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useRanks } from '@/hooks/useRanks';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import CleanerCard from './CleanerCard';

interface Cleaner {
  id: string;
  name: string;
  profile_photo: string;
  work_experience_1: string;
  rank: {
    id: string;
    name: string;
    label: string;
    hourly_wage: number;
    color: string;
    bg_color: string;
  };
  ratings_count?: number;
  rating?: string;
  has_previous_visit?: boolean;
}

interface WageSelectorProps {
  onSelectCleaner?: (cleanerId: string) => void;
  userId?: string;
}

export const WageSelector = ({ onSelectCleaner, userId }: WageSelectorProps) => {
  const { ranks, isLoading: ranksLoading } = useRanks();
  const [isOpen, setIsOpen] = useState(true);
  const [wageRange, setWageRange] = useState<[number, number]>([0, 100000]);
  const [selectedCleaner, setSelectedCleaner] = useState<string | null>(null);
  const [randomlySelectedCleaner, setRandomlySelectedCleaner] = useState<Cleaner | null>(null);
  
  // Fetch previous cleaners that a user has worked with
  const fetchPreviousCleaners = async () => {
    if (!userId) return [];
    
    // Get past reservations for this user
    const { data: reservations, error: reservationsError } = await supabase
      .from('reservations')
      .select('cleaner_id')
      .eq('user', userId)
      .not('cleaner_id', 'is', null);
      
    if (reservationsError) {
      console.error('Error fetching previous reservations:', reservationsError);
      return [];
    }
    
    // If no previous reservations, return empty array
    if (!reservations || reservations.length === 0) return [];
    
    // Get unique cleaner IDs
    const cleanerIds = [...new Set(reservations.map(r => r.cleaner_id))];
    
    // Fetch cleaner details
    const { data: cleaners, error: cleanersError } = await supabase
      .from('users')
      .select(`
        id, 
        name, 
        profile_photo,
        work_experience_1,
        rank:rank_id (id, name, label, hourly_wage, color, bg_color)
      `)
      .eq('type', 'cleaner')
      .eq('is_active', true)
      .in('user_id', cleanerIds);
      
    if (cleanersError) {
      console.error('Error fetching previous cleaners:', cleanersError);
      return [];
    }
    
    // Add has_previous_visit flag and mock rating data
    return cleaners.map(cleaner => ({
      ...cleaner,
      has_previous_visit: true,
      ratings_count: Math.floor(Math.random() * 1000) + 1, // Mock data
      rating: (Math.random() * 1 + 4).toFixed(1) // Random rating between 4.0-5.0
    }));
  };

  // Fetch cleaners based on wage range
  const fetchCleanersByWageRange = async () => {
    // Get ranks that fall within the selected wage range
    const filteredRanks = ranks?.filter(
      rank => rank.hourly_wage >= wageRange[0] && rank.hourly_wage <= wageRange[1]
    ) || [];
    
    const rankIds = filteredRanks.map(rank => rank.id);
    
    if (rankIds.length === 0) return [];
    
    const { data: cleaners, error } = await supabase
      .from('users')
      .select(`
        id, 
        name, 
        profile_photo,
        work_experience_1,
        rank:rank_id (id, name, label, hourly_wage, color, bg_color)
      `)
      .eq('type', 'cleaner')
      .eq('is_active', true)
      .in('rank_id', rankIds);
      
    if (error) {
      console.error('Error fetching cleaners:', error);
      throw error;
    }
    
    return cleaners.map(cleaner => ({
      ...cleaner,
      has_previous_visit: false,
      ratings_count: Math.floor(Math.random() * 1000) + 1, // Mock data
      rating: (Math.random() * 1 + 4).toFixed(1) // Random rating between 4.0-5.0
    }));
  };
  
  // Fetch previous cleaners first
  const { data: previousCleaners = [], isLoading: previousCleanersLoading } = useQuery({
    queryKey: ['previous-cleaners', userId],
    queryFn: fetchPreviousCleaners,
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
  
  // Then fetch cleaners by wage range
  const { data: cleanersByWage = [], isLoading: cleanersLoading } = useQuery({
    queryKey: ['cleaners-by-wage', wageRange],
    queryFn: fetchCleanersByWageRange,
    enabled: !ranksLoading && ranks.length > 0,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
  
  // Determine if the user has previous cleaners (not first time)
  const hasVisitedBefore = previousCleaners.length > 0;
  
  // Auto-select a random cleaner when component mounts or wage range changes
  // Only for first-time users
  useEffect(() => {
    if (!hasVisitedBefore && cleanersByWage.length > 0 && !randomlySelectedCleaner) {
      selectRandomCleaner();
    }
  }, [cleanersByWage, hasVisitedBefore]);
  
  // Function to select a random cleaner
  const selectRandomCleaner = () => {
    // Get cleaners that match current wage range only
    const cleanersInWageRange = cleanersByWage.filter(
      cleaner => cleaner.rank?.hourly_wage >= wageRange[0] && cleaner.rank?.hourly_wage <= wageRange[1]
    );
    
    // Choose a random cleaner from the filtered list
    if (cleanersInWageRange.length > 0) {
      const randomIndex = Math.floor(Math.random() * cleanersInWageRange.length);
      const randomCleaner = cleanersInWageRange[randomIndex];
      
      if (randomCleaner) {
        setSelectedCleaner(randomCleaner.id);
        setRandomlySelectedCleaner(randomCleaner);
      }
    }
  };
  
  // Combine both lists, but prioritize previous cleaners
  const allCleaners = [...previousCleaners];
  
  // Only add cleaners from wage range that aren't already in previousCleaners
  cleanersByWage.forEach(cleaner => {
    if (!allCleaners.some(c => c.id === cleaner.id)) {
      allCleaners.push(cleaner);
    }
  });
  
  const handleSliderChange = (value: number[]) => {
    setWageRange([value[0], value[1]]);
    
    // For first-time users, automatically select a new random cleaner when wage range changes
    if (!hasVisitedBefore) {
      // Reset the current random selection
      setRandomlySelectedCleaner(null);
      // The useEffect will trigger a new random selection once cleanersByWage updates
    }
  };
  
  const handleCleanerSelect = (cleanerId: string) => {
    setSelectedCleaner(cleanerId);
  };
  
  const handleConfirmSelection = () => {
    // For first-time users with a randomly selected cleaner
    if (!hasVisitedBefore && randomlySelectedCleaner) {
      if (onSelectCleaner) {
        onSelectCleaner(randomlySelectedCleaner.id);
        toast.success(`랜덤으로 클리너 ${randomlySelectedCleaner.name}님이 선택되었습니다.`);
      }
    } 
    // For returning users with a selected cleaner
    else if (hasVisitedBefore && selectedCleaner) {
      if (onSelectCleaner) {
        onSelectCleaner(selectedCleaner);
        const selectedCleanerName = allCleaners.find(c => c.id === selectedCleaner)?.name;
        toast.success(`클리너 ${selectedCleanerName}님이 선택되었습니다.`);
      }
    } else {
      toast.error('클리너를 선택해 주세요.');
    }
  };
  
  // Count cleaners in the selected wage range
  const cleanersCount = allCleaners.length;
  
  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  if (ranksLoading || previousCleanersLoading) {
    return <div className="p-4 text-center">정보를 불러오는 중입니다...</div>;
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* <div 
        className="flex justify-between items-center p-4 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-lg font-bold">요금 설정</h2>
        <ChevronUp className={cn("transform transition-transform", !isOpen && "rotate-180")} />
      </div> */}
      
        <div className="px-4 pb-4">
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <div className="text-lg font-bold mb-2">
              {formatNumber(wageRange[0])}원 ~ {formatNumber(wageRange[1])}원 ({cleanersCount}명 검색됨)
            </div>
            
            <div className="pt-4 pb-8">
              <Slider 
                className="my-4"
                defaultValue={[wageRange[0], wageRange[1]]}
                min={Math.min(...ranks.map(rank => rank.hourly_wage))}
                max={Math.max(...ranks.map(rank => rank.hourly_wage))}
                step={100}
                value={[wageRange[0], wageRange[1]]}
                onValueChange={handleSliderChange}
              />
              
              <div className="flex justify-between text-gray-600 mt-2">
                <span>{formatNumber(Math.min(...ranks.map(rank => rank.hourly_wage)))}</span>
                <span>{formatNumber(Math.max(...ranks.map(rank => rank.hourly_wage)))}</span>
              </div>
            </div>
          </div>
          
          {!hasVisitedBefore ? (
            <div className="space-y-4">
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="text-amber-500 w-5 h-5 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-amber-800">첫 방문이신가요?</h3>
                    <p className="text-amber-700 text-sm mt-1">
                      첫 방문은 랜덤으로 클리너가 배정됩니다. 클리너가 자동으로 선택되었습니다.
                    </p>
                  </div>
                </div>
              </div>
              
              {randomlySelectedCleaner ? (
                <>
                  <CleanerCard cleaner={randomlySelectedCleaner} formatNumber={formatNumber} />
                  <Button 
                    className="w-full mt-2 bg-primary-user hover:bg-primary-user"
                    onClick={handleConfirmSelection}
                  >
                    예약 진행하기
                  </Button>
                </>
              ) : (
                <div className="text-center py-4">클리너를 불러오는 중입니다...</div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">이전에 방문한 클리너</h3>
                <span className="text-sm text-gray-500">등급안내</span>
              </div>
              
              <div className="space-y-4 mb-6">
                {previousCleaners.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">이전에 방문한 클리너가 없습니다</div>
                ) : (
                  previousCleaners.map((cleaner) => (
                    <div 
                      key={cleaner.id} 
                      className={cn(
                        "flex items-center border-b pb-4 cursor-pointer",
                        selectedCleaner === cleaner.id && "bg-primary-user/20 -mx-3 px-3 rounded-lg"
                      )}
                      onClick={() => handleCleanerSelect(cleaner.id)}
                    >
                      <div className="flex-shrink-0 mr-4">
                        <img 
                          src={cleaner.profile_photo || "/placeholder.svg"} 
                          alt={cleaner.name} 
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{cleaner.name}</h3>
                              <span>/ 경력 {cleaner.work_experience_1 || "6개월 미만"}</span>
                            </div>
                            <p className="text-xl font-bold">{formatNumber(cleaner.rank?.hourly_wage || 0)}원</p>
                          </div>
                          <div className="text-right">
                            <div className="mb-1">
                              <span 
                                className="px-3 py-1 rounded-full text-sm text-white"
                                style={{ 
                                  backgroundColor: cleaner.rank?.bg_color || '#ccc',
                                  color: cleaner.rank?.color || '#fff'
                                }}
                              >
                                {cleaner.rank?.name || '일반'}
                              </span>
                            </div>
                            <div>
                              <span className="text-lg font-bold">{cleaner.rating}</span>
                              <span className="text-gray-500 ml-1">({cleaner.ratings_count})</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          
          {hasVisitedBefore && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">다른 클리너</h3>
              </div>
              
              <div className="space-y-4">
                {cleanersLoading ? (
                  <div className="text-center py-4">로딩 중...</div>
                ) : cleanersByWage.length === 0 ? (
                  <div className="text-center py-4">검색 결과가 없습니다</div>
                ) : (
                  cleanersByWage
                    .filter(cleaner => !previousCleaners.some(pc => pc.id === cleaner.id))
                    .map((cleaner) => (
                      <div 
                        key={cleaner.id} 
                        className={cn(
                          "flex items-center border-b pb-4 cursor-pointer",
                          selectedCleaner === cleaner.id && "bg-gray-50 -mx-3 px-3 rounded-lg"
                        )}
                        onClick={() => handleCleanerSelect(cleaner.id)}
                      >
                        <div className="flex-shrink-0 mr-4">
                          <img 
                            src={cleaner.profile_photo || "/placeholder.svg"} 
                            alt={cleaner.name} 
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{cleaner.name}</h3>
                                <span>/ 경력 {cleaner.work_experience_1 || "6개월 미만"}</span>
                              </div>
                              <p className="text-xl font-bold">{formatNumber(cleaner.rank?.hourly_wage || 0)}원</p>
                            </div>
                            <div className="text-right">
                              <div className="mb-1">
                                <span 
                                  className="px-3 py-1 rounded-full text-sm text-white"
                                  style={{ 
                                    backgroundColor: cleaner.rank?.bg_color || '#ccc',
                                    color: cleaner.rank?.color || '#fff'
                                  }}
                                >
                                  {cleaner.rank?.name || '일반'}
                                </span>
                              </div>
                              <div>
                                <span className="text-lg font-bold">{cleaner.rating}</span>
                                <span className="text-gray-500 ml-1">({cleaner.ratings_count})</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
              
              <Button 
                className="w-full mt-6 bg-primary-user"
                onClick={handleConfirmSelection}
                disabled={!selectedCleaner}
              >
                선택 완료
              </Button>
            </div>
          )}
        </div>
    </div>
  );
};
