
export interface Notification {
  id: string;
  user_id?: string;
  title: string;
  message: string;
  type: 'system' | 'reminder' | 'late' | 'reschedule' | 'cancellation' | 'promotion' | 'warning' | 'success' | 'info';
  status: 'read' | 'unread';
  action_url?: string;
  created_at: string;
  read_at?: string;
  to_type?: string;
}
