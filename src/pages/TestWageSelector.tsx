
import React from 'react';
import { PageHeader } from '@/components/Utils';
import { WageSelector } from '@/components/cleaner/WageSelector';
import { useNavigate } from 'react-router-dom';
import { useReservation } from '@/contexts/ReservationContext';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';

const TestWageSelector = () => {
  const navigate = useNavigate();
  const { userData } = useUser();
  const { setReservationData } = useReservation();

  const handleBack = () => {
    navigate(-1);
  };

  const handleCleanerSelected = (cleanerId: string) => {
    setReservationData({ cleaner_id: cleanerId });
    navigate('/reservation/info');
  };

  const handleSkipSelection = () => {
    // Navigate to the next step without selecting a cleaner
    navigate('/reservation/info');
  };

  return (
    <div className="pb-16">
      <PageHeader title="시급 기반 필터" onBack={handleBack} rightElement={
        <Button
        variant="outline"
        className="w-full border-primary-user text-primary-user"
        onClick={handleSkipSelection}
      >
        건너뛰기
      </Button>} />
      <div className="p-4">
        <WageSelector onSelectCleaner={handleCleanerSelected} userId={userData?.user_id} />
      </div>
    </div>
  );
};

export default TestWageSelector;
