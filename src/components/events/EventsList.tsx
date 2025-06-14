
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EventCard from "./EventCard";
import { eventService } from "@/services/eventService";
import { useUser } from "@/contexts/UserContext";

interface EventsListProps {
  type: "ongoing" | "ended";
}

const EventsList: React.FC<EventsListProps> = ({ type }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData: currentUser } = useUser();
  
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        let eventsList = [];
        
        if (type === "ongoing") {
          eventsList = await eventService.getActiveEvents();
        } else {
          eventsList = await eventService.getInactiveEvents();
        }
        
        // Filter events based on target audience and user type
        const filteredEvents = eventsList.filter(event => {
          // If no target_audience is specified or it's 'all', show to everyone
          if (!event.target_audience || event.target_audience === 'all') {
            return true;
          }
          
          // If user is not logged in, only show 'all' events
          if (!currentUser) {
            return false;
          }
          
          // If target is for cleaners and user is a cleaner
          if (event.target_audience === 'cleaner' && currentUser.type === 'cleaner') {
            return true;
          }
          
          // If target is for customers and user is a customer
          if (event.target_audience === 'customer' && currentUser.type === 'customer') {
            return true;
          }
          
          return false;
        });
        
        setEvents(filteredEvents);
      } catch (error) {
        console.error("Error loading events:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadEvents();
  }, [type, currentUser]);
  
  if (loading) {
    return <div className="py-10 text-center">이벤트를 불러오는 중...</div>;
  }
  
  if (events.length === 0) {
    return (
      <div className="py-10 text-center">
        {type === "ongoing" ? "진행 중인 이벤트가 없습니다." : "종료된 이벤트가 없습니다."}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 gap-4 py-4">
      {events.map((event) => (
        <Link key={event.id} to={`/events/${event.id}`}>
          <EventCard event={event} />
        </Link>
      ))}
    </div>
  );
};

export default EventsList;
