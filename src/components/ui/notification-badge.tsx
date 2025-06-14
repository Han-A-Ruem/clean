
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NotificationBadgeProps {
  count: number;
  className?: string;
}

export function NotificationBadge({ count, className }: NotificationBadgeProps) {
  if (count <= 0) return null;
  
  return (
    <Badge 
      className={cn(
        "bg-red-500 text-white text-xs px-1.5 py-0.5 absolute -top-1 -right-1 min-w-[1.2rem] flex items-center justify-center rounded-full", 
        className
      )}
    >
      {count > 99 ? "99+" : count}
    </Badge>
  );
}
