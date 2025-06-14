
import React, { useEffect, useState } from "react";
import { eventService, Event } from "@/services/eventService";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface EventListProps {
  refreshTrigger: number;
  onEdit: (event: Event) => void;
  onToggleStatus: (event: Event) => void;
  onDelete: (eventId: string) => void;
}

const EventList: React.FC<EventListProps> = ({ 
  refreshTrigger, 
  onEdit, 
  onToggleStatus, 
  onDelete 
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const data = await eventService.getEvents();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [refreshTrigger]);

  if (loading) {
    return <div className="text-center py-8">로딩 중...</div>;
  }

  if (events.length === 0) {
    return <div className="text-center py-8">등록된 이벤트가 없습니다.</div>;
  }

  // Helper function to display target audience in Korean
  const getTargetAudienceText = (audience?: string) => {
    switch (audience) {
      case 'cleaner':
        return '청소사';
      case 'customer':
        return '고객';
      case 'all':
      default:
        return '전체';
    }
  };

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">제목</TableHead>
            <TableHead>설명</TableHead>
            <TableHead>기간</TableHead>
            <TableHead>배지</TableHead>
            <TableHead>대상</TableHead>
            <TableHead className="w-[100px]">상태</TableHead>
            <TableHead className="text-right w-[150px]">관리</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="font-medium">{event.title}</TableCell>
              <TableCell>{event.description}</TableCell>
              <TableCell>{event.date_range}</TableCell>
              <TableCell>
                {event.badge ? (
                  <Badge variant="outline">{event.badge}</Badge>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {getTargetAudienceText(event.target_audience)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={event.is_active ? "default" : "secondary"}>
                  {event.is_active ? "활성" : "비활성"}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => onEdit(event)}
                  title="수정"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => onToggleStatus(event)}
                  title={event.is_active ? "비활성화" : "활성화"}
                >
                  {event.is_active ? (
                    <ToggleRight className="h-4 w-4" />
                  ) : (
                    <ToggleLeft className="h-4 w-4" />
                  )}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                      title="삭제"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>이벤트 삭제</AlertDialogTitle>
                      <AlertDialogDescription>
                        이 이벤트를 정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => onDelete(event.id)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        삭제
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default EventList;
