
import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2 } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface InterviewScheduleListProps {
  onEdit: (schedule: any) => void;
}

const InterviewScheduleList: React.FC<InterviewScheduleListProps> = ({ onEdit }) => {
  const { toast } = useToast();
  const [scheduleToDelete, setScheduleToDelete] = useState<any | null>(null);
  
  const { data: schedules = [], isLoading, refetch } = useQuery({
    queryKey: ['interviewSchedules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('interview_schedules')
        .select('*, interview_participants(count)')
        .order('date', { ascending: true })
        .order('time_slot', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });
  
  const handleDeleteClick = (schedule: any) => {
    setScheduleToDelete(schedule);
  };
  
  const confirmDelete = async () => {
    if (!scheduleToDelete) return;
    
    try {
      // First check if there are any participants
      const { count, error: countError } = await supabase
        .from('interview_participants')
        .select('*', { count: 'exact', head: true })
        .eq('schedule_id', scheduleToDelete.id);
      
      if (countError) throw countError;
      
      if (count && count > 0) {
        toast({
          variant: "destructive",
          title: "삭제 불가",
          description: "이미 참가자가 등록된 일정은 삭제할 수 없습니다.",
        });
        setScheduleToDelete(null);
        return;
      }
      
      // Delete the schedule
      const { error } = await supabase
        .from('interview_schedules')
        .delete()
        .eq('id', scheduleToDelete.id);
      
      if (error) throw error;
      
      toast({
        title: "삭제 완료",
        description: "인터뷰 일정이 삭제되었습니다.",
      });
      
      refetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "오류 발생",
        description: error.message,
      });
    } finally {
      setScheduleToDelete(null);
    }
  };
  
  if (isLoading) {
    return <div className="text-center py-10">로딩 중...</div>;
  }
  
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>날짜</TableHead>
              <TableHead>시간</TableHead>
              <TableHead>장소</TableHead>
              <TableHead>참가자</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  등록된 일정이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              schedules.map((schedule: any) => {
                const participantCount = schedule.interview_participants[0]?.count || 0;
                const isFull = participantCount >= schedule.max_participants;
                const isAvailable = new Date(schedule.date) >= new Date();
                
                return (
                  <TableRow key={schedule.id}>
                    <TableCell>
                      {format(new Date(schedule.date), 'yyyy년 MM월 dd일 (eee)', { locale: ko })}
                    </TableCell>
                    <TableCell>{schedule.time_slot}</TableCell>
                    <TableCell>{schedule.location}</TableCell>
                    <TableCell>
                      {participantCount}/{schedule.max_participants}명
                    </TableCell>
                    <TableCell>
                      {!isAvailable ? (
                        <Badge variant="outline" className="bg-gray-100">지난 일정</Badge>
                      ) : isFull ? (
                        <Badge variant="outline" className="bg-red-100 text-red-800">마감</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-100 text-green-800">예약 가능</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => onEdit(schedule)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteClick(schedule)}
                              disabled={participantCount > 0}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>인터뷰 일정 삭제</AlertDialogTitle>
                              <AlertDialogDescription>
                                이 인터뷰 일정을 정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>취소</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={confirmDelete}
                                className="bg-red-500 hover:bg-red-700"
                              >
                                삭제
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InterviewScheduleList;
