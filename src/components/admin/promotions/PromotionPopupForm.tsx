
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { PromotionPopup } from "@/types/promotion";
import { Upload, Image as ImageIcon } from "lucide-react";

interface PromotionPopupFormProps {
  popup?: PromotionPopup;
  onComplete: () => void;
}

const PromotionPopupForm = ({ popup, onComplete }: PromotionPopupFormProps) => {
  const [formData, setFormData] = useState<Omit<PromotionPopup, 'id' | 'created_at'>>({
    title: popup?.title || "",
    description: popup?.description || "",
    image_url: popup?.image_url || "",
    target_url: popup?.target_url || "",
    start_date: popup?.start_date ? new Date(popup.start_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    end_date: popup?.end_date ? new Date(popup.end_date).toISOString().split('T')[0] : "",
    is_active: popup?.is_active ?? true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(popup?.image_url || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_active: checked }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("이미지 파일만 업로드 가능합니다.");
      return;
    }

    // Validate file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("이미지 크기는 5MB 이하여야 합니다.");
      return;
    }

    try {
      setIsUploading(true);

      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('promotion_images')
        .upload(filePath, file);

      if (error) throw error;

      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('promotion_images')
        .getPublicUrl(filePath);

      // Update form data with the new image URL
      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      setPreviewUrl(publicUrl);
      toast.success("이미지가 업로드되었습니다.");
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert dates to ISO format with time
      const formattedData = {
        ...formData,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
      };

      if (popup) {
        // Update existing popup
        const { error } = await supabase
          .from('promotion_popups')
          .update(formattedData)
          .eq('id', popup.id);

        if (error) throw error;
        toast.success("프로모션 팝업이 수정되었습니다.");
      } else {
        // Create new popup
        const { error } = await supabase
          .from('promotion_popups')
          .insert(formattedData);

        if (error) throw error;
        toast.success("프로모션 팝업이 추가되었습니다.");
      }

      onComplete();
    } catch (error: any) {
      console.error("Error saving promotion popup:", error);
      toast.error("프로모션 팝업 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">제목</Label>
        <Input 
          id="title" 
          name="title" 
          value={formData.title} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">설명</Label>
        <Textarea 
          id="description" 
          name="description" 
          value={formData.description} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className="space-y-2">
        <Label>이미지</Label>
        <div className="flex flex-col items-center space-y-2">
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            className="hidden" 
          />
          
          {previewUrl ? (
            <div className="relative w-full max-w-md rounded-md border overflow-hidden">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-auto object-cover max-h-[200px]"
              />
              <Button 
                type="button" 
                variant="secondary" 
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleImageClick}
              >
                <Upload className="w-4 h-4 mr-1" />
                변경
              </Button>
            </div>
          ) : (
            <Button 
              type="button" 
              variant="outline" 
              className="w-full h-32 border-dashed flex flex-col items-center justify-center"
              onClick={handleImageClick}
              disabled={isUploading}
            >
              <ImageIcon className="w-10 h-10 text-muted-foreground mb-2" />
              <span>{isUploading ? "업로드 중..." : "이미지 업로드"}</span>
            </Button>
          )}
          
          <Input 
            id="image_url" 
            name="image_url" 
            value={formData.image_url} 
            onChange={handleChange} 
            placeholder="또는 이미지 URL 직접 입력"
            className="mt-2"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="target_url">타겟 URL (선택사항)</Label>
        <Input 
          id="target_url" 
          name="target_url" 
          value={formData.target_url} 
          onChange={handleChange} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">시작 날짜</Label>
          <Input 
            id="start_date" 
            name="start_date" 
            type="date" 
            value={formData.start_date} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_date">종료 날짜 (선택사항)</Label>
          <Input 
            id="end_date" 
            name="end_date" 
            type="date" 
            value={formData.end_date} 
            onChange={handleChange} 
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          id="is_active" 
          checked={formData.is_active} 
          onCheckedChange={handleSwitchChange} 
        />
        <Label htmlFor="is_active">활성화</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onComplete}>
          취소
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "저장 중..." : popup ? "수정" : "추가"}
        </Button>
      </div>
    </form>
  );
};

export default PromotionPopupForm;
