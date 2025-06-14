
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Briefcase } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface WorkExperienceProps {
  userInfo: {
    workExperience1: string;
    workExperience2: string;
  };
  isEditing: boolean;
  handleChange: (field: string, value: any) => void;
}

export const WorkExperience: React.FC<WorkExperienceProps> = ({
  userInfo,
  isEditing,
  handleChange,
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">경력 정보</h2>
        <Separator className="flex-1 ml-3" />
      </div>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Briefcase className="h-4 w-4 mr-2 text-primary-user/70" />
            <label>작업 경험 1</label>
          </div>
          {isEditing ? (
            <Textarea
              value={userInfo.workExperience1}
              onChange={(e) => handleChange('workExperience1', e.target.value)}
              placeholder="작업 경험을 입력하세요"
              className="bg-gray-50"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-md">
              {userInfo.workExperience1 || "정보 없음"}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Briefcase className="h-4 w-4 mr-2 text-primary-user/70" />
            <label>작업 경험 2</label>
          </div>
          {isEditing ? (
            <Textarea
              value={userInfo.workExperience2}
              onChange={(e) => handleChange('workExperience2', e.target.value)}
              placeholder="추가 작업 경험을 입력하세요"
              className="bg-gray-50"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-md">
              {userInfo.workExperience2 || "정보 없음"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
