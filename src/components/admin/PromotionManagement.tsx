
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CouponManagement from "./promotions/CouponManagement";
import CouponDistribution from "./promotions/CouponDistribution";
import PromotionPopupManagement from "./promotions/PromotionPopupManagement";

const PromotionManagement = () => {
  const [activeTab, setActiveTab] = useState("coupons");

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">프로모션 관리</h2>
      </div>
      
      <Tabs defaultValue="coupons" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full md:w-[600px] grid-cols-3">
          <TabsTrigger value="coupons">쿠폰 관리</TabsTrigger>
          <TabsTrigger value="distribution">쿠폰 배포</TabsTrigger>
          <TabsTrigger value="popups">프로모션 팝업</TabsTrigger>
        </TabsList>
        
        <TabsContent value="coupons" className="mt-6">
          <CouponManagement />
        </TabsContent>
        
        <TabsContent value="distribution" className="mt-6">
          <CouponDistribution />
        </TabsContent>
        
        <TabsContent value="popups" className="mt-6">
          <PromotionPopupManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PromotionManagement;
