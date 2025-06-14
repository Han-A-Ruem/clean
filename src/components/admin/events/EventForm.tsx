
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Event, eventService } from "@/services/eventService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Upload, ImageIcon, Users, UserRound, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Updated schema to include target_audience
const eventFormSchema = z.object({
  title: z.string().min(2, { message: "제목을 입력하세요." }),
  description: z.string().min(2, { message: "설명을 입력하세요." }),
  image_url: z.string().optional(),
  date_range: z.string().min(2, { message: "기간을 입력하세요." }),
  badge: z.string().optional(),
  is_active: z.boolean().default(true),
  target_audience: z.enum(["all", "cleaner", "customer"]).default("all")
}).refine(data => {
  return true;
}, {
  message: "이미지 URL을 입력하거나 이미지 파일을 업로드하세요.",
  path: ["image_url"]
});

type EventFormValues = z.infer<typeof eventFormSchema>;

interface EventFormProps {
  event: Event | null;
  onSave: (event: Partial<Event>) => void;
  onCancel: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, onSave, onCancel }) => {
  const isEditing = !!event;
  const { toast } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(event?.image_url || null);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: event?.title || "",
      description: event?.description || "",
      image_url: event?.image_url || "",
      date_range: event?.date_range || "",
      badge: event?.badge || "",
      is_active: event?.is_active ?? true,
      target_audience: event?.target_audience || "all"
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "잘못된 파일 형식",
        description: "JPG, PNG 또는 WebP 이미지만 업로드 가능합니다."
      });
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        variant: "destructive",
        title: "파일 크기 초과",
        description: "이미지는 5MB 이하여야 합니다."
      });
      return;
    }

    setImageFile(file);
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (data: EventFormValues) => {
    try {
      setIsUploading(true);
      let imageUrl = data.image_url || "";

      // If a new image is selected, upload it
      if (imageFile) {
        const uploadedUrl = await eventService.uploadEventImage(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          toast({
            variant: "destructive",
            title: "이미지 업로드 실패",
            description: "이미지를 업로드하는 중 오류가 발생했습니다. 다시 시도해주세요."
          });
          setIsUploading(false);
          return;
        }
      } else if (!data.image_url && !imagePreview) {
        // No image file selected and no existing image URL - show error
        toast({
          variant: "destructive",
          title: "이미지 필요",
          description: "이미지를 업로드하거나 이미지 URL을 입력하세요."
        });
        setIsUploading(false);
        return;
      }

      // Remove empty badge if provided
      const formattedData = {
        ...data,
        image_url: imageUrl,
        badge: data.badge && data.badge.trim() !== "" ? data.badge : null
      };
      
      onSave(formattedData);
      setIsUploading(false);
    } catch (error) {
      console.error("Error saving event:", error);
      toast({
        variant: "destructive",
        title: "이벤트 저장 실패",
        description: "이벤트를 저장하는 중 오류가 발생했습니다."
      });
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "이벤트 수정" : "새 이벤트 추가"}</CardTitle>
      </CardHeader>

      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">


{/* Add toggle buttons for target audience */}
<FormField
              control={form.control}
              name="target_audience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>대상 사용자</FormLabel>
                  <FormControl>
                    <ToggleGroup 
                      type="single" 
                      variant="outline"
                      className="w-full grid grid-cols-3"
                      value={field.value}
                      onValueChange={(value) => {
                        if (value) field.onChange(value);
                      }}
                    >
                      <ToggleGroupItem value="all" className="flex items-center justify-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>전체</span>
                      </ToggleGroupItem>
                      <ToggleGroupItem value="cleaner" className="flex items-center justify-center gap-2">
                        <User className="h-4 w-4" />
                        <span>청소사</span>
                      </ToggleGroupItem>
                      <ToggleGroupItem value="customer" className="flex items-center justify-center gap-2">
                        <UserRound className="h-4 w-4" />
                        <span>고객</span>
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </FormControl>
                  <FormDescription>
                    이벤트를 볼 수 있는 사용자 유형을 선택하세요
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제목</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="이벤트 제목" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>설명</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="이벤트 설명"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이미지</FormLabel>
                  <div className="space-y-4">
                    {/* Image preview */}
                    {imagePreview && (
                      <div className="relative w-full h-48 overflow-hidden rounded-md border">
                        <img 
                          src={imagePreview} 
                          alt="이벤트 이미지 미리보기" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    {/* Image upload */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <Input
                          type="file"
                          accept="image/png, image/jpeg, image/jpg, image/webp"
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                          onChange={handleFileChange}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          이미지 업로드
                        </Button>
                      </div>
                      
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="또는 이미지 URL 입력"
                        />
                      </FormControl>
                    </div>
                  </div>
                  <FormDescription>
                    이미지를 직접 업로드하거나 URL을 입력하세요.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="date_range"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>기간</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="2023.01.01 ~ 2023.01.31" />
                  </FormControl>
                  <FormDescription>
                    이벤트 기간 (예: 2023.01.01 ~ 2023.01.31)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="badge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>배지 (선택사항)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="10,000" />
                  </FormControl>
                  <FormDescription>
                    이벤트 배지 텍스트 (선택사항)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            
            
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">활성 상태</FormLabel>
                    <FormDescription>
                      이벤트를 활성화하거나 비활성화합니다.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={onCancel} disabled={isUploading}>
              취소
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? "업로드 중..." : isEditing ? "저장" : "추가"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default EventForm;
