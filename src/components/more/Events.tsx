
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../Utils';
import { eventData } from '@/data/eventData';

const Events = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container pb-20">
      <PageHeader title='이벤트' />
      <div className="p-4">
        <div className="space-y-6">
          {eventData.map((event) => (
            <div key={event.id} className="border rounded-xl overflow-hidden shadow-sm backdrop-blur-md bg-white/70 border-white/40 transition-all hover:shadow-md">
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-48 object-cover" 
              />
              <div className="p-4">
                <h3 className="font-medium text-lg">{event.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{event.dateRange}</p>
                <p className="text-sm">{event.description}</p>
                {event.badge && (
                  <span className="inline-block mt-2 bg-[#00C8B0]/10 text-[#00C8B0] px-2 py-1 rounded-md text-xs font-medium">
                    {event.badge}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
