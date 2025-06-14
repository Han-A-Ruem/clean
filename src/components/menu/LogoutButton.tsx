
import React from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const LogoutButton = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "로그아웃 되었습니다",
        description: "다음에 또 만나요!",
      });
      
      navigate("/sign-in");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "오류가 발생했습니다",
        description: error.message,
      });
    }
  };

  return (
    <div className="mt-6 px-4">
      <Button 
        variant="destructive" 
        className="w-full flex items-center justify-center"
        onClick={handleLogout}
      >
        <LogOut className="w-5 h-5 mr-2" />
        로그아웃
      </Button>
    </div>
  );
};

export default LogoutButton;
