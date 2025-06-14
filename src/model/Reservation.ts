import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";



export type Reservation =  Database["public"]["Tables"]["reservations"]["Row"];
export type ReservationWithDetails = Database["public"]["Tables"]["reservations"]["Row"] & {
    user_details: Database["public"]["Tables"]["users"]["Row"];
    address_details: Database["public"]["Tables"]["addresses"]["Row"];
};



export async function fetchReservationsById(reservationId: string ,): Promise<ReservationWithDetails[] | null> {
  try {
    const { data, error } = await supabase
      .from("reservations")
      .select("*, user_details:users(*), address_details:addresses(*)")
      .eq("cleaner_id", reservationId)

    if (error) {
      console.error("Error fetching reservation:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching reservation:", error);
    return null;
  }
}
