
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { StarIcon } from "lucide-react";

interface CleanerCardProps {
  cleaner: {
    id: string;
    name: string;
    profile_photo: string;
    work_experience_1?: string;
    ratings_count?: number;
    rating?: string;
    rank?: {
      id: string;
      name: string;
      label: string;
      hourly_wage: number;
      color: string;
      bg_color: string;
    };
  };
  formatNumber: (num: number) => string;
}

const CleanerCard = ({ cleaner, formatNumber }: CleanerCardProps) => {
  return (
    <Card className="overflow-hidden border border-amber-200 shadow-md">
      <div className="bg-gradient-to-r from-amber-100 to-amber-50 px-4 py-3 border-b border-amber-200">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-amber-800">랜덤 클리너 선택 완료</h3>
          <span
            className="px-2.5 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: cleaner.rank?.bg_color || '#ccc',
              color: cleaner.rank?.color || '#fff'
            }}
          >
            {cleaner.rank?.name || '일반'} 등급
          </span>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={cleaner.profile_photo || "/placeholder.svg"}
              alt={cleaner.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-amber-200"
            />
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md">
              <StarIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex flex-col">
              <h3 className="text-lg font-bold">{cleaner.name} 클리너</h3>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <span>경력: {cleaner.work_experience_1 || "6개월 미만"}</span>
                <span className="mx-2">•</span>
                <div className="flex items-center">
                  <StarIcon className="w-4 h-4 text-amber-500 mr-1 inline" />
                  <span className="font-medium">{cleaner.rating}</span>
                  <span className="text-gray-500 ml-1">({cleaner.ratings_count})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
          <p>
            고객님의 요청에 따라 랜덤으로 배정된 클리너입니다. 서비스 완료 후 이 클리너의 서비스를 평가할 수 있습니다.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CleanerCard;
