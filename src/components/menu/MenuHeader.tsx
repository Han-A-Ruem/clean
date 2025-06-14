
import React from "react";
import { ChevronRight, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const MenuHeader = () => {
  return (
    <div className="p-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">한아름 매니저님</h1>
        <div className="flex items-center mt-2 text-gray-500">
          <div className="bg-amber-400 w-6 h-6 rounded-full flex items-center justify-center text-white mr-2">
            1
          </div>
          든든 멤버십 1단계 <ChevronRight className="w-4 h-4 ml-1" />
        </div>
      </div>
      <div className="flex items-center flex-col">
        <div className="relative flex flex-col items-center px-5">
          <UserCircle className="w-20 h-20"/> 
          <Button variant="outline" className="absolute top-14 rounded-full text-sm">
            <span className="mr-1">✏️</span> 내 정보
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MenuHeader;
