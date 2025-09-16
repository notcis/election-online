"use client";

import { useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { saveElectionCandidates } from "@/actions/admin.action";
import { toast } from "sonner";

type Candidate = {
  id: number;
  name: string;
  photoUrl?: string | null;
  bio?: string | null;
};
type Mapping = { candidateId: number; ballotNo: number };

export default function AdminECEditor({
  electionId,
  electionTitle,
  year,
  maxSelections,
  allCandidates,
  currentMappings,
}: {
  electionId: number;
  electionTitle: string;
  year: number;
  maxSelections: number;
  allCandidates: Candidate[];
  currentMappings: Mapping[];
}) {
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<Mapping[]>(
    currentMappings.map((m) => ({
      candidateId: m.candidateId,
      ballotNo: m.ballotNo,
    }))
  );
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);
  const [isPending, startTransition] = useTransition();

  // ช่วยเช็คสถานะว่า candidate ถูกเลือกอยู่ไหม และ ballotNo อะไร
  const rowMap = useMemo(
    () => new Map(rows.map((r) => [r.candidateId, r.ballotNo])),
    [rows]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allCandidates;
    return allCandidates.filter((c) => c.name.toLowerCase().includes(q));
  }, [allCandidates, query]);

  const selectedCount = rows.length;

  function toggleCandidate(id: number) {
    setOk(false);
    setErr("");
    setRows((prev) => {
      const idx = prev.findIndex((r) => r.candidateId === id);
      if (idx >= 0) {
        // เอาออก
        const next = [...prev];
        next.splice(idx, 1);
        return next;
      }
      // เพิ่มใหม่ พร้อมค่า ballotNo แนะนำ (ถัดไปจาก max เดิม)
      const taken = new Set(prev.map((r) => r.ballotNo));
      let n = 1;
      while (taken.has(n)) n++;
      return [...prev, { candidateId: id, ballotNo: n }];
    });
  }

  function setBallot(id: number, value: number) {
    setOk(false);
    setErr("");
    setRows((prev) => {
      const next = [...prev];
      const idx = next.findIndex((r) => r.candidateId === id);
      if (idx >= 0) next[idx] = { ...next[idx], ballotNo: value };
      return next;
    });
  }

  function validate(): string | null {
    // จำกัดจำนวนสูงสุด (ถ้าต้องการบังคับที่ขั้น Admin)
    // ถ้าไม่อยากจำกัดตรงนี้สามารถคอมเมนต์บรรทัดนี้ออกได้
    if (selectedCount > 0 && selectedCount < 1)
      return "ต้องเลือกอย่างน้อย 1 คน";
    // ไม่บังคับ <= maxSelections ในระดับ Admin ก็ได้ (เพราะ maxSelections คือสิทธิ์ของผู้โหวตต่อคน)
    // แต่ถ้าต้องการเตือน:
    if (selectedCount < 1) return "ยังไม่ได้เลือกผู้สมัคร";
    // ballotNo > 0 และไม่ซ้ำ
    const set = new Set<number>();
    for (const r of rows) {
      if (!r.ballotNo || r.ballotNo <= 0)
        return `หมายเลขบัตรของผู้สมัคร #${r.candidateId} ต้องมากกว่า 0`;
      if (set.has(r.ballotNo)) return `หมายเลขบัตรซ้ำ: ${r.ballotNo}`;
      set.add(r.ballotNo);
    }
    return null;
  }

  function save() {
    const msg = validate();
    if (msg) {
      setErr(msg);
      toast.error(msg);
      setOk(false);
      return;
    }
    startTransition(async () => {
      try {
        await saveElectionCandidates(electionId, rows);
        setErr("");
        setOk(true);
        toast.success("บันทึกสำเร็จ");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setOk(false);
        setErr(e?.message ?? "บันทึกไม่สำเร็จ");
        toast.error(e?.message ?? "บันทึกไม่สำเร็จ");
      }
    });
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>
            ผูกผู้สมัครกับการเลือกตั้ง: {electionTitle} ({year})
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">จำนวนที่เลือก: {selectedCount}</Badge>
            <Badge variant="outline">สิทธิ์โหวต/คน: {maxSelections}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {err && (
            <Alert variant="destructive">
              <AlertDescription>{err}</AlertDescription>
            </Alert>
          )}
          {ok && (
            <Alert>
              <AlertDescription>บันทึกสำเร็จ</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Input
              placeholder="ค้นหาชื่อผู้สมัคร..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="max-w-md"
            />
            <Button variant="outline" onClick={() => setQuery("")}>
              ล้าง
            </Button>
            <Button onClick={save} disabled={isPending}>
              {isPending ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => {
              const checked = rowMap.has(c.id);
              const ballotNo = rowMap.get(c.id) ?? 0;
              return (
                <div
                  key={c.id}
                  className={`rounded-2xl border p-4 flex flex-col gap-2 ${
                    checked ? "ring-2 ring-primary border-primary/40" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {c.photoUrl ? (
                      <Image
                        src={c.photoUrl}
                        alt={c.name}
                        width={64}
                        height={64}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-lg bg-muted" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold">{c.name}</div>
                      {c.bio && (
                        <div className="text-xs opacity-70 line-clamp-2">
                          {c.bio}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      size={"sm"}
                      variant={checked ? "destructive" : "default"}
                      onClick={() => toggleCandidate(c.id)}
                      type="button"
                    >
                      {checked ? "นำออก" : "เลือก"}
                    </Button>
                    <div className="flex items-center gap-2">
                      <span className="text-sm opacity-70">หมายเลข</span>
                      <Input
                        type="number"
                        value={ballotNo || ""}
                        onChange={(e) =>
                          setBallot(c.id, Number(e.target.value))
                        }
                        disabled={!checked}
                        className="w-24"
                        min={1}
                        step={1}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-2">
            <Button onClick={save} disabled={isPending}>
              {isPending ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                setRows((prev) =>
                  // จัดเรียงหมายเลขอัตโนมัติ 1..N ตามลำดับชื่อ เพื่อช่วยตั้งหมายเลขเร็ว ๆ
                  prev
                    .slice()
                    .sort((a, b) => a.candidateId - b.candidateId)
                    .map((r, i) => ({ ...r, ballotNo: i + 1 }))
                )
              }
            >
              เรียงหมายเลขอัตโนมัติ 1..N
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
