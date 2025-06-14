import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import { icons } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { shopItemService, ShopItemType, getIconComponent } from "@/services/shopItemService";

const FormSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  description: z.string().min(1, "설명을 입력해주세요"),
  price: z.string().min(1, "가격을 입력해주세요"),
  category: z.string().min(1, "카테고리를 선택해주세요"),
  badge: z.string().optional(),
  icon_name: z.string().optional(),
});

interface ShopItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ShopItemType | null;
  onSave: () => void;
}

const ShopItemModal: React.FC<ShopItemModalProps> = ({
  open,
  onOpenChange,
  item,
  onSave,
}) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [availableIcons, setAvailableIcons] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      category: "",
      badge: "",
      icon_name: "",
    },
  });

  useEffect(() => {
    // Load categories when modal opens
    if (open) {
      loadCategories();
      // Extract icon names from lucide-react
      const iconNames = Object.keys(icons).sort();
      setAvailableIcons(iconNames);
    }
  }, [open]);

  useEffect(() => {
    // Reset form when item changes
    if (open) {
      if (item) {
        form.reset({
          title: item.title,
          description: item.description,
          price: item.price,
          category: item.category,
          badge: item.badge || "",
          icon_name: item.icon_name || "",
        });
        setSelectedIcon(item.icon_name || null);
        setImagePreview(item.img_url || null);
      } else {
        form.reset({
          title: "",
          description: "",
          price: "",
          category: "",
          badge: "",
          icon_name: "",
        });
        setSelectedIcon(null);
        setImagePreview(null);
      }
      setImageFile(null);
    }
  }, [open, item, form]);

  const loadCategories = async () => {
    try {
      const categories = await shopItemService.getShopCategories();
      // Remove '전체' from categories for the dropdown
      setCategories(categories.filter(cat => cat !== "전체"));
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("카테고리를 불러오는 중 오류가 발생했습니다");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Update file size limit to 2MB
    if (file.size > 2 * 1024 * 1024) {
      toast.error("이미지 크기는 2MB 이하여야 합니다");
      return;
    }

    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setSelectedIcon(null);
    form.setValue("icon_name", "");
  };

  const handleIconSelect = (iconName: string) => {
    setSelectedIcon(iconName);
    form.setValue("icon_name", iconName);
    setImageFile(null);
    setImagePreview(null);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    setIsSubmitting(true);
    
    try {
      let imgUrl = item?.img_url || null;
      
      // Handle image uploading or removal
      if (imageFile) {
        // If there's a previous image to replace, delete it first
        if (item?.img_url) {
          await shopItemService.deleteImage(item.img_url);
        }
        
        // Upload the new image
        setIsUploading(true);
        imgUrl = await shopItemService.uploadImage(imageFile);
        setIsUploading(false);
        
        if (!imgUrl) {
          throw new Error("이미지 업로드에 실패했습니다");
        }
      } else if (item?.img_url && !imagePreview) {
        // If item had an image but it was cleared, delete the old image
        await shopItemService.deleteImage(item.img_url);
        imgUrl = null;
      }
      
      const itemData: Omit<ShopItemType, 'id' | 'image'> = {
        title: values.title,
        description: values.description,
        price: values.price,
        category: values.category,
        badge: values.badge || undefined,
        icon_name: selectedIcon || "",
        img_url: imgUrl,
        is_active: item ? item.is_active : true
      };

      let success = false;
      
      if (item) {
        // Update existing item
        success = await shopItemService.updateShopItem(item.id, itemData);
        if (success) {
          toast.success("상품이 업데이트되었습니다");
        }
      } else {
        // Create new item
        const newItemId = await shopItemService.createShopItem(itemData);
        success = !!newItemId;
        if (success) {
          toast.success("새 상품이 추가되었습니다");
        }
      }
      
      if (success) {
        onSave();
      }
    } catch (error) {
      console.error("Error saving shop item:", error);
      toast.error("상품 저장 중 오류가 발생했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-xl">
        <DialogHeader>
          <DialogTitle>{item ? "상품 수정" : "새 상품 추가"}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>제목</FormLabel>
                      <FormControl>
                        <Input placeholder="상품 제목" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>가격</FormLabel>
                      <FormControl>
                        <Input placeholder="예: ₩10,000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>카테고리</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="카테고리 선택" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white">
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="badge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>뱃지 (선택사항)</FormLabel>
                      <FormControl>
                        <Input placeholder="예: 인기, 신상품" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>설명</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="상품 설명" 
                          className="min-h-[120px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-2">
                  <FormLabel>이미지 또는 아이콘</FormLabel>
                  <FormDescription className="text-sm text-muted-foreground">
                    이미지는 400px x 400px 크기를 권장하며, 최대 2MB까지 업로드 가능합니다.
                  </FormDescription>
                  
                  <div className="flex flex-col space-y-2">
                    {/* Image upload section */}
                    <div className="border rounded-md p-4">
                      <p className="text-sm mb-2">이미지 업로드</p>
                      
                      {imagePreview ? (
                        <div className="relative w-full h-32 mb-2">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-full h-full object-contain"
                          />
                          <button
                            type="button"
                            onClick={clearImage}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="relative">
                          <input
                            type="file"
                            id="image-upload"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="sr-only"
                          />
                          <label
                            htmlFor="image-upload"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100"
                          >
                            <Upload className="w-6 h-6 text-gray-400" />
                            <span className="mt-2 text-sm text-gray-500">
                              이미지 업로드 (400px x 400px)
                            </span>
                          </label>
                        </div>
                      )}
                    </div>
                    
                    {/* OR divider */}
                    {/* <div className="relative flex items-center">
                      <div className="flex-grow border-t border-gray-300"></div>
                      <span className="mx-4 text-sm text-gray-500">또는</span>
                      <div className="flex-grow border-t border-gray-300"></div>
                    </div> */}
                    
                    {/* Icon selection section */}
                    {/* <div className="border rounded-md p-4">
                      <p className="text-sm mb-2">아이콘 선택</p> */}
                      
                      {/* <div className="flex items-center space-x-2 mb-2"> */}
                        {/* <FormField
                          control={form.control}
                          name="icon_name"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <Select 
                                onValueChange={(value) => handleIconSelect(value)} 
                                value={selectedIcon || ""}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="아이콘 선택" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="max-h-[200px]">
                                  {availableIcons.map((icon) => (
                                    <SelectItem key={icon} value={icon}>
                                      {icon}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        /> */}
                      {/* </div> */}
                      
                      {selectedIcon && (
                        <div className="flex justify-center p-4 bg-gray-50 rounded-md">
                          {getIconComponent(selectedIcon)}
                        </div>
                      )}
                    {/* </div> */}
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting || isUploading}
              >
                취소
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || isUploading}
              >
                {isSubmitting || isUploading ? "저장 중..." : "저장"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ShopItemModal;
