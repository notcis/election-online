"use client";

import { useState, useMemo, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { toast } from "sonner";
import { submitNoVote, submitVote } from "@/actions/vote.action";
import Link from "next/link";

type Candidate = {
  candidateId: number;
  ballotNo: number;
  candidate: {
    id: number;
    name: string;
    photoUrl?: string | null;
    bio?: string | null;
  };
};

export default function CandidateGrid({
  electionId,
  memberId,
  maxSelections,
  candidates,
}: {
  electionId: string;
  memberId: string;
  maxSelections: number;
  candidates: Candidate[];
}) {
  const [selected, setSelected] = useState<number[]>([]);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const remaining = useMemo(
    () => Math.max(0, maxSelections - selected.length),
    [maxSelections, selected]
  );

  function toggle(cid: number) {
    setSelected((prev) => {
      if (prev.includes(cid)) return prev.filter((x) => x !== cid);
      if (prev.length >= maxSelections) return prev; // เกินไม่ให้เพิ่ม
      return [...prev, cid];
    });
  }

  const onSubmit = async () => {
    if (selected.length === 0) {
      toast.error("กรุณาเลือกผู้สมัครอย่างน้อย 1 คน หรือกด ไม่ประสงค์ลงคะแนน");
      return;
    }
    if (selected.length > maxSelections) {
      toast.error(`คุณสามารถเลือกได้ไม่เกิน ${maxSelections} คน`);
      return;
    }

    startTransition(async () => {
      const res = await submitVote(electionId, memberId, selected);
      if (!res.success) {
        toast.error(res.message || "เกิดข้อผิดพลาดในการส่งข้อมูล");
        return;
      }
      setSuccess(true);
      toast.success(res.message || "ส่งข้อมูลสำเร็จ");
    });
  };

  const handleNoVote = async () => {
    startTransition(async () => {
      const res = await submitNoVote(electionId, memberId);
      if (!res.success) {
        toast.error(res.message || "เกิดข้อผิดพลาดในการส่งข้อมูล");
        return;
      }
      setSuccess(true);
      toast.success(res.message || "ส่งข้อมูลสำเร็จ");
    });
  };

  if (success) {
    return (
      <Card className="mt-4 text-center">
        <CardHeader>
          <CardTitle>ส่งคะแนนเรียบร้อย</CardTitle>
        </CardHeader>
        <CardContent>ขอบคุณที่ใช้สิทธิ์ในการลงคะแนน</CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href={`/r/${electionId}`}>ดูคะแนนแบบ Real-time</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm opacity-70">
          เลือกได้ไม่เกิน {maxSelections} คน
        </div>
        <Badge variant="secondary">เหลือสิทธิ์: {remaining}</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {candidates.map((ec) => {
          const c = ec.candidate;
          const active = selected.includes(c.id);
          return (
            <button
              key={c.id}
              onClick={() => toggle(c.id)}
              className={`cursor-pointer rounded-2xl border p-4 text-left transition
                ${
                  active
                    ? "ring-2 ring-primary border-primary/50"
                    : "hover:border-foreground/30"
                }
              `}
              disabled={isPending}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">หมายเลข {ec.ballotNo}</span>
                {active && <Badge>เลือกแล้ว</Badge>}
              </div>
              <div className="mt-2 font-semibold text-lg">{c.name}</div>
              {c.photoUrl && (
                <Image
                  src={c.photoUrl}
                  alt={c.name}
                  width={400}
                  height={300}
                  className="mt-3 w-full rounded-xl object-cover aspect-[4/3]"
                />
              )}
              {c.bio && (
                <p className="mt-2 text-sm opacity-80 line-clamp-3 text-gray-800">
                  {c.bio}
                </p>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-10 flex flex-col md:flex-row justify-center gap-5 md:gap-0 md:justify-between">
        <Button
          onClick={onSubmit}
          disabled={isPending || selected.length === 0}
          className="cursor-pointer"
        >
          {isPending ? "กำลังส่ง..." : "ยืนยันลงคะแนน"}
        </Button>
        <Button
          variant="outline"
          onClick={() => setSelected([])}
          disabled={isPending || selected.length === 0}
          className="cursor-pointer"
        >
          ล้างที่เลือก
        </Button>
        <Button
          className="cursor-pointer"
          variant="destructive"
          onClick={handleNoVote}
          disabled={isPending || selected.length > 0}
        >
          {isPending ? "กำลังส่ง..." : "ไม่ประสงค์ลงคะแนน"}
        </Button>
      </div>
    </div>
  );
}
