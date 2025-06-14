import { useState } from "react";
import { Users, Briefcase, CalendarClock, Award, Gift, Bell, LogOut, Calendar, FileText, ShoppingBag, MessageSquare, LineChart, UserCheck } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";
import GlobalNotificationModal from "@/components/admin/notifications/GlobalNotificationModal";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { userData, user, loading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Extract the active section from the URL path
  const path = location.pathname.split('/');
  const activeSection = path[path.length - 1];

  if (loading) {
    // Following the loading state guidelines - using a shimmer effect
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-3xl">
          <div className="h-12 bg-gray-200 rounded-md mb-4 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-64 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="md:col-span-2 h-64 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!userData || userData.type !== 'admin') {
    return <Navigate to="/sign-in" replace />;
  }

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "로그아웃 되었습니다",
        description: "다음에 또 만나요!",
      });
      
      navigate("/sign-in");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "오류가 발생했습니다",
        description: error.message,
      });
    }
  };

  const menuItems = [
    { id: "users", label: "사용자 목록", icon: Users },
    { id: "cleaners", label: "청소 매니저 목록", icon: Briefcase },
    { id: "partners", label: "파트너 승인", icon: UserCheck },
    { id: "reservations", label: "예약 목록", icon: CalendarClock },
    { id: "insights", label: "인사이트", icon: LineChart },
    { id: "ranks", label: "등급 관리", icon: Award },
    { id: "promotions", label: "프로모션 관리", icon: Gift },
    { id: "events", label: "이벤트 관리", icon: Calendar },
    { id: "shop", label: "상품 관리", icon: ShoppingBag },
    { id: "schedule", label: "인터뷰", icon: CalendarClock},
    { id: "notifications", label: "알림 관리", icon: Bell },
    { id: "notices", label: "공지사항 관리", icon: FileText },
    { id: "inquiries", label: "문의 관리", icon: MessageSquare }
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <div className="w-full md:w-64 bg-white shadow-md md:min-h-screen">
        <div className="p-6">
          <h2 className="text-xl font-bold">관리자 대시보드</h2>
        </div>
        <nav className="flex md:block overflow-x-auto md:overflow-visible">
          <ul className="flex md:block w-full">
            {menuItems.map((item) => (
              <li key={item.id} className="flex-1 md:flex-none">
                {item.id === "notifications" ? (
                  <button
                    onClick={() => setModalOpen(true)}
                    className={`flex items-center justify-center md:justify-start w-full px-4 md:px-6 py-3 text-center md:text-left transition-colors ${
                      activeSection === item.id
                        ? "bg-primary text-primary-foreground"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="w-5 h-5 md:mr-3" />
                    <span className="hidden md:inline">{item.label}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      navigate(`/admin/${item.id}`);
                    }}
                    className={`flex items-center justify-center md:justify-start w-full px-4 md:px-6 py-3 text-center md:text-left transition-colors ${
                      activeSection === item.id
                        ? "bg-primary text-primary-foreground"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="w-5 h-5 md:mr-3" />
                    <span className="hidden md:inline">{item.label}</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 mt-auto">
          <Button 
            variant="destructive" 
            className="w-full flex items-center justify-center"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-2" />
            로그아웃
          </Button>
        </div>
      </div>
      <div className="flex-1 p-4 md:p-8">
        <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
          {/* Use Outlet to render the nested route components */}
          <Outlet />
        </div>
      </div>
      <GlobalNotificationModal 
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
};

export default Admin;
