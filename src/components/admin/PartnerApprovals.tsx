import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface Partner {
  id: string;
  email: string;
  name: string;
  phone: string;
  business_name: string;
  business_type: string;
  status: "pending" | "approved" | "rejected";
  is_active: boolean;
  created_at: string;
}

const PartnerApprovals = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: partners, isLoading, error } = useQuery({
    queryKey: ["partners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("type", "cleaner")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as unknown as Partner[];
    },
  });

  const updatePartnerStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Partner["status"] }) => {
      const { error } = await supabase
        .from("users")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      toast.success("파트너 상태가 업데이트되었습니다.");
    },
    onError: (error) => {
      toast.error("파트너 상태 업데이트 중 오류가 발생했습니다.");
      console.error(error);
    },
  });

  const togglePartnerAccess = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("users")
        .update({ is_active })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      toast.success("파트너 접근 권한이 업데이트되었습니다.");
    },
    onError: (error) => {
      toast.error("파트너 접근 권한 업데이트 중 오류가 발생했습니다.");
      console.error(error);
    },
  });

  const filteredPartners = partners?.filter((partner) =>
    Object.values(partner).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (error) {
    return <div className="text-red-500">파트너 목록을 불러오는 중 오류가 발생했습니다.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex-1 max-w-sm">
          <input
            type="text"
            placeholder="파트너 검색..."
            className="w-full px-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>전화번호</TableHead>
              <TableHead>사업체명</TableHead>
              <TableHead>업종</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>접근 권한</TableHead>
              <TableHead>신청일</TableHead>
              <TableHead>관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  로딩 중...
                </TableCell>
              </TableRow>
            ) : filteredPartners?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  검색 결과가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              filteredPartners?.map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell>{partner.name}</TableCell>
                  <TableCell>{partner.email}</TableCell>
                  <TableCell>{partner.phone}</TableCell>
                  <TableCell>{partner.business_name}</TableCell>
                  <TableCell>{partner.business_type}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        partner.status === "approved"
                          ? "success"
                          : partner.status === "rejected"
                          ? "destructive"
                          : partner.status === "pending"
                          ? "warning"
                          : "secondary"
                      }
                    >
                      {partner.status === "approved"
                        ? "승인됨"
                        : partner.status === "rejected"
                        ? "거절됨"
                        : partner.status === "pending"
                        ? "대기중"
                        : "대기중"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={partner.status === "approved"}
                      onCheckedChange={(checked) =>
                        togglePartnerAccess.mutate({
                          id: partner.id,
                          is_active: checked,
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {format(new Date(partner.created_at), "yyyy-MM-dd", {
                      locale: ko,
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updatePartnerStatus.mutate({
                                id: partner.id,
                                status: "approved",
                              })
                            }
                          >
                            승인
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updatePartnerStatus.mutate({
                                id: partner.id,
                                status: "rejected",
                              })
                            }
                          >
                            거절
                          </Button>
                        </>
                  
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PartnerApprovals; 