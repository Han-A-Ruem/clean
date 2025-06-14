
import React from "react";
import { Event } from "@/services/eventService";
import { useNavigate } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/more/events-detail?id=${event.id}`);
  };

  return (
    <div 
      className="rounded-xl overflow-hidden shadow-sm backdrop-blur-md bg-white/70 border border-white/40 mb-6 cursor-pointer transition-all hover:shadow-md"
      onClick={handleClick}
    >
      <div className="relative">
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
      <div className="p-4">
        <h3 className="font-bold text-lg">{event.title}</h3>
        <p className="text-gray-500 text-sm mt-2">{event.date_range}</p>
        <p className="text-gray-700 text-sm mt-1">{event.description}</p>
      </div>
    </div>
  );
};

export default EventCard;
