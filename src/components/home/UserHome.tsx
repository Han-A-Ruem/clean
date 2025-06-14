import { useState } from "react";
import { 
  CalendarRange, CalendarCheck2, Droplets, 
  ShieldCheck, Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useReservation } from "@/contexts/ReservationContext";
import BannerCarouselV3 from "./BannerCarouselV3";
import DateCarousel from "./DateCarousel";
import ServiceCard from "./ServiceCard";

interface UserHomeProps {
  onServiceSelect?: (serviceType: string) => void;
}

export default function UserHome({ onServiceSelect }: UserHomeProps) {
  const navigate = useNavigate();
  let { setReservationData, setReservationType } = useReservation();

  const handleServiceClick = (serviceType: string) => {
    if (serviceType === "regular" || serviceType === "onetime") {
      // Set the service frequency type
      setReservationType(serviceType === "regular" ? "weekly" : "onetime");
      console.log('service', serviceType)

      setReservationData({'reservation_type': serviceType === "onetime" ? "onetime" : ""})
      // For standard and studio room, go directly to reservation page
      navigate('/reservation/address');
    } else if (onServiceSelect) {
      // For kitchen, bathroom, fridge, and custom, use the onServiceSelect callback
      onServiceSelect(serviceType);
    } else {
      // Fallback if onServiceSelect is not provided
      navigate('/reservation/address');
    }
  };

  // Otherwise show the regular home screen
  return (
    <div className="flex flex-col min-h-screen bg-gray-50/80 pb-24">
      {/* Header with Location - Glass morphism effect */}
      <div className="px-4 py-5 flex items-center bg-white/60 backdrop-blur-md border-b border-white/40 shadow-sm sticky top-0 z-10">
        <div className="flex-1 flex justify-center items-center">
          <h1 className="text-lg font-medium text-gray-800">금천구 독산동</h1>
        </div>
      </div>

      {/* Main Banner - Carousel */}
      <div className="px-4 mt-4 mb-5">
        <BannerCarouselV3 autoScroll={true} interval={5000} />
      </div>

      {/* Welcome message with glass effect */}
      <div className="px-5 mb-5 backdrop-blur-md bg-white/60 mx-4 p-4 rounded-xl border border-white/40 shadow-sm">
        <p className="text-xl font-semibold text-gray-800">안녕하세요!</p>
        <p className="text-base text-gray-600">오늘은 어떤 서비스가 필요하세요?</p>
      </div>

      {/* Date Selection Carousel */}
      <DateCarousel />

      {/* Service Cards - Main options */}
      <div className="px-4 space-y-4 mb-6">
        {/* Regular Cleaning */}
        <ServiceCard
          icon={<CalendarRange className="w-6 h-6 text-blue-600" />}
          title="매주 가사청소"
          description="꾸준한 관리로 청결하게"
          price={50000}
          recommended={true}
          iconBgColor="bg-blue-50"
          onClick={() => {
            setReservationData({ 'amount': 50000 })
            handleServiceClick("regular")
          }}
        />

        {/* One-time Cleaning */}
        <ServiceCard
          icon={<CalendarCheck2 className="w-6 h-6 text-rose-600" />}
          title="한번만 가사청소"
          description="필요할 때 깔끔하게"
          price={40000}
          iconBgColor="bg-rose-50"
          onClick={() => {
            setReservationData({ 'amount': 40000 })
            handleServiceClick("onetime")
          }}
        />
      </div>

      {/* Special services section - Glass morphism style */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">특별 서비스</h2>
        <div className="grid grid-cols-2 gap-3">
          {/* Kitchen service */}
          <div 
            onClick={() => onServiceSelect && onServiceSelect("kitchen")}
            className="backdrop-blur-sm bg-white/70 border border-white/40 rounded-xl p-4 flex flex-col shadow-sm hover:shadow-md transition-all hover:bg-white/80"
          >
            <div className="rounded-lg p-3 bg-green-50 w-fit mb-2 ring-1 ring-green-100">
              <Droplets className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-800">주방 청소</h3>
            <p className="text-xs text-gray-500 mb-2">깔끔한 주방 공간</p>
            <p className="text-base font-bold text-gray-900 mt-auto">80,000원</p>
          </div>
          
          {/* Toilet service */}
          <div
            onClick={() => onServiceSelect && onServiceSelect("toilet")}
            className="backdrop-blur-sm bg-white/70 border border-white/40 rounded-xl p-4 flex flex-col shadow-sm hover:shadow-md transition-all hover:bg-white/80"
          >
            <div className="rounded-lg p-3 bg-purple-50 w-fit mb-2 ring-1 ring-purple-100">
              <ShieldCheck className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-800">화장실 청소</h3>
            <p className="text-xs text-gray-500 mb-2">깨끗한 화장실</p>
            <p className="text-base font-bold text-gray-900 mt-auto">45,000원</p>
          </div>
        </div>
      </div>

      {/* Custom Service - Glass morphism style */}
      <div className="px-4 mb-6">
        <div
          onClick={() => navigate('/reservation/custom')}
          className="backdrop-blur-md bg-white/70 rounded-xl p-4 flex items-center justify-between shadow-sm border border-white/40 hover:shadow-md transition-all hover:bg-white/80"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg p-3 bg-gray-50 ring-1 ring-gray-200">
              <Settings className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">맞춤형 청소</h3>
              <p className="text-sm text-gray-500">필요한 부분만 골라서</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-theme text-white rounded-lg text-sm font-medium hover:opacity-90 transition-colors shadow-sm">
            시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
