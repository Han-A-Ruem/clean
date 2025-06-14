
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Recruitment = () => {
  return <div className="min-h-screen bg-background pb-24 cleaner-theme">
      <div className="container px-4 py-8 mx-auto max-w-4xl">
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-start">모집요강</h1>
          
          <div className="bg-white rounded-lg shadow-sm space-y-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">지원자격</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className="text-gray-500 min-w-20">성별</span>
                  <span>여성</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-gray-500 min-w-20">나이</span>
                  <span>29~74세 (1996년생~1951년생)</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-gray-500 min-w-20">국적</span>
                  <span>한국인 또는 F2, F4, F5, F6 비자 소유 외국인</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">업무 가능지역</h2>
              <div className="relative">
                <img src="placeholder.svg" alt="업무 가능 지역 지도" className="w-full" />
              </div>
            </div>

            <Link to="/recruitment/signup">
              <Button className="w-full py-6 text-base mt-8 bg-primary-cleaner hover:bg-primary-cleaner/90" size="lg">
                지원하기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>;
};
export default Recruitment;
