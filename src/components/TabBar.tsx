
import { useUser } from "@/contexts/UserContext";
import { Bell, Calendar, Clock7, Home, MessageCircle, ShoppingCart, FileText, Gift, Menu, Search } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

const TabBar = () => {
  const location = useLocation();
  const { user, userData, loading } = useUser();
  const navigate = useNavigate();

  // Determine theme class based on user type
  const themeClass = userData?.type === 'cleaner' ? 'cleaner-theme' : 'user-theme';

  const userTabs = [
    {
      icon: Home,
      label: "홈",
      path: "/",
    },
    {
      icon: FileText,
      label: "내 예약",
      path: "/bookings",
    },
    {
      icon: Gift,
      label: "플러스샵",
      path: "/shop",
    },
    {
      icon: Menu,
      label: "더보기",
      path: "/more",
    },
  ];

  const cleanerTabs = [
    {
      icon: Clock7,
      label: "알리미",
      path: "/",
    },
    {
      icon: Search,
      label: "예약",
      path: "/Search",
    },
    {
      icon: Calendar,
      label: "스케줄",
      path: "/schedule",
    },
    {
      icon: ({ className }: { className?: string }) => (
        <div className="relative">
          <Bell className={className} />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center">
            N
          </div>
        </div>
      ),
      label: "공지",
      path: "/notifications",
    },
    {
      icon: Menu,
      label: "메뉴",
      path: "/menu",
    },
  ];
  
  // If loading, show a skeleton loader instead of actual tabs
  if (loading) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="backdrop-blur-xl bg-white/80 border-t border-white/30 h-16 shadow-xl">
          <div className="flex justify-around items-center h-full">
            {Array(5).fill(0).map((_, index) => (
              <div key={index} className="flex flex-col items-center space-y-1 flex-1 py-2">
                <Skeleton className="w-5 h-5 rounded-full" />
                <Skeleton className="w-10 h-3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  const tabs = userData?.type === 'cleaner' ? cleanerTabs : userTabs;
  
  // Get theme color based on user type
  const themeColor = userData?.type === 'cleaner' ? 'var(--cleaner-theme)' : 'var(--user-theme)';

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 ${themeClass}`}>
      <div className="backdrop-blur-xl bg-white/80 border-t border-white/40 h-16 shadow-xl">
        <div className="flex justify-around items-center h-full">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`flex flex-col items-center space-y-1 flex-1 py-2 ${
                  isActive ? "text-theme" : "text-gray-400"
                } transition-all duration-300 hover:text-gray-700`}
                style={{ color: isActive ? themeColor : '' }}
              >
                  <tab.icon className={`w-6 h-6 ${isActive ? 'drop-shadow-md' : ''}`} />
                <span className={`text-xs ${isActive ? 'font-bold' : 'font-medium'}`}>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {userData?.type === "cleaner" && location.pathname !== "/notifications" && location.pathname !== "/menu" && (
        <div className="fixed bottom-20 right-4 z-10">
          <Button 
            variant="outline" 
            className="rounded-full backdrop-blur-xl bg-white/90 shadow-lg px-4 py-2 hover:shadow-xl transition-all border border-white/40 hover:bg-white/95" 
            onClick={()=> navigate('/menu/chat')}
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            채팅
          </Button>
        </div>
      )}
    </div>
  );
};

export default TabBar;
