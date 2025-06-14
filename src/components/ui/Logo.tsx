
import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | string;  // Allow any string for custom sizes
  type?: "user" | "cleaner";
}

const Logo: React.FC<LogoProps> = ({ className = "", size = "md", type = "user" }) => {
  // Size mapping with improved sizes for better emphasis
  const sizeClass = {
    sm: "h-8",
    md: "h-12",
    lg: "h-20",
  }[size] || size;

  // Select logo based on type
  const logoSrc = type === "cleaner" 
    ? "/lovable-uploads/dc41e4dc-0101-4de9-b4da-6f3753d9f749.png" 
    : "/lovable-uploads/2f99083b-304d-46aa-937b-fd85bff5fefc.png";

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative flex flex-col items-center">
        <div className={`rounded-xl`}>
          <img 
            src={logoSrc} 
            alt="BBEUL 바쯒깨" 
            className={`${sizeClass} object-contain rounded-xl`}
          />
        </div>
      </div>
    </div>
  );
};

export default Logo;
