
import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";

interface PasswordInputDialogProps {
  type: "lobby" | "unit";
  isOpen: boolean;
  onClose: () => void;
  onSave: (password: string) => void;
  initPass?: string;
}

const PasswordInputDialog: React.FC<PasswordInputDialogProps> = ({
  type,
  isOpen,
  onClose,
  onSave,
  initPass,
}) => {
  const [password, setPassword] = useState( initPass || "");
  const inputRef = useRef<HTMLInputElement>(null);
  
  console
  // Focus the input when the dialog opens
  useEffect(() => {
    console.log({mgs: ' ' , initPass})
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);


  useEffect(() => {
  setPassword(initPass || "");
}, [initPass]);
  const handleSave = () => {
    onSave(password);
    setPassword("");
    onClose();
  };

  const handleContentClick = (e: React.MouseEvent) => {
    // Focus the input when clicking anywhere on the content except the submit button
    if (
      e.target instanceof HTMLElement && 
      !e.target.closest('button[type="submit"]') && 
      inputRef.current
    ) {
      inputRef.current.focus();
    }
  };

  const title = type === "lobby" ? "공동현관 비밀번호" : "개별현관 비밀번호";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop/overlay */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Dialog content */}
      <div 
        className="relative z-50 bg-[#454C52] text-white p-0 rounded-lg max-w-md border-none h-full sm:h-auto w-full sm:max-w-md animate-in fade-in-0 zoom-in-95 "
        onClick={handleContentClick}
      >
        <button 
          onClick={onClose} 
          className="absolute left-4 top-4 text-white hover:text-gray-300"
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="pt-16 pb-8 px-6">
          <h2 className="text-center text-2xl font-normal text-white">
            {title}
          </h2>
        </div>
        
        <div className="px-6 pb-8">
          <div className="flex justify-center mb-16">
            <input 
              ref={inputRef}
              type="text" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent border-0 outline-none focus:border-0 focus:outline-none focus:ring-0 text-center text-xl text-white"
              autoFocus
            />
          </div>
          
          <div className="text-center text-gray-300 mb-16">
            <p>비밀번호는 암호화 보관되며 방문 담당</p>
            <p>담당 매니저님에게만 제공됩니다.</p>
          </div>
          
          <Button 
            type="submit"
            onClick={handleSave}
            className="w-full py-6 text-xl font-normal bg-[#00C8B0] hover:bg-[#00B0A0] text-white rounded-lg"
          >
            저장
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PasswordInputDialog;
