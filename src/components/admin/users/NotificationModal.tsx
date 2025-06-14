
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useNotification } from "@/hooks/useNotification";

interface NotificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormValues {
  title: string;
  message: string;
}

const NotificationModal = ({ open, onOpenChange }: NotificationModalProps) => {
  const [isSending, setIsSending] = useState(false);
  const { createNotification } = useNotification();

  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
      message: "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSending(true);
      
      // Create a single notification with to_type="customer"
      await createNotification({
        title: values.title,
        message: values.message,
        type: "system",
        to_type: "customer"
      });
      
      toast.success("모든 고객에게 알림이 전송되었습니다.");
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
          <DialogTitle>고객에게 알림 전송</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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

export default NotificationModal;
