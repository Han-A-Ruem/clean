
import { Cat, Dog, Bird, Ban, Baby, Cctv, ParkingCircle, ParkingCircleOff, CircleHelp, Home, KeyRound } from "lucide-react"
import { ReactElement } from "react";

interface IconWithName {
    icon: ReactElement,
    name: string,
    value: string
}

export const pets: IconWithName[] = [
    { icon: <Dog strokeWidth={1} className="w-10 h-10" />, name: "강아지", value: 'dog' },
    { icon: <Cat strokeWidth={1} className="w-10 h-10" />, name: "고양이", value: 'cat' },
    { icon: <Bird strokeWidth={1} className="w-10 h-10" />, name: "기타", value: 'bird' },
    { icon: <Ban strokeWidth={1} className="w-10 h-10" />, name: "없음", value: 'none' },
];
  
export const infants: IconWithName[] = [
    { icon: <Baby strokeWidth={1} className="w-10 h-10" />, name: "있음" , value: 'yes'},
    { icon: <Ban strokeWidth={1} className="w-10 h-10" />, name: "없음", value: 'no' },
];
  
export const cctv: IconWithName[] = [
    { icon: <Cctv strokeWidth={1} className="w-10 h-10" />, name: "있음" , value: 'yes'},
    { icon: <Ban strokeWidth={1} className="w-10 h-10" />, name: "없음" , value: 'no'},
];
  
export const parking: IconWithName[] = [
    { icon: <ParkingCircle strokeWidth={1} className="w-10 h-10" />, name: "가능", value: 'posible' },
    { icon: <ParkingCircleOff strokeWidth={1} className="w-10 h-10" />, name: "불가능", value: 'imposible' },
    { icon: <CircleHelp strokeWidth={1} className="w-10 h-10" />, name: "모름" , value: 'dontknow'},
];
  
export const house: IconWithName[] = [
    { icon: <Home strokeWidth={1} className="w-10 h-10" />, name: "집에있음", value: 'home'},
    { icon: <KeyRound strokeWidth={1} className="w-10 h-10" />, name: "비밀번호" , value: 'password'},
];
