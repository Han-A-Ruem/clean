
import { X, Info, Home, Package, Briefcase, Bath, Refrigerator } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CustomView({onBack}: {onBack: () => void}) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };



  return (
    <div className="bg-background min-h-screen pb-24 fixed z-10 w-full">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 p-4 flex items-center justify-between border-b ">
        <button onClick={onBack} className="p-1">
          <X className="w-6 h-6" />
        </button>
        <div className="flex items-center ">
          <Info className="w-5 h-5 text-primary mr-1" />
          <span className="text-sm font-medium text-primary">청소 범위</span>
        </div>
     
      </div>

      {/* Main Content */}
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-10">
          원하는 가사 청소를<br />
          선택해 주세요.
        </h1>

        {/* Section: Regular Cleaning */}
        <div className="mb-8">
          <h2 className="text-gray-500 font-medium mb-4">전체 청소</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-md mr-3">
                  <Home className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <div className="flex items-center">
                    <p className="font-medium">기본</p>
                    <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">정기 할인</span>
                  </div>
                  <p className="text-sm text-gray-500">1회, 정기적으로 청소</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/reservation/address')}
                className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50"
              >
                선택
              </button>
            </div>

            <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-md mr-3">
                  <Package className="w-6 h-6 text-orange-400" />
              </div>
                <div>
                  <p className="font-medium">원룸</p>
                  <p className="text-sm text-gray-500">8평 이하로 2시간 청소</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/reservation/address')}
                className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50"
              >
                선택
              </button>
            </div>
          </div>
        </div>

        {/* Section: Partial Cleaning */}
        <div className="mb-8">
          <h2 className="text-gray-500 font-medium mb-4">부분 청소</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-md mr-3">
                  <Briefcase className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex items-center">
                  <p className="font-medium">주방</p>
                  <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">N</span>
                </div>
                <p className="text-sm text-gray-500 ml-2">주방만 간단 청소</p>
              </div>
              <button 
                onClick={() => navigate('/reservation/kitchen')}
                className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50"
              >
                선택
              </button>
            </div>

            <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-md mr-3">
                  <Bath className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="font-medium">화장실</p>
                  <p className="text-sm text-gray-500">화장실만 간단 청소</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/reservation/bathroom')}
                className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50"
              >
                선택
              </button>
            </div>

            <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-md mr-3">
                  <Refrigerator className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="font-medium">냉장실</p>
                  <p className="text-sm text-gray-500">냉장실만 간단 청소</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/reservation/fridge')}
                className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50"
              >
                선택
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
