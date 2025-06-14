
import React from 'react';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface TagsSelectionProps {
  userTags: string[];
  isEditing: boolean;
  handleTagChange: (tags: string[]) => void;
  openTagsInfo: () => void;
}

const AVAILABLE_TAGS = [
  '차분한', '밝은', '활동적인', '꼼꼼한', '친절한', '책임감 있는', '유연한', 
  '조용한', '사교적인', '성실한', '센스 있는', '독립적인', '깔끔한', '예의 바른'
];

const TagsSelection: React.FC<TagsSelectionProps> = ({ 
  userTags, 
  isEditing, 
  handleTagChange,
  openTagsInfo 
}) => {
  const handleValueChange = (value: string[]) => {
    // Limit to maximum 5 tags
    if (value.length <= 5) {
      handleTagChange(value);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <h3 className="font-medium text-lg">나를 표현하는 태그</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 ml-1"
                  onClick={openTagsInfo}
                >
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                태그에 대한 자세한 설명 보기
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {!isEditing && userTags.length === 0 && (
          <span className="text-sm text-gray-400">선택된 태그 없음</span>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-500">최대 5개까지 선택 가능합니다</p>
          <ToggleGroup 
            type="multiple" 
            className="flex flex-wrap gap-2"
            value={userTags}
            onValueChange={handleValueChange}
          >
            {AVAILABLE_TAGS.map(tag => (
              <ToggleGroupItem 
                key={tag} 
                value={tag} 
                className="rounded-full text-sm py-1 px-3 border"
              >
                {tag}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {userTags.length > 0 ? (
            userTags.map(tag => (
              <span 
                key={tag} 
                className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))
          ) : (
            <p className="text-sm text-gray-500">프로필을 수정하여 태그를 선택해주세요.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TagsSelection;
