import { getElectionEditorData, getElections } from "@/actions/admin.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SelectElection from "./components/select-election";
import { Suspense } from "react";
import AdminECEditor from "./components/AdminECEditor";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ electionId?: string }>;
}) {
  const elections = await getElections();
  const selectedId = Number(
    (await searchParams)?.electionId ?? elections[0]?.id
  );
  if (!selectedId || Number.isNaN(selectedId)) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>ไม่พบการเลือกตั้ง</CardTitle>
          </CardHeader>
          <CardContent>กรุณาสร้างการเลือกตั้งก่อน</CardContent>
        </Card>
      </div>
    );
  }

  const data = await getElectionEditorData(selectedId);
  return (
    <div className="space-y-5 mt-5 max-w-6xl mx-auto">
      <SelectElection elections={elections} selectedId={selectedId} />
      <Suspense fallback={<div className="p-6">กำลังโหลด...</div>}>
        <AdminECEditor
          electionId={data.election.id}
          electionTitle={data.election.title}
          year={data.election.year}
          maxSelections={data.election.maxSelections}
          allCandidates={data.candidates}
          currentMappings={data.mappings.map((m) => ({
            candidateId: m.candidateId,
            ballotNo: m.ballotNo,
          }))}
        />
      </Suspense>
    </div>
  );
}
