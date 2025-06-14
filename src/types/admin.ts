
import { Reservation } from "./reservation";

export interface UserWithReservations {
  id: string;
  email: string | null;
  name: string | null;
  type: string | null;
  status: string | null;
  address: string | null;
  created_at: string;
  reservation_count: number;
  rank_id?: string | null;
  rank_name?: string | null;
  rank_color?: string | null;
  rank_bg_color?: string | null;
}

export interface CustomerWithStats {
  id: string;
  email: string | null;
  name: string | null;
  type: string | null;
  status: string | null;
  address: string | null;
  created_at: string;
  reservation_count: number;
  rank_id?: string | null;
  rank_name?: string | null;
  rank_color?: string | null;
  rank_bg_color?: string | null;
}

export interface CleanerWithStats {
  id: string;
  email: string | null;
  name: string | null;
  type: string | null;
  status: string | null;
  address: string | null;
  created_at: string;
  reservation_count: number;
  rank_id?: string | null;
  rank_name?: string | null;
  rank_color?: string | null;
  rank_bg_color?: string | null;
}

export interface ReservationWithDetails extends Reservation {
  customer_name: string | null;
  customer_email: string | null;
  cleaner_name: string | null;
}
