
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import InterviewScheduleList from './InterviewScheduleList';
import InterviewScheduleForm from './InterviewScheduleForm';
import { PlusCircle } from 'lucide-react';

const InterviewManagement = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [editSchedule, setEditSchedule] = useState<any | null>(null);

  const handleAddNew = () => {
    setEditSchedule(null);
    setActiveTab('form');
  };

  const handleEdit = (schedule: any) => {
    setEditSchedule(schedule);
    setActiveTab('form');
  };

  const handleSaved = () => {
    setActiveTab('list');
    setEditSchedule(null);
  };

  const handleCancel = () => {
    setActiveTab('list');
    setEditSchedule(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">인터뷰 일정 관리</h2>
        {activeTab === 'list' && (
          <Button onClick={handleAddNew}>
            <PlusCircle className="h-4 w-4 mr-2" />
            일정 추가
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">일정 목록</TabsTrigger>
          <TabsTrigger value="form" disabled={activeTab === 'list'}>
            {editSchedule ? '일정 수정' : '일정 추가'}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <InterviewScheduleList onEdit={handleEdit} />
        </TabsContent>
        <TabsContent value="form">
          <InterviewScheduleForm 
            editSchedule={editSchedule} 
            onCancel={handleCancel} 
            onSaved={handleSaved} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InterviewManagement;
