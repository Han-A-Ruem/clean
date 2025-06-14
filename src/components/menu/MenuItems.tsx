
import React from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const MenuCategory = ({
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

export const MenuItem = ({
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
        <ChevronRight className="w-5 w-5 text-gray-400" />
      </div>
    </button>
  );
};
