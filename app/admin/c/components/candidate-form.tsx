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

import { toast } from "sonner";
import { CANDIDATE_DEFAULT_VALUE } from "@/utils/constant";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import { addCandidate, updateCandidate } from "@/actions/admin.action";

const formSchema = z.object({
  name: z.string().min(1).max(100),
  bio: z.string().optional(),
  photoUrl: z.string().optional(),
});

export default function CandidateForm({
  type,
  candidate,
  candidateId,
}: {
  type: "create" | "edit";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  candidate?: any;
  candidateId?: string;
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:
      type === "edit" && candidate ? candidate : CANDIDATE_DEFAULT_VALUE,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (type === "create") {
      const res = await addCandidate(values);
      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
      router.push("/admin/c");
    } else {
      if (!candidateId) {
        toast.error("Candidate ID is required");
        return;
      }
      const res = await updateCandidate(candidateId, values);
      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
      router.push("/admin/c");
    }
  }

  const photoUrl = form.watch("photoUrl");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ชื่อผู้สมัคร</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ปี (พ.ศ.)</FormLabel>
              <FormControl>
                <Textarea placeholder="ประวัติย่อ" rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-2.5">
          {photoUrl && (
            <Image
              src={photoUrl}
              alt="Uploaded Image"
              width={200}
              height={200}
              className="rounded-md "
            />
          )}
          <UploadButton
            className="w-max"
            endpoint="imageUploader"
            onClientUploadComplete={(res: { ufsUrl: string }[]) => {
              form.setValue("photoUrl", res[0].ufsUrl);
            }}
            onUploadError={(error: Error) => {
              toast.error(error.message);
            }}
          />
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
