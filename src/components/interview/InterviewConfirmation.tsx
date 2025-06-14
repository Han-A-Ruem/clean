
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Check, Calendar, Clock, MapPin } from 'lucide-react';

interface InterviewConfirmationProps {
  date: Date;
  location: string;
  timeSlot: string;
  isConfirmed: boolean;
  onConfirm: () => void;
}

const InterviewConfirmation: React.FC<InterviewConfirmationProps> = ({ 
  date, 
  location, 
  timeSlot,
  isConfirmed,
  onConfirm
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-medium flex items-center">
          {isConfirmed ? '인터뷰 예약 확인' : '선택한 일정 확인'}
        </h2>
        
        <div>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4 bg-primary text-primary-foreground">
                <h3 className="font-semibold text-xl">
                  {format(date, 'yyyy년 MM월 dd일 (EEE)', { locale: ko })}
                </h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">장소</p>
                    <p className="font-medium">{location}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">시간</p>
                    <p className="font-medium">{timeSlot}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {isConfirmed && (
        <div className="rounded-lg bg-yellow-50 p-4 border border-yellow-200">
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-sm text-yellow-700">
              <p>
                <strong>확인해주세요:</strong> 이 예약을 완료하면 취소할 수 없습니다. 정확한 정보를 확인하신 후 등록해주세요.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div>
        <Button 
          onClick={onConfirm} 
          className="w-full flex items-center justify-center"
        >
          {isConfirmed ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              예약 완료
            </>
          ) : (
            "다음"
          )}
        </Button>
      </div>
    </div>
  );
};

export default InterviewConfirmation;
