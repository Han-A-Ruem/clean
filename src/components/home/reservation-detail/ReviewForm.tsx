
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";

type MoodOption = 'bad' | 'neutral' | 'good';

interface CheckboxOption {
  id: string;
  label: string;
}

const ReviewForm = () => {
  const { id } = useParams<{ id: string }>();
  const {userData, user} = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const checkboxOptions: CheckboxOption[] = [
    { id: 'clean_thorough', label: '세가 원하는 곳까지 청소 거대했어요.' },
    { id: 'good_manner', label: '손님있고 매너가 좋아요.' },
    { id: 'skill_good', label: '청소 실력을 잘 최겨요.' },
    { id: 'other', label: '유능히 됐어요.' },
  ];
  
  const handleMoodSelect = (mood: MoodOption) => {
    setSelectedMood(mood);
  };
  
  const handleCheckboxChange = (optionId: string) => {
    if (selectedOptions.includes(optionId)) {
      setSelectedOptions(selectedOptions.filter(id => id !== optionId));
    } else {
      setSelectedOptions([...selectedOptions, optionId]);
    }
  };
  
  const handleGoBack = () => {
    navigate(`/reservation/detail/${id}`);
  };
  
  const handleSubmit = async () => {
    if (!selectedMood) {
      toast({
        variant: "destructive",
        title: "기분을 선택해주세요",
        description: "서비스에 대한 만족도를 선택해주세요.",
      });
      return;
    }
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "로그인이 필요합니다",
        description: "리뷰를 작성하려면 로그인이 필요합니다.",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create the review data
      const reviewData = {
        reservation_id: id,
        mood: selectedMood,
        options: selectedOptions,
        comment: comment,
        created_by: user.id // Add the user ID as created_by
      };
      
      // Save the review to Supabase
      const { error: reviewError } = await supabase
        .from('reviews')
        .insert(reviewData);
        
      if (reviewError) {
        throw reviewError;
      }
      
      // Update the reservation to mark it as reviewed
      const { error: updateError } = await supabase
        .from('reservations')
        .update({ is_reviewed: true })
        .eq('id', id);
        
      if (updateError) {
        throw updateError;
      }
      
      toast({
        title: "리뷰가 등록되었습니다",
        description: "소중한 의견 감사합니다.",
      });
      
      // Navigate back to the reservation detail
      navigate(`/reservation/detail/${id}`);
      
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        variant: "destructive",
        title: "리뷰 등록 실패",
        description: "리뷰를 등록하는 중 오류가 발생했습니다.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white p-4 flex items-center justify-between sticky top-0 z-10">
        <button onClick={handleGoBack} className="p-1">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium flex-1 text-center">리뷰 작성</h1>
        <div className="w-6"></div> {/* Empty div for spacing */}
      </div>
      
      <div className="p-6 space-y-8">
        {/* Mood selection */}
        <div>
          <h2 className="text-xl font-medium mb-2">
          안녕하세요, {userData.name}님!<br />
            청소님의 서비스가 어땠나요?
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            오늘 만족도를 남겨 줄 수 있어요.
          </p>
          
          <div className="flex justify-between items-center">
            <div 
              className={`flex flex-col items-center space-y-2 p-4 rounded-2xl ${
                selectedMood === 'bad' ? 'bg-gray-200' : 'bg-gray-100'
              }`}
              onClick={() => handleMoodSelect('bad')}
            >
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-2xl">😞</span>
              </div>
              <span className="text-sm">별로예요</span>
            </div>
            
            <div 
              className={`flex flex-col items-center space-y-2 p-4 rounded-2xl ${
                selectedMood === 'neutral' ? 'bg-gray-200' : 'bg-gray-100'
              }`}
              onClick={() => handleMoodSelect('neutral')}
            >
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-2xl">😐</span>
              </div>
              <span className="text-sm">괜찮아요</span>
            </div>
            
            <div 
              className={`flex flex-col items-center space-y-2 p-4 rounded-2xl ${
                selectedMood === 'good' ? 'bg-orange-100' : 'bg-gray-100'
              }`}
              onClick={() => handleMoodSelect('good')}
            >
              <div className="w-16 h-16 rounded-full bg-orange-200 flex items-center justify-center">
                <span className="text-2xl">😊</span>
              </div>
              <span className="text-sm">최고예요</span>
            </div>
          </div>
        </div>
        
        {/* Only show the following sections if a mood is selected */}
        {selectedMood && (
          <>
            {/* Checkbox options */}
            <div>
              <h2 className="text-xl font-medium mb-4">어떤 점이 좋았나요?</h2>
              
              <div className="space-y-4">
                {checkboxOptions.map((option) => (
                  <div key={option.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={option.id}
                      className="w-5 h-5 rounded-full text-primary border-gray-300 focus:ring-primary"
                      checked={selectedOptions.includes(option.id)}
                      onChange={() => handleCheckboxChange(option.id)}
                    />
                    <label htmlFor={option.id} className="ml-3 text-gray-700">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Comment section */}
            <div>
              <h2 className="text-xl font-medium mb-2">
                따뜻한 칭찬 한마디를 남겨주세요!
              </h2>
              <p className="text-gray-500 text-sm mb-4">
                남겨주신 가치와 꾸준히 기록될 도움과 프로필에 공개돼요.
              </p>
              
              <div className="border border-gray-300 rounded-lg p-4">
                <textarea
                  placeholder="리뷰를 작성해주세요. (선택사항)"
                  className="w-full h-24 focus:outline-none text-gray-700 resize-none"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                
                {/* Photo upload button */}
                <div className="flex items-center mt-2">
                  <button className="w-16 h-16 rounded border border-gray-300 flex items-center justify-center">
                    <Camera className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Submit button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white">
        <Button 
          className="w-full py-6 text-lg"
          onClick={handleSubmit}
          disabled={isSubmitting || !selectedMood}
        >
          {isSubmitting ? "처리 중..." : "리뷰 등록하기"}
        </Button>
      </div>
    </div>
  );
};

export default ReviewForm;
