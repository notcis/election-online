"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function SelectElectionVote({
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
    router.push(`/admin/v?electionId=${id}`);
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>จัดการคะแนนโหวต</CardTitle>
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
                {e.title} ({e.year})
              </option>
            ))}
          </select>
          <Button type="submit" variant="default" className=" cursor-pointer">
            เปลี่ยน
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
