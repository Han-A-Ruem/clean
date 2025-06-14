
import React from "react";
import { UserCircle } from "lucide-react";
import { PageHeader } from "../Utils";

interface HeaderSectionProps {
  title?: string;
  subtitle?: string;
  date?: string;
  time?: string;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  title = "매주 화요일",
  subtitle = "예약을 완료해 주세요.",
  date = "2.4(화)",
  time = "15:00~19:00(4시간)",
}) => {
  return (
    <>
      <PageHeader title="" className="backdrop-blur-lg bg-white/70 border-b border-white/30" />

      <div className="px-5 py-4 backdrop-blur-md bg-white/60">
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
        <p className="text-lg text-gray-600">{subtitle}</p>
        <p className="mt-4 text-lg text-gray-800">{date} 시작 / {time}</p>

        <div className="flex justify-between items-center gap-2 mt-5">
          <div className="backdrop-blur-md bg-white/70 p-3 rounded-xl border border-white/40 shadow-sm">
            <p className="text-gray-800">스마트 매칭으로 예약</p>
          </div>
          <div className="w-20 h-20 bg-blue-500/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-sm">
            <UserCircle className="w-16 h-16 text-blue-500" />
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderSection;
