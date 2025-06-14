export type ReservationStatus =
  | 'pending'
  | 'matching'
  | 'matched'
  | 'payment_complete'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'on_the_way'
  | 'cleaning';

export interface UserDetails {
  id: string;
  name: string | null;
  phone_number: number | null;
  email: string | null;
}

export interface ServiceRequest {
  requested_at: string;
  requested_by: string;
  services: string[];
  status: 'pending' | 'approved' | 'declined';
  [key: string]: any;
}

export function isServiceRequest(obj: any): obj is ServiceRequest {
  return (
    obj &&
    typeof obj === 'object' &&
    'requested_at' in obj &&
    'requested_by' in obj &&
    'services' in obj &&
    'status' in obj &&
    Array.isArray(obj.services)
  );
}

export function isServiceRequestArray(arr: any[]): arr is ServiceRequest[] {
  return Array.isArray(arr) && arr.every(item => isServiceRequest(item));
}

export function parseServiceRequests(data: any): ServiceRequest[] {
  if (!data) return [];
  
  try {
    const parsed = Array.isArray(data) ? data : JSON.parse(data);
    return Array.isArray(parsed) 
      ? parsed.map(item => ({
          requested_at: item.requested_at || '',
          requested_by: item.requested_by || '',
          services: Array.isArray(item.services) ? item.services : [],
          status: item.status || 'pending'
        }))
      : [];
  } catch (e) {
    console.error('Error parsing service requests:', e);
    return [];
  }
}

export interface Reservation {
  id: string;
  date: string[] | string;
  time: string | null;
  address: string | null;
  user: string | null;
  customer_id?: string | null;
  cleaner_id: string | null;
  created_at: string;
  status: ReservationStatus | null;
  type: string | null;
  amount: number | null;
  infant: boolean | null;
  pet: string | null;
  parking: string | null;
  supply_location: string | null;
  service_hours?: number | null;
  dispose_types: string[] | null;
  custom_message?: string | null;
  phone_number?: number | null;
  additional_service?: string[] | null;
  additional_service_requests?: ServiceRequest[] | null;
  admin_message?: string | null;
  duration?: string | null;
  entry?: string | null;
  food_message?: string | null;
  general_message?: string | null;
  recycle_message?: string | null;
  is_late?: boolean | null;
  lobby_pass?: string | null;
  security?: string | null;
  unit_pass?: string | null;
  user_details?: UserDetails | null;
  cancellation_reason?: string | null;
  reservation_type?: string | null;
  days?: string[] | null;
  is_reviewed?: boolean | null;
  area_thresh?: number | null;
  cleaner_type?: string | null;
  is_resident: boolean | null;
  resident_name: string | null;
  resident_phone: number | null;
  is_business?: boolean;
}

export interface Address {
  address: string;
  area: number | string;
  created_at: string;
  id: string;
  latitude: number | null;
  longitude: number | null;
  name: string;
  user: string;
}

export interface ReservationData {
  id: string;
  address: Address | null;
  time: string | null;
  dispose_types?: string[] | null;
  pet: string | null;
  infant: boolean | null;
  parking: string | null;
  security?: string | null;
  user?: string | null;
  type: string | null;
  supply_location: string | null;
  cleaner_id?: string | null;
  amount: number | null;
  status: string;
  is_late?: boolean | null;
  duration: string | number | null;
  custom_message?: string | null;
  phone_number?: number | null;
  entry?: string | null;
  unit_pass?: string | null;
  lobby_pass?: string | null;
  recycle_message?: string | null;
  general_message?: string | null;
  food_message?: string | null;
  admin_message?: string | null;
  service_hours?: number | null;
  additional_service?: string[] | null;
  additional_service_requests?: ServiceRequest[] | null;
  date: string[] | Date[];
  cancellation_reason?: string | null;
  created_at?: string;
  reservation_type?: string | null;
  days?: string[] | null;
  is_reviewed?: boolean | null;
  area_thresh?: number | null;
  cleaner_type?: string | null;
  is_resident: boolean | null;
  resident_name: string | null;
  resident_phone: number | null;
  is_business?: boolean;
}

export interface NewReservation {
  date: string[] | string;
  time: string | null;
  address: string | null;
  customer_id: string;
  cleaner_id?: string | null;
  status: string;
  type: string | null;
  amount: number | null;
  service_hours?: number | null;
  infant: boolean | null;
  pet: string | null;
  parking: string | null;
  supply_location: string | null;
  phone_number?: number | null;
  area_thresh?: number | null;
  cleaner_type?: string | null;
  is_resident: boolean | null;
  resident_name: string | null;
  resident_phone: number | null;
  is_business?: boolean;
}

export interface ReservationFormData {
  address: string | null;
  time: string | null;
  dispose_types?: string[] | null;
  pet: string | null;
  infant: boolean | null;
  parking: string | null;
  security?: string | null;
  user?: string | null;
  type: string | null;
  supply_location: string | null;
  cleaner_id?: string | null;
  amount: number | null;
  status: string;
  is_late?: boolean | null;
  duration: string | number | null;
  custom_message?: string | null;
  phone_number?: number | null;
  entry?: string | null;
  unit_pass?: string | null;
  lobby_pass?: string | null;
  recycle_message?: string | null;
  general_message?: string | null;
  food_message?: string | null;
  admin_message?: string | null;
  service_hours?: number | null;
  additional_service?: string[] | null;
  additional_service_requests?: ServiceRequest[] | null;
  date: string[] | Date[];
  cancellation_reason?: string | null;
  reservation_type?: string | null;
  days?: string[] | null;
  is_reviewed?: boolean | null;
  area_thresh?: number | null;
  cleaner_type?: string | null;
  selectedOption?: 'regular' | 'luxury';
  is_resident: boolean | null;
  resident_name: string | null;
  resident_phone: number | null;
  is_business?: boolean;
}
