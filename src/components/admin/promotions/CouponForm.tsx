
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Coupon } from "@/types/coupon";

const formSchema = z.object({
  code: z.string().min(2, {
    message: "쿠폰 코드는 최소 2자 이상이어야 합니다.",
  }),
  description: z.string().min(2, {
    message: "쿠폰 설명은 최소 2자 이상이어야 합니다.",
  }),
  discount_type: z.enum(["percentage", "fixed"]),
  discount_value: z.coerce.number().positive({
    message: "할인 값은 양수여야 합니다.",
  }),
  expiry_date: z.date().optional(),
  is_active: z.boolean().default(true),
});

interface CouponFormProps {
  coupon?: Coupon | null;
  onComplete: () => void;
}

const CouponForm = ({ coupon, onComplete }: CouponFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: coupon?.code || "",
      description: coupon?.description || "",
      discount_type: coupon?.discount_type || "percentage",
      discount_value: coupon?.discount_value || 10,
      expiry_date: coupon?.expiry_date ? new Date(coupon.expiry_date) : undefined,
      is_active: coupon?.is_active !== false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const couponData = {
        code: values.code,
        description: values.description,
        discount_type: values.discount_type,
        discount_value: values.discount_value,
        expiry_date: values.expiry_date ? values.expiry_date.toISOString() : null,
        is_active: values.is_active,
      };

      let error;
      
      if (coupon) {
        // Update existing coupon
        const { error: updateError } = await supabase
          .from('coupons')
          .update(couponData)
          .eq('id', coupon.id);
        
        error = updateError;
      } else {
        // Create new coupon
        const { error: insertError } = await supabase
          .from('coupons')
          .insert(couponData);
        
        error = insertError;
      }

      if (error) throw error;
      
      toast.success(`쿠폰이 ${coupon ? '수정' : '추가'}되었습니다.`);
      onComplete();
    } catch (error: any) {
      console.error('Error saving coupon:', error);
      toast.error(`쿠폰 ${coupon ? '수정' : '추가'} 중 오류가 발생했습니다.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>쿠폰 코드</FormLabel>
              <FormControl>
                <Input placeholder="WELCOME10" {...field} />
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
              <FormLabel>쿠폰 설명</FormLabel>
              <FormControl>
                <Textarea placeholder="신규 회원 첫 예약 10% 할인" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="discount_type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>할인 유형</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="percentage" />
                    </FormControl>
                    <FormLabel className="cursor-pointer">백분율 (%)</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="fixed" />
                    </FormControl>
                    <FormLabel className="cursor-pointer">고정 금액 (₩)</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="discount_value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>할인 값</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="expiry_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>만료일 (선택사항)</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "yyyy-MM-dd")
                      ) : (
                        <span>만료일 없음 (무기한)</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
                <FormLabel className="text-base">쿠폰 활성화</FormLabel>
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
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onComplete} type="button">
            취소
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? '처리 중...' : coupon ? '수정' : '추가'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CouponForm;
