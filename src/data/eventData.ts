
export interface Event {
  id: number;
  title: string;
  description: string;
  image: string;
  dateRange: string;
  isActive: boolean;
  badge?: string;
}

export const eventData: Event[] = [
  {
    id: 1,
    title: "친구야 청소 대신 커피 한 잔 어때?",
    description: "선착순 7,000개 한정",
    image: "https://images.unsplash.com/photo-1497935586047-9242eb4fc795?q=80&w=1000&auto=format&fit=crop",
    dateRange: "2023.11.06 ~ 11.15",
    isActive: true,
    badge: "10,000"
  },
  {
    id: 2,
    title: "1만원 쿠폰에 100만원 찬스까지",
    description: "배민몰트 X 청소연구소",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000&auto=format&fit=crop",
    dateRange: "2023.09.22 ~ 10.17",
    isActive: true
  },
  {
    id: 3,
    title: "최대 25,000원 청소 혜택!",
    description: "청소연구소 X IBK 기업은행",
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?q=80&w=1000&auto=format&fit=crop",
    dateRange: "2023.08.01 ~ 08.31",
    isActive: false
  }
];
