import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { LoaderIcon } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

export default function DeleteDialog({
  onDelete,
}: {
  onDelete: () => Promise<{ success: boolean; message: string }>;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    startTransition(async () => {
      const res = await onDelete();
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
    });
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          className=" cursor-pointer"
          variant="destructive"
          disabled={isPending}
        >
          {isPending ? (
            <LoaderIcon className="animate-spin w-4 h-4 mr-2" />
          ) : (
            ""
          )}
          ลบ
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>คุณแน่ใจหรือไม่?</AlertDialogTitle>
          <AlertDialogDescription>
            การกระทำนี้ไม่สามารถย้อนกลับได้ จะลบข้อมูลอย่างถาวร
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            ดำเนินการต่อ
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
