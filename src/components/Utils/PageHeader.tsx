
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  className?: string;
  rightElement?: React.ReactNode;
  hideBackButton?: boolean;
  backRoute?: string;
  showBackButton?: boolean;
}

/**
 * A reusable page header component with a back button and title
 * Used for consistent navigation headers throughout the app
 */
const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  onBack,
  className,
  rightElement,
  hideBackButton = false,
  backRoute,
  showBackButton = !hideBackButton,
}) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else if (backRoute) {
      navigate(backRoute);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={cn("sticky top-0 z-10 flex items-center py-4 px-5 backdrop-blur-xl bg-white/80 border-b border-white/30 shadow-sm", className)}>
      {showBackButton && (
        <button 
          onClick={handleBackClick} 
          className="p-2 mr-2 hover:bg-gray-100/50 rounded-full transition-colors"
          aria-label="뒤로 가기"
        >
          <ArrowLeft className="h-6 w-6 text-gray-700" />
        </button>
      )}
      <h1 className="text-xl font-semibold text-gray-800 flex-1">{title}</h1>
      {rightElement && (
        <div className="flex items-center">
          {rightElement}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
