import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { LoaderIcon } from "lucide-react";

export default function ExportCsvButton({
  onExport,
}: {
  onExport: () => Promise<{ filename: string; csv: string }>;
}) {
  const [isPending, startTransition] = useTransition();

  function downloadCsv(filename: string, csv: string) {
    // เพิ่ม UTF-8 BOM ให้ Excel บน Windows อ่านตัวอักษรไทยได้ถูกต้อง
    // และแปลง newline เป็น CRLF เพื่อความเข้ากันได้กับ Excel
    const csvWithBOM = "\uFEFF" + csv.replace(/\r?\n/g, "\r\n");
    const blob = new Blob([csvWithBOM], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  async function handleExport() {
    startTransition(async () => {
      try {
        const res = await onExport();
        downloadCsv(res.filename, res.csv);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        toast.error(e?.message || "เกิดข้อผิดพลาดไม่ทราบสาเหตุ");
      }
    });
  }
  return (
    <Button
      className=" cursor-pointer"
      variant="secondary"
      onClick={handleExport}
      disabled={isPending}
    >
      {isPending ? <LoaderIcon className="animate-spin w-4 h-4 mr-2" /> : ""}
      Export CSV
    </Button>
  );
}
