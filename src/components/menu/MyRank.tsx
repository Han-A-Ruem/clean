
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useRanks, Rank } from '@/hooks/useRanks';
import { PageHeader } from '@/components/Utils';
import { useUser } from '@/contexts/UserContext';

// Import all rank icons
import Plum from './icons/Plum';
import ForsythiaIcon from './icons/Forsythia';
import Rose from './icons/Rose';
import SunflowerIcon from './icons/Sunflower';
import CosmosIcon from './icons/Cosmos';
import CamelliaIcon from './icons/Camellia';

// Map for icon components
const iconComponents = {
  'Plum': Plum,
  'Forsythia': ForsythiaIcon,
  'Rose': Rose,
  'Sunflower': SunflowerIcon,
  'Cosmos': CosmosIcon,
  'Camellia': CamelliaIcon
};

// Promotion criteria for each rank (index based)
const promotionCriteria = [
  { // Plum to Forsythia
    criteria: [
      { label: '고객 만족도 4.0 이상', description: '고객 리뷰 평점이 4.0점을 넘어야 합니다' },
      { label: '10회 이상 작업 완료', description: '최소 10개의 청소 업무를 완료해야 합니다' }
    ]
  },
  { // Forsythia to Rose
    criteria: [
      { label: '고객 만족도 4.3 이상', description: '고객 리뷰 평점이 4.3점을 넘어야 합니다' },
      { label: '30회 이상 작업 완료', description: '최소 30개의 청소 업무를 완료해야 합니다' },
      { label: '취소율 5% 미만', description: '예약 취소율이 5% 미만이어야 합니다' }
    ]
  },
  // Add more criteria for other ranks here
];

export interface MyRankProps {
  expanded?: boolean;
  onToggle?: () => void;
  className?: string;
}

export const MyRank: React.FC<MyRankProps> = ({ 
  expanded = false, 
  onToggle, 
  className 
}) => {
  const { ranks, isLoading, error } = useRanks();
  const { userData } = useUser();
  
  // Get the current rank index from user data
  const getCurrentRankIndex = (): number => {
    if (!userData?.rank || !ranks.length) return 0;
    
    const index = ranks.findIndex(rank => rank.id === userData.rank.id);
    return index >= 0 ? index : 0;
  };
  
  const currentRankIndex = getCurrentRankIndex();
  
  // Separate visible and advanced ranks (first 4 shown in main view)
  const displayedRanks = ranks.slice(0, 4);
  const higherRanks = ranks.slice(4);

  // Format hourly wage as KRW
  const formatWage = (wage: number) => {
    return `${wage.toLocaleString()} KRW`;
  };

  // Get the appropriate icon component for a rank
  const getIconComponent = (label: string, size: number) => {
    const IconComponent = iconComponents[label as keyof typeof iconComponents];
    return IconComponent ? <IconComponent size={size} /> : null;
  };

  if (isLoading) {
    return (
      <div className="h-full">
        <PageHeader title="시급 등급" />
        <div className="flex justify-center items-center h-64">
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full">
        <PageHeader title="시급 등급" />
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <PageHeader 
        title="시급 등급" 
        rightElement={
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="p-2 text-gray-600 hover:text-blue-600">
                      <Info className="h-5 w-5" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4 bg-white mx-2">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-blue-700">Advanced Ranks</h3>
                      <Table>
                        <TableBody>
                          {higherRanks.map((rank, index) => (
                            <TableRow key={rank.id} className="border-none hover:bg-transparent">
                              <TableCell className="pl-0 w-12">
                                <div className="flex items-center justify-center">
                                  {getIconComponent(rank.label, rank.icon_size)}
                                </div>
                              </TableCell>
                              <TableCell className="px-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-800">{rank.name}</span>
                                  <span className="text-sm text-gray-500">{rank.label}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right pr-0 font-medium">
                                {formatWage(rank.hourly_wage)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <p className="text-sm text-gray-600">
                        These higher ranks are available to our most experienced and highly-rated cleaners.
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              </TooltipTrigger>
              <TooltipContent>
                <p>View higher ranks</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        }
      />
      <div className="p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">시간당 임금 순위</h1>
        </div>

        <div className={cn("space-y-4", className)}>
          <Table>
            <TableBody>
              {displayedRanks.map((rank, index) => {
                const isCurrentRank = index === currentRankIndex;
                
                return (
                  <TableRow 
                    key={rank.id} 
                    className={cn(
                      "border-none hover:bg-transparent", 
                      isCurrentRank ? "font-semibold" : ""
                    )}
                  >
                    <TableCell className="pl-0 w-12">
                      <div className="flex items-center justify-center">
                        {getIconComponent(rank.label, rank.icon_size)}
                      </div>
                    </TableCell>
                    <TableCell className="px-2">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          isCurrentRank ? "text-purple-600" : "text-gray-800"
                        )}>
                          {rank.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {rank.label}
                        </span>
                        {isCurrentRank && (
                          <span className="ml-1 text-xs px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full">
                            현재
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-0 font-medium">
                      {formatWage(rank.hourly_wage)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="pt-4">
            <Card className="bg-purple-50 border-purple-100">
              <CardContent className="p-4">
                <h3 className="font-semibold text-purple-700 mb-2">등급 승진 안내</h3>
                <p className="text-sm text-gray-700">
                  등급은 활동 횟수, 고객 평가, 서비스 품질에 따라 자동으로 변경됩니다. 
                  높은 등급은 더 높은 시급과 추가 혜택을 제공합니다.
                </p>
                {currentRankIndex < displayedRanks.length - 1 && promotionCriteria[currentRankIndex] && (
                  <div className="mt-3 text-sm">
                    <p className="font-medium text-purple-700">다음 등급 승진 조건:</p>
                    <ul className="list-disc pl-5 mt-1 text-gray-700">
                      {promotionCriteria[currentRankIndex].criteria.map((criterion, idx) => (
                        <li key={idx} className="mb-1">
                          <span className="font-medium">{criterion.label}</span>
                          <p className="text-xs text-gray-500">{criterion.description}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRank;
