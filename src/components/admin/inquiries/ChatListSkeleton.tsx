
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ChatListSkeleton: React.FC = () => {
  return (
    <>
      {[1, 2, 3].map((index) => (
        <div key={index} className="p-4 bg-white shadow-sm rounded-lg mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Skeleton className="h-12 w-12 rounded-full mr-3" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
            <div className="flex flex-col items-end">
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ChatListSkeleton;
