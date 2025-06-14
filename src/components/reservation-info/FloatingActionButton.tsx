
import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloatingActionButtonProps {
  scrollToBottom: () => void;
  className?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  scrollToBottom,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate when we're near the bottom of the page
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      
      // Hide button when we're close to the bottom (within 150px)
      setIsVisible(scrollPosition < fullHeight - windowHeight - 150);
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className='flex justify-center'>
    <Button
      onClick={scrollToBottom}
      className={`fixed bottom-24 z-20 rounded-full shadow-lg p-3 text-black bg-white hover:bg-[#00C8B0]/90 hover:text-white ${className}`}
      aria-label="Scroll to bottom"
    >
  유의사항을 꼭 확인해주세요!
      <ChevronDown className="w-6 h-6" />
    </Button>
    </div>
  );
};

export default FloatingActionButton;
