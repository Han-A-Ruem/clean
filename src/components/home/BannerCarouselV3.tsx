
import React, { useState, useEffect, useRef } from "react";
import { useNotices } from "@/hooks/useNotices";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface BannerCarouselV3Props {
  autoScroll?: boolean;
  interval?: number;
}

const gradients = [
  "bg-gradient-to-br from-blue-500/70 to-purple-600/70",
  "bg-gradient-to-br from-pink-500/70 to-orange-500/70",
  "bg-gradient-to-br from-green-500/70 to-teal-600/70",
  "bg-gradient-to-br from-yellow-500/70 to-red-500/70",
  "bg-gradient-to-br from-indigo-500/70 to-purple-600/70",
  "bg-gradient-to-br from-rose-500/70 to-pink-500/70",
  "bg-gradient-to-br from-emerald-500/70 to-blue-600/70",
  "bg-gradient-to-br from-amber-500/70 to-orange-500/70",
];

const BannerCarouselV3: React.FC<BannerCarouselV3Props> = ({ 
  autoScroll = true,
  interval = 5000 
}) => {
  const { notices, isLoading } = useNotices();
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: autoScroll,
    autoplaySpeed: interval,
    responsive: [
      {
        breakpoint: 768,
        settings: { 
          slidesToShow: 1, 
          slidesToScroll: 1, 
          infinite: true,
          autoplay: autoScroll,
          autoplaySpeed: interval,
          dots: false,
        }
      }
    ]
  };

  if (isLoading || notices.length === 0) {
    return (
      <div className="bg-gray-100/30 rounded-xl overflow-hidden relative h-48 animate-pulse backdrop-blur-lg border border-white/20 shadow-md">
        <div className="absolute inset-0 p-6 flex flex-col gap-4">
          <div className="h-4 bg-gray-200/50 rounded-full w-1/4 relative overflow-hidden backdrop-blur-sm">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1s_infinite] bg-gradient-to-r from-gray-200/50 via-gray-300/50 to-gray-200/50" />
          </div>
          <div className="h-8 bg-gray-200/50 rounded-full w-3/4 relative overflow-hidden backdrop-blur-sm">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1s_infinite] bg-gradient-to-r from-gray-200/50 via-gray-300/50 to-gray-200/50" />
          </div>
          <div className="h-4 bg-gray-200/50 rounded-full w-1/2 relative overflow-hidden backdrop-blur-sm">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1s_infinite] bg-gradient-to-r from-gray-200/50 via-gray-300/50 to-gray-200/50" />
          </div>
        </div>
      </div>
    );
  }

  return (
      <Slider ref={sliderRef} {...settings}>
        {notices.map((notice, index) => {
          const gradientClass = gradients[index % gradients.length];
          return (
            <div key={notice.id} className="h-48 w-full">
              <div className={`${gradientClass} w-full backdrop-blur-md bg-white/10 border border-white/30 rounded-xl shadow-lg p-6 h-full text-white transition-all duration-300 ease-in-out`}>
                <div className="text-white/90 text-sm font-medium mb-2">{notice.subtitle}</div>
                <h2 className="text-xl font-bold text-white mb-2 line-clamp-2">
                  {notice.title}
                </h2>
                <div className="text-white/80 text-sm mt-auto">{notice.date}</div>
              </div>
            </div>
          );
        })}
      </Slider>
  );
};

export default BannerCarouselV3;
