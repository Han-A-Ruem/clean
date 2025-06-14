
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import EventsList from "@/components/events/EventsList";
import { PageHeader } from "@/components/Utils";

const Events = () => {
  const [activeTab, setActiveTab] = useState("ongoing");

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="이벤트"/>
      <Tabs defaultValue="ongoing" className="w-full pt-4" onValueChange={setActiveTab}>
        <TabsList className="w-full flex mb-4 border-b">
          <TabsTrigger 
            value="ongoing" 
            className="flex-1 py-3 border-b-2 border-transparent data-[state=active]:border-[#00C8B0] data-[state=active]:text-[#00C8B0] rounded-none"
          >
            진행 이벤트
          </TabsTrigger>
          <TabsTrigger 
            value="ended" 
            className="flex-1 py-3 border-b-2 border-transparent data-[state=active]:border-[#00C8B0] data-[state=active]:text-[#00C8B0] rounded-none"
          >
            종료 이벤트
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ongoing" className="mt-0 container px-4">
          <EventsList type="ongoing" />
        </TabsContent>
        
        <TabsContent value="ended" className="mt-0 container px-4">
          <EventsList type="ended" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Events;
