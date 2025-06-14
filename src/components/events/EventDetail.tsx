
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Event, eventService } from "@/services/eventService";
import { PageHeader } from "@/components/Utils";
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const EventDetail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  const eventId = searchParams.get("id");

  useEffect(() => {
    const fetchEventDetail = async () => {
      if (!eventId) {
        navigate("/events");
        return;
      }

      setLoading(true);
      try {
        const events = await eventService.getEvents();
        const foundEvent = events.find(e => e.id === eventId);
        
        if (foundEvent) {
          setEvent(foundEvent);
        } else {
          // If event not found, redirect back to events page
          navigate("/events");
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [eventId, navigate]);

  if (loading) {
    return (
      <div className="">
        <PageHeader title="이벤트 상세" />
        <div className="p-4 space-y-4">
          <Skeleton className="w-full h-64 rounded-lg" />
          <Skeleton className="w-3/4 h-8 rounded" />
          <Skeleton className="w-1/2 h-6 rounded" />
          <Skeleton className="w-full h-32 rounded" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="">
        <PageHeader title="이벤트 상세" className="backdrop-blur-lg bg-white/70 border-b border-white/30" />
        <div className="p-8 text-center">
          <p className="text-gray-500">이벤트를 찾을 수 없습니다.</p>
          <Button 
            variant="outline" 
            className="mt-4 backdrop-blur-sm bg-white/70 border border-white/40"
            onClick={() => navigate("/events")}
          >
            이벤트 목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <PageHeader title="이벤트 상세" className="backdrop-blur-lg bg-white/70 border-b border-white/30" />
      
      <div className="p-4">
        <div className="relative mb-6 overflow-hidden rounded-xl shadow-sm">
          <AspectRatio ratio={16/9}>
            <img 
              src={event.image_url || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000&auto=format&fit=crop"} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
          </AspectRatio>
          {event.badge && (
            <div className="absolute right-3 bottom-3 bg-[#00C8B0] text-white px-3 py-1 rounded-md text-sm font-medium">
              {event.badge}
            </div>
          )}
        </div>
        
        <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
        
        <div className="flex items-center text-gray-500 mb-6">
          <Calendar className="h-4 w-4 mr-1" />
          <span className="text-sm">{event.date_range}</span>
        </div>
        
        <div className="backdrop-blur-md bg-white/70 p-5 rounded-xl border border-white/40 shadow-sm mb-6">
          <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full backdrop-blur-sm bg-white/70 border border-white/40 hover:bg-white/90"
          onClick={() => navigate("/events")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          이벤트 목록으로 돌아가기
        </Button>
      </div>
    </div>
  );
};

export default EventDetail;
