import { Button } from "@/components/ui/button";
import { 
  Award, 
  ChevronRight, 
  CircleDollarSign, 
  FileText, 
  Gift, 
  Heart, 
  Home, 
  Info, 
  Medal, 
  MessageSquareQuote, 
  Phone, 
  PhoneOutgoing, 
  Settings, 
  Shield, 
  ShoppingBag, 
  Smile, 
  Star, 
  ThumbsUp, 
  Trophy, 
  User, 
  UserCircle, 
  Wallet, 
  Zap,
  Terminal
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { userInfo } from "os";
import { useUser } from "@/contexts/UserContext";

const promotions = [
  {
    id: 1,
    title: "연 240만원! 청년 상생지원금",
    description: "업무시간 누적 달성 시 누구나 도전!",
    icon: <Gift className="w-16 h-16" />,
  },
  {
    id: 2,
    title: "최고의 청소 매니저",
    description: "매달 최고의 청소 매니저에게 특별 보너스!",
    icon: <Star className="w-16 h-16" />,
  },
  {
    id: 3,
    title: "연말 특별 보너스",
    description: "연말까지 업무시간 누적 달성 시 특별 보너스!",
    icon: <Trophy className="w-16 h-16" />,
  },
  {
    id: 4,
    title: "우수 청소 매니저",
    description: "우수 청소 매니저에게 특별 보너스!",
    icon: <Award className="w-16 h-16" />,
  },
  {
    id: 5,
    title: "고객 만족도 1위",
    description: "고객 만족도 1위 매니저에게 특별 보너스!",
    icon: <Heart className="w-16 h-16" />,
  },
  {
    id: 6,
    title: "안전 청소 매니저",
    description: "안전 청소 매니저에게 특별 보너스!",
    icon: <Shield className="w-16 h-16" />,
  },
  {
    id: 7,
    title: "최고의 서비스",
    description: "최고의 서비스 매니저에게 특별 보너스!",
    icon: <Medal className="w-16 h-16" />,
  },
  {
    id: 8,
    title: "고객 추천 매니저",
    description: "고객 추천 매니저에게 특별 보너스!",
    icon: <ThumbsUp className="w-16 h-16" />,
  },
  {
    id: 9,
    title: "행복 청소 매니저",
    description: "행복 청소 매니저에게 특별 보너스!",
    icon: <Smile className="w-16 h-16" />,
  },
  {
    id: 10,
    title: "에너지 청소 매니저",
    description: "에너지 청소 매니저에게 특별 보너스!",
    icon: <Zap className="w-16 h-16" />,
  },
];



const Menu = () => {
  const [currentPromotion, setCurrentPromotion] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userData} = useUser();

  const handleIndicatorClick = (index: number) => {
    setCurrentPromotion(index);
    
    if (scrollContainerRef.current) {
      const scrollElement = scrollContainerRef.current;
      const cardWidth = scrollElement.scrollWidth / promotions.length;
      scrollElement.scrollTo({
        left: cardWidth * index,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollElement = scrollContainerRef.current;
      const cardWidth = scrollElement.scrollWidth / promotions.length;
      const scrollPosition = scrollElement.scrollLeft;
      const newIndex = Math.round(scrollPosition / cardWidth);
      
      if (newIndex !== currentPromotion && newIndex >= 0 && newIndex < promotions.length) {
        setCurrentPromotion(newIndex);
      }
    }
  };

  useEffect(() => {
    const scrollElement = scrollContainerRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className="pb-20">
      <div className="p-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{userData?.name} 매니저님</h1>
          <div className="flex items-center mt-2 text-gray-500">
            <div className="bg-amber-400 w-6 h-6 rounded-full flex items-center justify-center text-white mr-2">
              1
            </div>
            든든 멤버십 1단계 <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>
        <div className="flex items-center flex-col">
          <div className="relative flex flex-col items-center px-5">
            {userData?.profile_photo ? (
              <img src={userData.profile_photo} alt="profile" className="w-20 h-20 rounded-full object-cover" />
            ) : (
              <UserCircle className="w-20 h-20"/>
            )}
            <Button variant="outline" className="absolute top-14 rounded-full text-sm" onClick={() => navigate("/menu/myinfo")}>
            <span className="mr-1">✏️</span> 내 정보
          </Button>
         </div>
        </div>
      </div>

      <div className="grid grid-cols-4 py-6 px-4 gap-4">
        {/* <button 
          onClick={() => navigate("/menu/settlement")}
          className="flex flex-col items-center p-3 rounded-xl transition-all duration-200 border border-transparent hover:bg-gray-50 hover:border-primary-cleaner"
        >
          <div className="w-12 h-12 rounded-full border flex items-center justify-center mb-2">
            <CircleDollarSign className="w-6 h-6" />
          </div>
          <span className="text-sm">정산 내역</span>
        </button>
        <button 
          onClick={() => navigate("/menu/reviews")}
          className="flex flex-col items-center p-3 rounded-xl transition-all duration-200 border border-transparent hover:bg-gray-50 hover:border-primary-cleaner"
        >
          <div className="w-12 h-12 rounded-full border flex items-center justify-center mb-2">
            <Star className="w-6 h-6" />
          </div>
          <span className="text-sm">고객 후기</span>
        </button>
        <button 
          onClick={() => navigate("/shop")}
          className="flex flex-col items-center p-3 rounded-xl transition-all duration-200 border border-transparent hover:bg-gray-50 hover:border-primary-cleaner"
        >
          <div className="w-12 h-12 rounded-full border flex items-center justify-center mb-2">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <span className="text-sm">특가몰</span>
        </button>
        <button 
          onClick={() => navigate("/menu/customer-support")}
          className="flex flex-col items-center p-3 rounded-xl transition-all duration-200 border border-transparent hover:bg-gray-50 hover:border-primary-cleaner"
        >
          <div className="w-12 h-12 rounded-full border flex items-center justify-center mb-2">
            <PhoneOutgoing className="w-6 h-6" />
          </div>
          <span className="text-sm">상담 문의</span>
        </button> */}
      </div>

      <div className="h-3 bg-gray-100">
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <button className="flex items-center" onClick={() => navigate("/menu/info")}>
            <h2 className="text-lg font-bold">리워드 캐시</h2>
            <div className="ml-1 w-5 h-5 rounded-full border flex items-center justify-center text-sm">?</div>
          </button>
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/menu/info")}
          >
            <span className="font-bold">1,000캐시</span>
            <ChevronRight className="w-5 h-5 ml-1" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-xs">지원금</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold">업무시간 누적 목표 달성</h3>
              <p className="text-gray-600">상생지원금 지원</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-xs">혜택</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold">고객님께 키트 전달하면</h3>
              <p className="text-gray-600">1,000캐시+추가보상</p>
            </div>
          </div>
        </div>

        <button 
          className="w-full text-center py-4 text-gray-600"
          onClick={() => navigate("/menu/info")}
        >
          미션 더보기 <ChevronRight className="inline-block w-4 h-4" />
        </button>
      </div>

      <div className="h-3 bg-gray-100 mb-4">
      </div>
      
      <div className="px-4 space-y-6">
        <MenuCategory title="내 정보">
          <MenuItem 
            icon={<Trophy className="w-5 h-5" />} 
            label="내 등급" 
            onClick={() => navigate("/menu/myrank")}
          />
          <MenuItem 
            icon={<User className="w-5 h-5" />} 
            label="내 정보" 
            onClick={() => navigate("/menu/myinfo")}
          />
          <MenuItem 
            icon={<Settings className="w-5 h-5" />} 
            label="계정 관리" 
            onClick={() => navigate("/menu/account")}
          />
        </MenuCategory>
        </div>
        <div className="h-3 bg-gray-100 mb-4">
        </div>
        <div className="px-4 space-y-6">
        <MenuCategory title="활동 정보">
          {/* <MenuItem 
            icon={<Home className="w-5 h-5" />} 
            label="활동 안내" 
            onClick={() => navigate("/menu/activity-guide")}
          /> */}
          <MenuItem 
            icon={<Gift className="w-5 h-5" />} 
            label="등급별 혜택" 
            onClick={() => navigate("/menu/benefits")}
          />
          {/* <MenuItem 
            icon={<Star className="w-5 h-5" />} 
            label="고객 후기" 
            onClick={() => navigate("/menu/reviews")}
          /> */}
          {/* <MenuItem 
            icon={<Wallet className="w-5 h-5" />} 
            label="정산 내역" 
            onClick={() => navigate("/menu/settlement")}
          /> */}
          {/* <MenuItem 
            icon={<CircleDollarSign className="w-5 h-5" />} 
            label="수입 추적" 
            onClick={() => navigate("/menu/payment-tracking")}
          /> */}
        </MenuCategory>
        </div>
        <div className="h-3 bg-gray-100 mb-4">
        </div>
        <div className="px-4 space-y-6">
        <MenuCategory title="지원 및 정책">
          {/* <MenuItem 
            icon={<Phone className="w-5 h-5" />} 
            label="고객 지원" 
            onClick={() => navigate("/menu/customer-support")}
          /> */}
          {/* <MenuItem 
            icon={<FileText className="w-5 h-5" />} 
            label="정책 및 앱 정보" 
            onClick={() => navigate("/menu/policy")}
          /> */}
          {/* <MenuItem 
            icon={<Info className="w-5 h-5" />} 
            label="이용 안내" 
            onClick={() => navigate("/menu/usage-guide")}
          /> */}
          <MenuItem 
            icon={<MessageSquareQuote className="w-5 h-5" />} 
            label="1:1 문의" 
            onClick={() => navigate("/menu/inquiry")}
          />
          <MenuItem 
            icon={<FileText className="w-5 h-5" />} 
            label="약관 및 정책" 
            onClick={() => navigate("/menu/terms-policies")}
          />
        </MenuCategory>
        {/* </div>
            <div className="h-3 bg-gray-100 mb-4"></div>
            <div className="px-4 space-y-6">
              <MenuCategory title="개발자 도구">
                <MenuItem 
                  icon={<Terminal className="w-5 h-5" />} 
                  label="네이티브 기능 테스트" 
                  onClick={() => navigate("/menu/test")}
                />
              </MenuCategory> */}
            </div>
    </div>
  );
};

const MenuCategory = ({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="space-y-2">
      <h2 className="font-bold text-lg">{title}</h2>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
};

const MenuItem = ({
  icon,
  label,
  rightLabel,
  onClick
}: {
  icon: React.ReactNode;
  label: string;
  rightLabel?: string;
  onClick?: () => void;
}) => {
  const navigate = useNavigate();
  
  return (
    <button 
      className="w-full flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-50"
      onClick={onClick}
    >
      <div className="flex items-center">
        {icon}
        <span className="ml-3">{label}</span>
      </div>
      <div className="flex items-center">
        {rightLabel && (
          <span className="text-[#00C8B0] mr-2">{rightLabel}</span>
        )}
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </button>
  );
};

export default Menu;
