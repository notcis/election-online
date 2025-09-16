"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function SelectElection({
  elections,
  selectedId,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  elections: any[];
  selectedId: number;
}) {
  const router = useRouter();

  async function setElection(formData: FormData) {
    const id = Number(formData.get("electionId"));
    if (!id || Number.isNaN(id)) return;
    router.push(`/admin/ec?electionId=${id}`);
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>จัดการผูก Election ↔ Candidate</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={setElection} className="flex items-center gap-3">
          <label className="text-sm opacity-70">เลือกการเลือกตั้ง:</label>
          <select
            name="electionId"
            defaultValue={String(selectedId)}
            className="border rounded px-2 py-1"
          >
            {elections.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title} ({e.year}) — ไม่เกิน {e.maxSelections}
              </option>
            ))}
          </select>
          <button type="submit" className="border rounded px-3 py-1">
            เปลี่ยน
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
