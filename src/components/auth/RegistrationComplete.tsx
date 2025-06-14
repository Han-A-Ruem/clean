
import { CircleCheck } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const RegistrationComplete = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to main page after 3 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 30 }}
      className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-white p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
        className="relative"
      >
        <div className="absolute inset-0 rounded-full bg-primary-user/10 animate-ping"></div>
        <CircleCheck className="text-primary-user w-32 h-32 relative z-10" />
      </motion.div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-center space-y-2"
      >
        <h1 className="text-2xl font-bold text-primary-user">등록 완료!</h1>
        <p className="text-gray-600">로그인 정보가 성공적으로 저장되었습니다.</p>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-4 text-sm text-gray-500"
      >
        잠시 후 메인 페이지로 이동합니다...
      </motion.div>
    </motion.div>
  );
};

export default RegistrationComplete;
