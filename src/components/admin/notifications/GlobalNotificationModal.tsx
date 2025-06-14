
import { useState } from "react";
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useNotification } from "@/hooks/useNotification";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Users, UserRound, User } from "lucide-react";

interface GlobalNotificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormValues {
  title: string;
  message: string;
  type: string;
  recipient: string;
}

const NotificationTypes = [
  { value: "system", label: "시스템 알림" },
  { value: "reminder", label: "리마인더 알림" },
  { value: "late", label: "지연 알림" },
  { value: "reschedule", label: "일정 변경 알림" },
  { value: "cancellation", label: "취소 알림" },
  { value: "promotion", label: "프로모션 알림" },
];

const GlobalNotificationModal = ({ open, onOpenChange }: GlobalNotificationModalProps) => {
  const [isSending, setIsSending] = useState(false);
  const { createNotification } = useNotification();

  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
      message: "",
      type: "system",
      recipient: "all",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSending(true);
      
      // Create a notification with the selected recipient type
      await createNotification({
        title: values.title,
        message: values.message,
        type: values.type as any,
        to_type: values.recipient
      });
      
      // Map recipient value to human-readable label
      let recipientLabel = "사용자";
      if (values.recipient === "all") recipientLabel = "모든 사용자";
      else if (values.recipient === "cleaner") recipientLabel = "청소 매니저";
      else if (values.recipient === "customer") recipientLabel = "고객";
      
      toast.success(`${recipientLabel}에게 알림이 전송되었습니다.`);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("알림 전송 중 오류가 발생했습니다.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>알림 전송</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
              control={form.control}
              name="recipient"
              rules={{ required: "수신자를 선택하세요" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>수신자</FormLabel>
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
                    알림을 받을 사용자 유형을 선택하세요
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              rules={{ required: "제목을 입력하세요" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>알림 제목</FormLabel>
                  <FormControl>
                    <Input placeholder="알림 제목을 입력하세요" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

           
            <FormField
              control={form.control}
              name="type"
              rules={{ required: "알림 유형을 선택하세요" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>알림 유형</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="알림 유형을 선택하세요" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                      {NotificationTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
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
              name="message"
              rules={{ required: "내용을 입력하세요" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>알림 내용</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="알림 내용을 입력하세요" 
                      className="min-h-[120px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSending}
              >
                취소
              </Button>
              <Button type="submit" disabled={isSending}>
                {isSending ? "전송 중..." : "전송하기"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalNotificationModal;
