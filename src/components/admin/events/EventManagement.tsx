
import React, { useState } from "react";
import EventList from "./EventList";
import EventForm from "./EventForm";
import { useToast } from "@/components/ui/use-toast";
import { Event, eventService } from "@/services/eventService";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const EventManagement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { toast } = useToast();

  const handleAddEvent = () => {
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingEvent(null);
  };

  const refreshEvents = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSaveEvent = async (event: Partial<Event>) => {
    try {
      if (editingEvent) {
        // Update existing event
        await eventService.updateEvent(editingEvent.id, event);
        toast({
          title: "이벤트가 업데이트되었습니다",
          description: "이벤트 정보가 성공적으로 업데이트되었습니다.",
        });
      } else {
        // Create new event
        await eventService.createEvent(event);
        toast({
          title: "이벤트가 생성되었습니다",
          description: "새 이벤트가 성공적으로 생성되었습니다.",
        });
      }
      handleCloseForm();
      refreshEvents();
    } catch (error) {
      console.error("Error saving event:", error);
      toast({
        variant: "destructive",
        title: "오류가 발생했습니다",
        description: "이벤트를 저장하는 중 문제가 발생했습니다.",
      });
    }
  };

  const handleToggleStatus = async (event: Event) => {
    try {
      await eventService.updateEvent(event.id, {
        is_active: !event.is_active
      });
      toast({
        title: "이벤트 상태가 변경되었습니다",
        description: `이벤트가 ${!event.is_active ? "활성화" : "비활성화"}되었습니다.`,
      });
      refreshEvents();
    } catch (error) {
      console.error("Error toggling event status:", error);
      toast({
        variant: "destructive",
        title: "오류가 발생했습니다",
        description: "이벤트 상태를 변경하는 중 문제가 발생했습니다.",
      });
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await eventService.deleteEvent(eventId);
      toast({
        title: "이벤트가 삭제되었습니다",
        description: "이벤트가 성공적으로 삭제되었습니다.",
      });
      refreshEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        variant: "destructive",
        title: "오류가 발생했습니다",
        description: "이벤트를 삭제하는 중 문제가 발생했습니다.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">이벤트 관리</h2>
        <Button 
          onClick={handleAddEvent} 
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          새 이벤트 추가
        </Button>
      </div>

      {isFormOpen ? (
        <EventForm
          event={editingEvent}
          onSave={handleSaveEvent}
          onCancel={handleCloseForm}
        />
      ) : (
        <EventList
          refreshTrigger={refreshTrigger}
          onEdit={handleEditEvent}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDeleteEvent}
        />
      )}
    </div>
  );
};

export default EventManagement;
