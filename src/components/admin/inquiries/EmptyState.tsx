
import React from 'react';
import { MessageSquare } from 'lucide-react';

interface EmptyStateProps {
  type: 'all' | 'unread';
}

const EmptyState: React.FC<EmptyStateProps> = ({ type }) => {
  return (
    <div className="text-center py-8">
      <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
      <h3 className="text-lg font-semibold mb-2">
        {type === 'unread' ? 'No unread inquiries' : 'No inquiries found'}
      </h3>
      <p className="text-gray-500">
        {type === 'unread' 
          ? "You've caught up with all customer inquiries!" 
          : "When customers send inquiries, they will appear here."
        }
      </p>
    </div>
  );
};

export default EmptyState;
