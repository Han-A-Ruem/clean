
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";
import { Loader2, User, Brain } from "lucide-react";
import { Json } from '@/integrations/supabase/types';
import PreferenceSelector from './PreferenceSelector';
import PersonalityTagSelector from './PersonalityTagSelector';
import CleaningToolsSection from './CleaningToolsSection';
import { motion } from 'framer-motion';

interface CleaningSuppliesType {
  floor: string[];
  solvents: string[];
  dusting: string[];
  toilet: string[];
  kitchen: string[];
}

const SignupCompletion = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, fetchUserData } = useUser();
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState<string>('any');
  const [experienceLevel, setExperienceLevel] = useState<string>('any');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [cleaningSupplies, setCleaningSupplies] = useState<CleaningSuppliesType>({
    floor: [],
    solvents: [],
    dusting: [],
    toilet: [],
    kitchen: [],
  });

  const personalityTags = [
    '차분한', '밝은', '활동적인', '꼼꼼한', '친절한', '책임감 있는', '유연한', 
    '조용한', '사교적인', '성실한', '센스 있는', '독립적인', '깔끔한', '예의 바른'
  ];

  const supplies = {
    floor: ['빗자루', '진공청소기', '대걸레'],
    solvents: ['다용도 클리너', '욕실 클리너', '유리 클리너', '표백제(곰팡이용)'],
    dusting: ['천', '먼지떨이', '스펀지', '고무장갑', '수세미'],
    toilet: ['변기 솔', '욕실 스크러버', '스퀴지', '욕실용 수세미'],
    kitchen: ['주방 클리너', '기름때 제거제', '행주']
  };

  const genderOptions = [
    { value: 'any', label: '상관없음' },
    { value: 'male', label: '남성' },
    { value: 'female', label: '여성' },
  ];

  const experienceOptions = [
    { value: 'any', label: '상관없음' },
    { value: 'beginner', label: '초보' },
    { value: 'intermediate', label: '중급' },
    { value: 'expert', label: '전문가' },
  ];

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const handleSupplyToggle = (category: keyof CleaningSuppliesType, item: string) => {
    setCleaningSupplies(prev => {
      const newSupplies = { ...prev };
      if (newSupplies[category].includes(item)) {
        newSupplies[category] = newSupplies[category].filter(i => i !== item);
      } else {
        newSupplies[category] = [...newSupplies[category], item];
      }
      return newSupplies;
    });
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "오류가 발생했습니다",
        description: "사용자 정보를 찾을 수 없습니다.",
      });
      return;
    }

    setLoading(true);
    try {
      // Save to users table for backward compatibility
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({ tags: selectedTags })
        .eq('user_id', user.id);

      if (userUpdateError) throw userUpdateError;

      // Convert cleaningSupplies to the correct type for JSON storage
      const cleaningSuppliesJson = cleaningSupplies as unknown as Json;

      // Check if a record already exists for this user
      const { data: existingData } = await supabase
        .from('user_preferred_managers')
        .select('*')
        .eq('user_id', user.id);

      let preferenceError;
      
      if (existingData && existingData.length > 0) {
        // Update existing record
        const { error } = await supabase
          .from('user_preferred_managers')
          .update({
            preferred_sex: gender,
            preferred_experience: experienceLevel,
            preferred_tags: selectedTags,
            cleaning_supplies: cleaningSuppliesJson,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
          
        preferenceError = error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('user_preferred_managers')
          .insert({
            user_id: user.id,
            preferred_sex: gender,
            preferred_experience: experienceLevel,
            preferred_tags: selectedTags,
            cleaning_supplies: cleaningSuppliesJson
          });
          
        preferenceError = error;
      }

      if (preferenceError) throw preferenceError;

      // Refresh user data
      await fetchUserData(user.id);
      
      toast({
        title: "설정이 저장되었습니다",
        description: "환영합니다! 등록이 완료되었습니다.",
      });
      
      navigate("/registration-complete");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "오류가 발생했습니다",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <motion.div 
      className="p-4 space-y-8 pb-20"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="text-center space-y-2 mb-8"
        variants={itemVariants}
      >
        <h1 className="text-2xl font-bold">환영합니다!</h1>
        <p className="text-gray-600">최적의 서비스를 위해 몇 가지 정보를 알려주세요.</p>
      </motion.div>

      {/* 1. Manager Type Preferences */}
      <motion.div className="space-y-6" variants={itemVariants}>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <User className="h-5 w-5 text-primary-user" />
          선호하는 매니저 유형
        </h2>
        
        {/* 1.1 Gender preference */}
        <PreferenceSelector
          title="성별"
          options={genderOptions}
          value={gender}
          onChange={setGender}
        />
        
        {/* 1.2 Experience level */}
        <PreferenceSelector
          title="경험 수준"
          options={experienceOptions}
          value={experienceLevel}
          onChange={setExperienceLevel}
          icon={<Brain className="h-5 w-5 text-primary-user" />}
        />
        
        {/* 1.3 Personality tags */}
        <PersonalityTagSelector 
          tags={personalityTags}
          selectedTags={selectedTags}
          onToggle={handleTagToggle}
        />
      </motion.div>

      {/* 2. Cleaning Supplies */}
      <motion.div className="space-y-6" variants={itemVariants}>
        <h2 className="text-xl font-semibold">집에 있는 청소 용품</h2>
        <p className="text-sm text-gray-600 mb-4">집에 있는 청소 용품을 선택해주세요.</p>
        
        {/* 2.1 Floor cleaning supplies */}
        <CleaningToolsSection
          title="바닥 청소 용품"
          items={supplies.floor}
          category="floor"
          selectedItems={cleaningSupplies.floor}
          onToggle={handleSupplyToggle}
        />
        
        {/* 2.2 Cleaning solvents */}
        <CleaningToolsSection
          title="세정제"
          items={supplies.solvents}
          category="solvents"
          selectedItems={cleaningSupplies.solvents}
          onToggle={handleSupplyToggle}
        />
        
        {/* 2.3 Dusting supplies */}
        <CleaningToolsSection
          title="먼지 제거 용품"
          items={supplies.dusting}
          category="dusting"
          selectedItems={cleaningSupplies.dusting}
          onToggle={handleSupplyToggle}
        />
        
        {/* 2.4 Toilet cleaning supplies */}
        <CleaningToolsSection
          title="화장실 청소 용품"
          items={supplies.toilet}
          category="toilet"
          selectedItems={cleaningSupplies.toilet}
          onToggle={handleSupplyToggle}
        />
        
        {/* 2.5 Kitchen cleaning supplies */}
        <CleaningToolsSection
          title="주방 청소 용품"
          items={supplies.kitchen}
          category="kitchen"
          selectedItems={cleaningSupplies.kitchen}
          onToggle={handleSupplyToggle}
        />
      </motion.div>

      {/* Submit Button */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-md"
        variants={itemVariants}
      >
        <Button 
          onClick={handleSubmit} 
          className="w-full bg-primary-user hover:bg-primary-user/90 h-12 rounded-xl font-medium text-base" 
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              저장 중...
            </>
          ) : (
            '완료'
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default SignupCompletion;
