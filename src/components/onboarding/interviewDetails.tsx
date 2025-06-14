import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/Utils';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { useCleanerRegistration } from '@/contexts/CleanerRegistrationContext';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { createInterviewData } from '@/model/interview';
import { changeUserStatus } from '@/model/User';

// Define types for the data we'll be working with
interface InterviewSchedule {
    id: string;
    date: string;
    time_slot: string;
    location: string;
}

interface InterviewLocation {
    id: string;
    title: string;
    address: string;
}

const InterviewDetails: React.FC = () => {
    const navigate = useNavigate();
    const { data } = useCleanerRegistration();
    const [locationDetails, setLocationDetails] = useState<InterviewLocation | null>(null);

    // Location mapping from ID to full details
    const locations: Record<string, InterviewLocation> = {
        "eulji": {
            id: "eulji",
            title: "을지로 입구",
            address: "서울 중구 남대문로9길 24 패스트파이브 타워 3-12층"
        },
        "hongdae": {
            id: "hongdae",
            title: "홍대",
            address: "서울 마포구 양화로 161 케이스퀘어 5-8층"
        },
        "ttukseom": {
            id: "ttukseom",
            title: "뚝섬(서울숲)",
            address: "서울특별시 성동구 왕십리로 125 KD운송타워 2-12층"
        },
        "gangnam": {
            id: "gangnam",
            title: "강남",
            address: "서울 강남구 강남대로94길 10 케이스퀘어 6-12층"
        },
        "chungmuro": {
            id: "chungmuro",
            title: "충무로",
            address: "서울 중구 퇴계로30길 14 바이브빌딩 2-5층"
        }
    };

    // Set the location details based on the selected site ID
    useEffect(() => {
        if (data && data.selectedSite && locations[data.selectedSite]) {
            setLocationDetails(locations[data.selectedSite]);
        }
    }, [data]);

    // Check if we have the necessary data
    //   useEffect(() => {
    //     if (!data || !data.date || !data.time_slot || !data.selectedSite) {
    //       toast.error("필요한 면접 정보가 없습니다");
    //       navigate('/interview/schedule');
    //     }
    //   }, [data, navigate]);

    // Format the date for display
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return format(date, 'yyyy년 MM월 dd일 (eee)', { locale: require('date-fns/locale/ko') });
        } catch (error) {
            return dateString;
        }
    };

    const handleConfirm = async () => {

        const response = await createInterviewData({
            name: data.name,
            email: data.email,
            user_id: data.user_id,
            schedule_id: data.schedule_id,
        })


        if (true) {
            changeUserStatus('interview_applied', data.user_id);
        }
        navigate('/onboarding/complete');
    };
    return (
        <div className="min-h-screen bg-gray-50/80">
            <PageHeader
                title="면접 상세 정보"
                className="backdrop-blur-lg bg-white/70 border-b border-white/30"
            />

            <div className="p-4 space-y-6">
                <div className="text-center">
                    <h2 className="text-xl font-semibold">면접 정보 확인</h2>
                    <p className="text-sm text-gray-600 mt-1">아래 면접 일정과 장소를 확인해 주세요</p>
                </div>

                <Card className="border border-gray-200 overflow-hidden">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">일정 정보</h3>

                        <div className="space-y-4">
                            {/* Date information */}
                            <div className="flex items-start">
                                <div className="bg-primary-cleaner/10 p-2 rounded-full mr-3">
                                    <Calendar className="h-5 w-5 text-primary-cleaner" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">날짜</p>
                                    <p className="font-medium">{formatDate(data.date) || ''}</p>
                                </div>
                            </div>

                            {/* Time information */}
                            <div className="flex items-start">
                                <div className="bg-primary-cleaner/10 p-2 rounded-full mr-3">
                                    <Clock className="h-5 w-5 text-primary-cleaner" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">시간</p>
                                    <p className="font-medium">{data.time_slot || ''}</p>
                                </div>
                            </div>

                            {/* Location information */}
                            <div className="flex items-start">
                                <div className="bg-primary-cleaner/10 p-2 rounded-full mr-3">
                                    <MapPin className="h-5 w-5 text-primary-cleaner" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">장소</p>
                                    <p className="font-medium">{locationDetails?.title || "선택된 면접 장소"}</p>
                                    <p className="text-gray-600 text-sm mt-1">{locationDetails?.address || ""}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="pt-4">
                    <Button
                        className="w-full bg-primary-cleaner hover:bg-primary-cleaner/90"
                        onClick={handleConfirm}
                    >
                        확인
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default InterviewDetails;