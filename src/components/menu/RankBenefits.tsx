
import React from 'react';
import { ArrowLeft, Award, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PageHeader } from '../Utils';
import { useRanks } from '@/hooks/useRanks';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RankBenefits = () => {
  const navigate = useNavigate();
  const { ranks, isLoading } = useRanks();
  const { userData } = useUser();

  const getCurrentRankIndex = (): number => {
    if (!userData?.rank || !ranks.length) return 0;
    
    const index = ranks.findIndex(rank => rank.id === userData.rank?.id);
    return index >= 0 ? index : 0;
  };

  const currentRankIndex = getCurrentRankIndex();
  const currentRank = ranks[currentRankIndex];
  const nextRank = ranks[currentRankIndex + 1];

  const renderPromotionCriteria = () => {
    if (!nextRank) return null;

    // Criteria based on current rank
    switch (currentRankIndex) {
      case 0: // Plum to Forsythia
        return (
          <Card className="mt-6 border-purple-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-purple-700">승급 조건: {currentRank?.name} → {nextRank?.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 bg-purple-100 p-1 rounded-full">
                    <Check className="h-3 w-3 text-purple-700" />
                  </div>
                  <span>고객 만족도 4.0 이상 유지</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 bg-purple-100 p-1 rounded-full">
                    <Check className="h-3 w-3 text-purple-700" />
                  </div>
                  <span>10회 이상 작업 완료</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        );
      case 1: // Forsythia to Rose
        return (
          <Card className="mt-6 border-purple-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-purple-700">승급 조건: {currentRank?.name} → {nextRank?.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 bg-purple-100 p-1 rounded-full">
                    <Check className="h-3 w-3 text-purple-700" />
                  </div>
                  <span>고객 만족도 4.2 이상 유지</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 bg-purple-100 p-1 rounded-full">
                    <Check className="h-3 w-3 text-purple-700" />
                  </div>
                  <span>30회 이상 작업 완료</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 bg-purple-100 p-1 rounded-full">
                    <Check className="h-3 w-3 text-purple-700" />
                  </div>
                  <span>최소 6개월 활동</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="h-full">
        <PageHeader title='등급별 혜택'/>
        <div className="flex justify-center items-center h-40">
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full pb-20">
      <PageHeader title='등급별 혜택'/>
      <div className="p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">등급별 혜택 및 승급 조건</h1>
          <p className="text-gray-600 mt-2">더 높은 등급으로 승급하여 더 많은 혜택을 받으세요.</p>
        </div>

        {ranks.length > 0 ? (
          <>
            <div className="space-y-6">
              {ranks.map((rank, index) => (
                <Card 
                  key={rank.id} 
                  className={`border ${index === currentRankIndex ? 'border-purple-300 bg-purple-50' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${rank.bg_color}`}>
                          <span className={rank.color}>{rank.label.charAt(0)}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {rank.name} 
                            {index === currentRankIndex && (
                              <span className="ml-2 text-xs px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full">
                                현재
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-gray-600">{rank.label}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">{rank.hourly_wage.toLocaleString()} KRW</span>
                        <p className="text-sm text-gray-600">시간당</p>
                      </div>
                    </div>

                    {index === 0 && (
                      <div className="mt-4 text-sm text-gray-700">
                        <p>기본 등급으로, 모든 새로운 청소 매니저에게 부여됩니다.</p>
                      </div>
                    )}
                    
                    {index === 1 && (
                      <div className="mt-4 text-sm text-gray-700">
                        <p>청소 경험이 있으며 고객 만족도가 높은 매니저를 위한 등급입니다.</p>
                      </div>
                    )}

                    {index >= 2 && index <= 3 && (
                      <div className="mt-4 text-sm text-gray-700">
                        <p>숙련된 청소 매니저를 위한 프리미엄 등급입니다.</p>
                      </div>
                    )}

                    {index >= 4 && (
                      <div className="mt-4 text-sm text-gray-700">
                        <p>최고 수준의 서비스를 제공하는 베테랑 매니저를 위한 특별 등급입니다.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {renderPromotionCriteria()}

            <div className="mt-8">
              <Card className="bg-blue-50 border-blue-100">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-blue-700 mb-2">등급 혜택</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5 bg-blue-100 p-1 rounded-full">
                        <Check className="h-3 w-3 text-blue-700" />
                      </div>
                      <span>더 높은 시급 지급</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5 bg-blue-100 p-1 rounded-full">
                        <Check className="h-3 w-3 text-blue-700" />
                      </div>
                      <span>우선 예약 배정 혜택</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5 bg-blue-100 p-1 rounded-full">
                        <Check className="h-3 w-3 text-blue-700" />
                      </div>
                      <span>특별 이벤트 및 교육 기회 제공</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-[40vh] text-center p-4">
            <div className="bg-gray-100 rounded-full p-6 mb-6">
              <Award className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-medium mb-2">등급 정보를 불러올 수 없습니다</h2>
            <p className="text-gray-500 mb-6">
              잠시 후 다시 시도해주세요.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="mt-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              돌아가기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RankBenefits;
