
import { Home, DoorClosed, Utensils, Toilet, Refrigerator, WashingMachine, Frame, Shirt, Settings } from "lucide-react";
interface Service {
    id: string;
    title: string;
    badge?: string;
    description: string;
    icon: any;
    category: string;
    price: string;  
  }
  
  export const services = [
    {
      id: "basic",
      title: "기본",
      badge: "청기 할인",
      description: "1회, 정기적으로 청소",
      icon: Home,
      category: "전체 청소",
      price: "60,000원"
    },
    {
      id: "pro",
      title: "원룸",
      description: "8평 이하로 2시간 청소",
      icon: DoorClosed,
      category: "전체 청소",
      price: "80,000원"
    },
    {
      id: "kitchen",
      title: "주방",
      badge: "N",
      description: "주방만 깔끔 청소",
      icon: Utensils,
      category: "부분 청소",
      price: "50,000원"
    },
    {
      id: "bathroom",
      title: "화장실",
      description: "화장실만 깔끔 청소",
      icon: Toilet,
      category: "부분 청소",
      price: "40,000원"
    },
    {
      id: "fridge",
      title: "냉장실",
      description: "냉장실만 깔끔 청소",
      icon: Refrigerator,
      category: "부분 청소",
      price: "70,000원"
    },
    {
      id: "custom",
      title: "맞춤형",
      badge: "NEW",
      description: "필요한 부분만 맞춤형 청소",
      icon: Settings,
      category: "맞춤형 청소",
      price: "가격변동"
    }
  ];

