
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';

type TagDescriptionType = {
  [key: string]: string;
};

const TAG_DESCRIPTIONS: TagDescriptionType = {
  '차분한': '조용하고 안정적인 성격, 신뢰감 있는 서비스 제공',
  '밝은': '긍정적이고 친절한 에너지로 고객과 소통',
  '활동적인': '에너지가 넘치고, 빠르고 능숙한 업무 수행',
  '꼼꼼한': '작은 부분까지 세심하게 신경 써서 청소하는 스타일',
  '친절한': '고객과 소통을 중요하게 여기고 배려심 있는 서비스 제공',
  '책임감 있는': '맡은 일을 끝까지 성실하게 수행하는 성격',
  '유연한': '고객의 요청에 맞춰 융통성 있게 대응하는 스타일',
  '조용한': '불필요한 대화보다는 묵묵히 일하는 스타일',
  '사교적인': '고객과 편하게 대화하며 친근한 분위기 조성',
  '성실한': '맡은 일을 신중하게 처리하며 신뢰를 주는 성격',
  '센스 있는': '고객이 말하지 않아도 필요한 부분을 캐치하는 능력',
  '독립적인': '별다른 지시 없이도 알아서 업무를 수행하는 스타일',
  '깔끔한': '정리 정돈을 중요하게 생각하며 청소 후 완벽한 마무리',
  '예의 바른': '고객 응대 시 예절을 갖춘 정중한 태도',
};

interface TagsInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const TagsInfoDialog: React.FC<TagsInfoDialogProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            태그 설명
            <button 
              onClick={onClose} 
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </button>
          </DialogTitle>
          <DialogDescription>
            각 태그는 매니저님의 특성을 나타냅니다
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-3">
          {Object.entries(TAG_DESCRIPTIONS).map(([tag, description]) => (
            <div key={tag} className="p-3 border rounded-lg">
              <div className="font-medium">{tag}</div>
              <div className="text-sm text-gray-600">{description}</div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TagsInfoDialog;
