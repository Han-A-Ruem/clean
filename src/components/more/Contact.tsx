
import React from 'react';
import { ArrowLeft, MessageCircle, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Contact = () => {
  const navigate = useNavigate();
  
  return (
    <div className="">
      <div className="sticky top-0 bg-white z-10 border-b">
        <div className="flex items-center p-4">
          <button onClick={() => navigate('/more')} className="p-2">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold ml-2">문의하기</h1>
        </div>
      </div>
      
      <div className="p-4">
        {/* Kakaotalk Channel Talk UI */}
        <div className="mb-8 p-4 rounded-lg border border-yellow-400 bg-[#FEF7CD]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#FFEB3B] rounded-lg flex items-center justify-center">
              <MessageCircle className="text-black w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold">카카오톡 채널톡으로 문의하기</h2>
              <p className="text-sm text-gray-600">빠른 응답을 받을 수 있습니다</p>
            </div>
          </div>
          <Button className="w-full bg-[#FFEB3B] hover:bg-[#FFD600] text-black">
            <MessageCircle className="mr-2 h-4 w-4" />
            카카오톡 채널톡 문의하기
          </Button>
        </div>
        
        {/* Direct Contact Methods */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-lg border bg-[#E5DEFF]">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-10 h-10 bg-[#9b87f5] rounded-full flex items-center justify-center mb-2">
                <Phone className="text-white w-5 h-5" />
              </div>
              <h3 className="font-medium">전화 문의</h3>
              <p className="text-sm">1544-0000</p>
              <span className="text-xs text-gray-500">평일 09:00-18:00</span>
            </div>
          </div>
          
          <div className="p-4 rounded-lg border bg-[#D3E4FD]">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-10 h-10 bg-[#0EA5E9] rounded-full flex items-center justify-center mb-2">
                <Mail className="text-white w-5 h-5" />
              </div>
              <h3 className="font-medium">이메일 문의</h3>
              <p className="text-sm">support@example.com</p>
              <span className="text-xs text-gray-500">24시간 접수 가능</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
