
export interface PromotionPopup {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  target_url?: string;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
}
