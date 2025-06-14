import { supabase } from "@/integrations/supabase/client";
import { ReservationFormData } from "@/types/reservation";
import { createContext, useContext, useState, ReactNode } from "react";
import { useNotification } from "@/hooks/useNotification";
import { useToast } from "@/hooks/use-toast";
import { useChat } from "@/hooks/useChat";
import { Reservation } from "@/model/Reservation";

// Context default values
const defaultReservationData: Reservation = {
  address: null,
  time: null,
  dispose_types: null,
  pet: null,
  infant: null,
  parking: null,
  security: null,
  user: null,
  type: null,
  supply_location: null,
  cleaner_id: null,
  amount: null,
  status: "pending",
  is_late: null,
  duration: null,
  custom_message: null,
  phone_number: null,
  entry: null,
  unit_pass: null,
  lobby_pass: null,
  recycle_message: null,
  general_message: null,
  food_message: null,
  admin_message: null,
  additional_service: null,
  date: [],
  cancellation_reason: null,
  reservation_type: null,
  days: null,
  area_thresh: null,
  is_resident: null,
  resident_name: null,
  resident_phone: null,
  additional_service_requests: "",
  cleaner_type: "",
  created_at: "",
  id: "",
  is_business: false,
  is_reviewed: false
};

// Create the context type
interface ReservationContextType {
  reservationData: Reservation;
  reservationType: 'weekly' | 'onetime' | null;
  setReservationData: (data: Partial<Reservation>) => void;
  setReservationType: (type: 'weekly' | 'onetime' | null) => void;
  createReservation: (form: Reservation) => Promise<any>;
}

// Create Context
const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

// Provider Component
export const ReservationProvider = ({ children }: { children: ReactNode }) => {
  const [reservationData, setReservationDataState] = useState<Reservation>(defaultReservationData);
  const [reservationType, setReservationType] = useState<'weekly' | 'onetime' | null>(null);
  const { createNotification } = useNotification();
  const { toast } = useToast();
  const { createChat } = useChat();

  // Function to update the state with partial updates
  const setReservationData = (data: Partial<Reservation>) => {
    setReservationDataState((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const createReservation = async (form: Partial<Reservation>) => {
    try {
      // Ensure date is converted to the correct format for database
      let formattedDate: string[] = [];
      
      if (form.date) {
        if (Array.isArray(form.date)) {
          if (form.date.length > 0 ) {
            // Handle Date[] type
            formattedDate = (form.date as unknown as Date[]).map(d => d.toISOString().split('T')[0]) ;
          } else {
            // Handle string[] type
            formattedDate = form.date as string[];
          }
        } else if (typeof form.date === 'string') {
          // Handle string type
          formattedDate = [form.date];
        }
      }
      
      // Convert duration to string if it's a number
      const duration = form.duration !== undefined && form.duration !== null
        ? String(form.duration)
        : null;
        
      // Create a clean object to send to Supabase, excluding null/undefined values
      const reservationPayload: any = {};
      
      // Add all properties that have values
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          reservationPayload[key] = value;
        }
      });
      
      // Override with properly formatted date and duration
      reservationPayload.date = formattedDate;
      if (duration) {
        reservationPayload.duration = duration;
      }
      
      console.log("Creating reservation with data:", reservationPayload);
      
      const { data, error } = await supabase
        .from('reservations')
        .insert(reservationPayload)
        .select();

      if (error) {
        console.error("Error creating reservation:", error);
        throw error;
      }

      console.log("Reservation created successfully:", data);
      
      // Create notification if there are additional services
      if (form.additional_service && form.additional_service.length > 0 && form.user) {
        try {
          await createNotification({
            userId: form.cleaner_id,
            title: "추가 서비스가 선택되었습니다",
            message: `예약에 추가 서비스 ${form.additional_service.length}개가 포함되었습니다.`,
            type: "system",
            action_url: `/reservation/detail/${data[0]?.id || ''}`
          });
          
          toast({
            title: "알림이 생성되었습니다",
            description: "추가 서비스에 대한 알림이 생성되었습니다.",
          });
        } catch (notificationError) {
          console.error("Error creating notification:", notificationError);
          // Don't throw the error here, as we don't want to fail the reservation creation
        }
      }
      
      // Create chat if both cleaner_id and user id are present
      if (form.cleaner_id && form.user) {
        try {
          const chatId = await createChat(form.cleaner_id, data[0]?.id);
          console.log("Chat created for reservation:", chatId);
        } catch (chatError) {
          console.error("Error creating chat:", chatError);
          // Don't throw the error here, as we don't want to fail the reservation creation
        }
      }
      
      return data;
    } catch (error) {
      console.error("Failed to create reservation:", error);
      throw error;
    }
  };
  

  return (
    <ReservationContext.Provider value={{ 
      reservationData, 
      reservationType,
      setReservationData, 
      setReservationType,
      createReservation 
    }}>
      {children}
    </ReservationContext.Provider>
  );
};

// Custom Hook to use context
export const useReservation = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error("useReservation must be used within a ReservationProvider");
  }
  return context;
};
