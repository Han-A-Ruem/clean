
import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Notice } from "@/hooks/useNotices";

interface NoticeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notice: Notice | null;
  onSave: (notice: Omit<Notice, 'id'> | Partial<Notice> & { id: string }) => void;
}

interface FormValues {
  title: string;
  subtitle: string;
  date: string;
}

const NoticeModal = ({ open, onOpenChange, notice, onSave }: NoticeModalProps) => {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
      subtitle: "",
      date: "",
    },
  });

  useEffect(() => {
    if (notice) {
      form.reset({
        title: notice.title,
        subtitle: notice.subtitle,
        date: notice.date,
      });
    } else {
      form.reset({
        title: "",
        subtitle: "",
        date: "",
      });
    }
  }, [notice, form]);

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSaving(true);
      
      if (notice) {
        await onSave({
          id: notice.id,
          ...values,
        });
      } else {
        await onSave(values);
      }
      
      form.reset();
    } catch (error) {
      console.error("Error saving notice:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{notice ? "공지사항 수정" : "새 공지사항 작성"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              rules={{ required: "제목을 입력하세요" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제목</FormLabel>
                  <FormControl>
                    <Input placeholder="제목을 입력하세요" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subtitle"
              rules={{ required: "부제목을 입력하세요" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>부제목</FormLabel>
                  <FormControl>
                    <Input placeholder="부제목을 입력하세요" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              rules={{ required: "날짜 정보를 입력하세요" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>날짜 정보</FormLabel>
                  <FormControl>
                    <Input placeholder="날짜 정보를 입력하세요" {...field} />
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
                disabled={isSaving}
              >
                취소
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "저장 중..." : "저장하기"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NoticeModal;
