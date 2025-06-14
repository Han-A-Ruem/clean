
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
  isOpen: boolean;
  onClose: () => void;
  recipients: string[];
}

interface FormValues {
  title: string;
  message: string;
}

const NotificationModal = ({ isOpen, onClose, recipients }: NotificationModalProps) => {
  const [isSending, setIsSending] = useState(false);
  const {createNotification} = useNotification();

  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
      message: "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    if (recipients.length === 0) {
      toast("수신자가 선택되지 않았습니다.");
      return;
    }

    try {
      setIsSending(true);
      
      // Create a single notification with to_type="cleaner" instead of multiple notifications
      await createNotification({
        title: values.title,
        message: values.message,
        type: "system",
        to_type: "cleaner"
      });
      
      toast.success(`${recipients.length}명의 청소 매니저에게 알림이 전송되었습니다.`);
      form.reset();
      onClose();
    } catch (error) {
      console.error("Error sending notifications:", error);
      toast.error("알림 전송 중 오류가 발생했습니다.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>청소 매니저에게 알림 전송</DialogTitle>
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

            <p className="text-sm text-muted-foreground">
              선택된 수신자: {recipients.length}명
            </p>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
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
