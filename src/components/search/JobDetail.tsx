
import { ArrowLeft, Building2, Clock, MapPin, Maximize2, Baby, Cat, ParkingCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { getDateString } from "@/components/home/DateUtils";
import { useChat } from "@/hooks/useChat";


interface Address {
  address?: string | null;
  area?: string | null;
  id?: string | null;
  name?: string | null;
  user?: string |null;
}
interface JobDetailData {
  id: string;
  date: string | string[] | null;
  time: string | null;
  address: Address | null;
  type: string | null;
  amount: number | null;
  duration?: number | null;
  pet: string | null;
  infant: boolean | null;
  parking: string | null;
  days: string[] | null;
  user?: string | null; // Added user property
}

const JobDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { createChat } = useChat();
  const [isChecked, setIsChecked] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [jobData, setJobData] = useState<JobDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acceptingJob, setAcceptingJob] = useState(false);

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('reservations')
          .select(`
            *,
            address:address (*)
          `) 
          .eq('id', id)
          .single();
    
        if (error || !data) {
          console.error('Error fetching job details:', error);
          setError('직업 세부정보를 로드할 수 없습니다');
          return;
        }
    
        console.log({ msg: 'data', data });
    
        // Ensure the address object is properly structured
        const jobDetail: JobDetailData = {
          id: data.id,
          date: data.date ?? null,
          time: data.time ?? null,
          address: (data?.address as unknown as Address) || null,
          type: data.type ?? null,
          amount: data.amount ?? null,
          duration: Number(data.duration) ?? null,
          pet: data.pet ?? null,
          infant: data.infant ?? null,
          parking: data.parking ?? null,
          days: data.days ?? null,
          user: data.user ?? null, // Include the user ID
        };
    
        setJobData(jobDetail);
      } catch (err) {
        console.error('Error in job detail fetch:', err);
        setError('서버 오류가 발생했습니다');
      } finally {
        setLoading(false);
      }
    };
    

    if (id) {
      fetchJobDetail();
    }
  }, [id]);

  const handleAccept = async () => {
    try {
      setAcceptingJob(true);
      // Get the current authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "인증 오류",
          description: "로그인이 필요합니다.",
        });
        return;
      }
      
      // Update the reservation record with the cleaner's ID
      const { error, data } = await supabase
        .from('reservations')
        .update({ cleaner_id: user.id })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error updating reservation:', error);
        toast({
          variant: "destructive",
          title: "오류 발생",
          description: "업무를 수락하는 중 문제가 발생했습니다.",
        });
        return;
      }

      // Invalidate the cleaner-reservations query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['cleaner-reservations'] });
      
      // Create a chat if customer's user ID exists
      if (jobData?.user && user.id) {
        try {
          const chatId = await createChat(user.id, id || null);
          console.log("Chat created for job:", chatId);
        } catch (chatError) {
          console.error("Error creating chat:", chatError);
          // Don't throw the error here, as we don't want to fail the job acceptance
        }
      }
      
      setShowConfirmation(true);
    } catch (error) {
      console.error('Error accepting job:', error);
      toast({
        variant: "destructive",
        title: "오류 발생",
        description: "업무를 수락하는 중 문제가 발생했습니다.",
      });
    } finally {
      setAcceptingJob(false);
    }
  };

  // Format date to day of week (Monday, Wednesday, Friday)
  const formatDaysOfWeek = (date: string | string[] | null) => {
    if (!date || date.length === 0) return "매주 월, 수, 금"; // Default fallback
  
    // Days mapping for both English & Korean input
    const daysMap: Record<string, string> = {
      "mon": "월", "월": "월",
      "tue": "화", "화": "화",
      "wed": "수", "수": "수",
      "thu": "목", "목": "목",
      "fri": "금", "금": "금",
      "sat": "토", "토": "토",
      "sun": "일", "일": "일",
    };
  
    // Ensure date is an array
    const daysArray = Array.isArray(date) ? date : [date];
  
    // Convert and join days
    const formattedDays = daysArray
      .map(day => daysMap[day.toLowerCase()] || day) // Fallback for unknown values
      .join(", ");
  
    return `매주 ${formattedDays}`;
  };
  
  

  // Format time range
  const formatTimeRange = (time: string | null, hours: number | null) => {
    if (!time) return "오전 10:00~오후 3:00(5시간)";
    
    try {
      const [hour, minute] = time.split(':').map(Number);
      const startTime = hour < 12 ? `오전 ${hour}:${minute.toString().padStart(2, '0')}` : 
                                    `오후 ${hour === 12 ? 12 : hour - 12}:${minute.toString().padStart(2, '0')}`;
      
      const endHour = hour + (hours || 5);
      const period2 = endHour >= 12 ? "오후" : "오전";
      const displayHour2 = endHour > 12 ? endHour - 12 : endHour;
      
      return `${startTime}~${period2} ${displayHour2}:${minute.toString().padStart(2, '0')}(${hours || 5}시간)`;
    } catch (e) {
      return "오전 10:00~오후 3:00(5시간)";
    }
  };

  // Format start date
  const formatStartDate = (date: string | string[] | null) => {
    if (!date) return "2.10(월)부터 시작";
    
    try {
      const dateStr = getDateString(date);
      const dateObj = new Date(dateStr);
      const month = dateObj.getMonth() + 1;
      const day = dateObj.getDate();
      
      // Get day of week in Korean
      const daysInKorean = ["일", "월", "화", "수", "목", "금", "토"];
      const dayOfWeek = daysInKorean[dateObj.getDay()];
      
      return `${month}.${day}(${dayOfWeek})부터 시작`;
    } catch (e) {
      return "2.10(월)부터 시작";
    }
  };

  // Format address
  const formatAddress = (address: string | null) => {
    if (!address) return { city: "경기도 수원시 권선구", street: "서수원로53번길 25-39", district: "(오목천동)" };
    
    // This is a simplified implementation. In a real app, you'd parse the address properly
    const parts = address.split(' ');
    
    if (parts.length >= 3) {
      return {
        city: `${parts[0]} ${parts[1]}`,
        street: parts.slice(2, parts.length - 1).join(' '),
        district: `(${parts[parts.length - 1]})`
      };
    }
    
    return { city: "경기도 수원시 권선구", street: "서수원로53번길 25-39", district: "(오목천동)" };
  };

  // Format amount
  const formatAmount = (amount: number | null) => {
    if (!amount) return { base: "61,500원", task: "50,000원", region: "11,500원", total: "61,500원" };
    
    const formattedTotal = amount.toLocaleString() + "원";
    const taskAmount = Math.floor(amount * 0.8); // Example: 80% for task
    const regionAmount = amount - taskAmount; // Example: 20% for region
    
    return {
      base: formattedTotal,
      task: taskAmount.toLocaleString() + "원",
      region: regionAmount.toLocaleString() + "원",
      total: formattedTotal
    };
  };

  // Get pet status display
  const getPetStatus = (pet: string | null) => {
    if (!pet || pet === 'none') return "반려동물 없음";
    return `${pet === 'dog' ? '강아지' : pet === 'cat' ? '고양이' : '반려동물'} 있음`;
  };

  // Get infant status display
  const getInfantStatus = (infant: boolean | null) => {
    return infant ? "영유아 있음" : "영유아 없음";
  };

  // Get parking status display
  const getParkingStatus = (parking: string | null) => {
    if (!parking || parking === 'imposible') return "주차 불가능";
    return "주차 가능";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 space-y-6">
        <div className="p-4 flex items-center justify-between bg-white">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-48 w-full" />
        <div className="bg-white p-4 space-y-6">
          <div className="space-y-2">
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16 rounded-full" />
              <Skeleton className="h-8 w-16 rounded-full" />
            </div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-6 w-40" />
          </div>
          <Skeleton className="h-0.5 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-40 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={() => navigate(-1)}>돌아가기</Button>
      </div>
    );
  }

  // Extract formatted data
  const daysOfWeek = formatDaysOfWeek(jobData?.days);
  const timeRange = formatTimeRange(jobData?.time, jobData?.duration);
  const startDate = formatStartDate(jobData?.date);
  const address = formatAddress(jobData?.address.address);
  const amounts = formatAmount(jobData?.amount);
  const petStatus = getPetStatus(jobData?.pet);
  const infantStatus = getInfantStatus(jobData?.infant);
  const parkingStatus = getParkingStatus(jobData?.parking);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="p-4 flex items-center justify-between bg-white">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="text-[#00B5B4]">55명이 보는 중</span>
      </div>

      {/* Map Section */}
      <div className="bg-gray-200 h-48 relative">
        {/* Map will be integrated here */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          <button className="bg-white rounded-full px-6 py-2 flex items-center gap-2">
            <span>길찾기</span>
          </button>
          <button className="bg-white rounded-full px-6 py-2 flex items-center gap-2">
            <span>지도보기</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 bg-white space-y-6">
        <div className="space-y-2">
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
              {jobData?.type || '가정'}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">정기</span>
          </div>
          <h1 className="text-2xl font-bold">{daysOfWeek}</h1>
          <p className="text-gray-600">{timeRange}</p>
          <p className="text-gray-600">{startDate}</p>
        </div>
        <div className="w-full h-0.5 bg-gray-100"></div>

        <div className="space-y-2">
          <p className="text-gray-700">민*숙고객님(첫 방문)</p>
          <p className="text-gray-600">{address.city}</p>
          <p className="text-gray-600">{address.street}</p>
          <p className="text-gray-600">{address.district}</p>
        </div>

        {/* Info Grid */}
        <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-3 gap-4 px-4 border">
          <div className="text-center">
            <Maximize2 className="w-6 h-6 mx-auto mb-2" />
            <p>{jobData.address.area}평</p>
          </div>
          <div className="text-center">
            <Clock className="w-6 h-6 mx-auto mb-2" />
            <p>{jobData?.duration || 5}시간</p>
          </div>
          <div className="text-center">
            <ParkingCircle className="w-6 h-6 mx-auto mb-2" />
            <p className="text-gray-400">{parkingStatus}</p>
          </div>
          <div className="text-center">
            <Baby className="w-6 h-6 mx-auto mb-2" />
            <p className="text-gray-400">{infantStatus}</p>
          </div>
          <div className="text-center">
            <Cat className="w-6 h-6 mx-auto mb-2" />
            <p className="text-gray-400">{petStatus}</p>
          </div>
        </div>

        {/* Price Details */}
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>기본 보수</span>
            <span>{amounts.base}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>└ 업무 보수</span>
            <span>{amounts.task}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>└ 지역 보수</span>
            <span>{amounts.region}</span>
          </div>
          <div className="flex justify-between font-bold pt-4 border-t">
            <span>총 보수</span>
            <span>{amounts.total}</span>
          </div>
          <span className="flex flex-row items-center space-x-2 justify-end">
            <Info className="w-4 h-4 " />
            <span className="text-sm text-center">
              업무 시간 채우고 <span className="text-[#00B5B4]">상생지원금 </span>도전!
            </span>
          </span>

        </div>

        <div className="flex items-center justify-center gap-2">
          <input
            type="checkbox"
            id="terms"
            className="w-5 h-5"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          <label htmlFor="terms" className="text-gray-600">
            정기업무를 확인하였습니다
          </label>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              className="w-full bg-[#00B5B4] text-white py-6"
              disabled={!isChecked || acceptingJob}
            >
              {acceptingJob ? "처리중..." : "수락"}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="p-0">
            <div className="p-6 space-y-6">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">{startDate.split('부터')[0]}, 1회</h2>
                <p className="text-xl">{timeRange.split('(')[0]}</p>
                <p className="text-[#00C8B0] text-xl">{jobData?.type || '가정'} 청소</p>
              </div>

              <p className="text-center text-lg">정말 수락하시겠습니까?</p>

              <p className="text-center text-sm text-gray-500">
                ※ 권장되는 확인된 예상 시간이 실제 차이가 있을 수 있습니다. 신중히 수락해주세요.
              </p>

              <div className="space-y-2">
                <SheetClose asChild>
                  <Button
                    className="w-full bg-[#00B5B4] text-white py-6 text-lg"
                    onClick={handleAccept}
                    disabled={acceptingJob}
                  >
                    {acceptingJob ? "처리중..." : "수락"}
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button
                    variant="outline"
                    className="w-full py-6 text-lg"
                  >
                    취소
                  </Button>
                </SheetClose>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {showConfirmation && (
          <div className="h-screen w-full bg-black/60 fixed top-0 right-0 flex justify-center items-center">
            <div className="bg-white w-full sm:max-w-md mx-10 p-6 rounded-sm flex flex-col items-start">
              <h1 className="text-xl font-bold text-center mb-2"> 업무 예약이</h1>
              <p className="text-xl font-bold text-center">
                완료되었습니다.
              </p>
              <p className="text-center mb-6">
                스케줄을 확인하시겠습니까?
              </p>

              <div className="flex gap-4 w-full">
                <Button
                  variant="outline"
                  className="flex-1 py-6"
                  onClick={() => setShowConfirmation(false)}
                >
                  닫기
                </Button>
                <Button
                  className="flex-1 bg-[#00B5B4] hover:bg-[#00B5B4]/90 text-white py-6"
                  onClick={() => {
                    // Pass job data to the schedule page via navigation params
                    navigate(`/schedule/${jobData.id}`);
                  }}
                >
                  스케줄 보기
                </Button>
              </div>
            </div>
          </div>
        )}
       
      </div>
    </div>
  );

};

export default JobDetail;
