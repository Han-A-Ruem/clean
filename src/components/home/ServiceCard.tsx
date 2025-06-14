
import React from "react";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  price?: string | number;
  recommended?: boolean;
  iconBgColor?: string;
  onClick: () => void;
  buttonText?: string;
  buttonColor?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
  price,
  recommended = false,
  iconBgColor = "bg-blue-50",
  onClick,
  buttonText = "예약하기",
  buttonColor = "bg-primary"
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-4 flex items-start justify-between shadow-sm border border-gray-100 cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div className={`rounded-lg p-3 ${iconBgColor}`}>
          {icon}
        </div>
        <div>
          <div className="flex items-center mb-1">
            <h3 className="font-semibold text-gray-800">{title}</h3>
            {recommended && (
              <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                추천
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">{description}</p>
          {price && <p className="text-lg font-bold text-gray-900 mt-2">{typeof price === 'number' ? `${price.toLocaleString()}원` : price}</p>}
        </div>
      </div>
      <button className={`px-4 py-2 ${buttonColor} text-white rounded-lg text-sm font-medium`}>
        {buttonText}
      </button>
    </div>
  );
};

export default ServiceCard;
