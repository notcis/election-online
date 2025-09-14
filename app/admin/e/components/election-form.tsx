"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createElection, editElection } from "@/actions/admin.action";
import { convertZoneTimeToServer } from "@/utils/utils";
import { toast } from "sonner";
import { ELECTION_DEFAULT_VALUE } from "@/utils/constant";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z.string().min(1).max(100),
  year: z.string().max(4).min(4),
  maxSelections: z.string().min(1),
  startAt: z.date(),
  endAt: z.date(),
  isPublished: z.string().refine((val) => val === "true" || val === "false", {
    message: "Invalid value",
  }),
});

export default function ElectionForm({
  type,
  election,
  electionId,
}: {
  type: "create" | "edit";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  election?: any;
  electionId?: string;
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:
      type === "edit" && election ? election : ELECTION_DEFAULT_VALUE,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const data = new FormData();
    data.append("title", values.title);
    data.append("year", values.year.toString());
    data.append("maxSelections", values.maxSelections.toString());
    data.append(
      "startAt",
      convertZoneTimeToServer(values.startAt).toISOString()
    );
    data.append("endAt", convertZoneTimeToServer(values.endAt).toISOString());
    data.append("isPublished", values.isPublished);

    if (type === "create") {
      const result = await createElection(data);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      router.push("/admin/e");
    } else {
      if (!electionId) {
        toast.error("Election ID is required");
        return;
      }

      const result = await editElection(electionId, data);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      router.push("/admin/e");
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ชื่อ</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ปี (พ.ศ.)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="maxSelections"
          render={({ field }) => (
            <FormItem>
              <FormLabel>จำนวนสูงสุดที่เลือกได้</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>เริ่มโหวต (วัน/เวลา)</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  value={
                    field.value
                      ? format(field.value as Date, "yyyy-MM-dd'T'HH:mm")
                      : ""
                  }
                  onChange={(e) => {
                    const v = e.target.value;
                    field.onChange(v ? new Date(v) : undefined);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>สิ้นสุดโหวต (วัน/เวลา)</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  value={
                    field.value
                      ? format(field.value as Date, "yyyy-MM-dd'T'HH:mm")
                      : ""
                  }
                  onChange={(e) => {
                    const v = e.target.value;
                    field.onChange(v ? new Date(v) : undefined);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isPublished"
          render={({ field }) => (
            <FormItem>
              <FormLabel>สถานะ</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกสถานะ" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="false">ปิด</SelectItem>
                  <SelectItem value="true">เปิด</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
