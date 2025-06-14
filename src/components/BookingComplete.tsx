import { format } from "date-fns";
import { ClipboardCheck, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

interface BookingCompleteProps {
  date: Date | undefined;
  time: string;
  address: { street: string; detail: string };
  selectedDates?: Date[];
}

const BookingComplete = ({ date, time, address, selectedDates = [] }: BookingCompleteProps) => {
  const navigate = useNavigate();
  const hasMultipleDates = selectedDates && selectedDates.length > 1;
  
  const handleGoHome = () => {
    navigate('/');
  };

  const formatDate = (date: Date) => {
    return format(date, 'yy년 MM월 dd일 HH:mm');
  };
  
  return (
    <div className="text-center space-y-6 animate-fade-in">
      <div className="bg-white p-8 rounded-lg shadow-sm space-y-6">
        <div className="w-16 h-16 bg-user-theme/10 rounded-full flex items-center justify-center mx-auto">
          <ClipboardCheck className="w-8 h-8 text-user-theme" />
        </div>
        <h3 className="font-semibold text-xl">예약이 완료되었습니다</h3>
        
        {hasMultipleDates ? (
          <div className="text-muted-foreground space-y-2">
            <p>총 {selectedDates.length}개의 예약이 완료되었습니다</p>
            <ul className="text-sm">
              {selectedDates.slice(0, 3).map((date, index) => (
                <li key={index}>{formatDate(date)}</li>
              ))}
              {selectedDates.length > 3 && <li>외 {selectedDates.length - 3}개 더...</li>}
            </ul>
          </div>
        ) : (
          <p className="text-muted-foreground">
            {date && formatDate(date)}
          </p>
        )}
        
        {/* <div className="text-sm text-muted-foreground space-y-2">
          <p>{address.street}</p>
          <p>{address.detail}</p>
        </div> */}
        
        <Button 
          variant="outline" 
          onClick={handleGoHome}
          className="mt-6 w-full flex items-center justify-center gap-2 border-user-theme text-user-theme hover:bg-user-theme/5"
        >
          <Home className="w-4 h-4" />
          <span>홈으로 돌아가기</span>
        </Button>
      </div>
    </div>
  );
};

export default BookingComplete;
