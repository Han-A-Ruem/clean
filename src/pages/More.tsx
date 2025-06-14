import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import MorePageItems from "@/components/more/MorePageItems";
import InviteComponent from "@/components/InviteComponent";

const More = () => {
  const { userData } = useUser();

  return (
    <div className="container px-4 py-8 mx-auto max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">더보기</h1>
        {/* <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Pencil className="mr-2 h-4 w-4" />
            수정하기
          </Button>
        </div> */}
      </div>
      
      {/* <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">이름</label>
            <p className="p-2 bg-secondary rounded">{userData?.name || "홍길동"}</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">전화번호</label>
            <p className="p-2 bg-secondary rounded">{userData?.phone || "010-1234-5678"}</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">이메일</label>
            <p className="p-2 bg-secondary rounded">{userData?.email || "example@email.com"}</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">주소</label>
            <p className="p-2 bg-secondary rounded">서울시 강남구 테헤란로</p>
          </div>
        </div>
      </div> */}
      
      <MorePageItems />
    </div>
  );
};

export default More;
