import { getElections, listVotes } from "@/actions/admin.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SelectElectionVote from "./components/select-election-vote";
import VoteTable from "./components/vote-table";

export default async function AdminVotePage({
  searchParams,
}: {
  searchParams: Promise<{ electionId?: string; page?: string }>;
}) {
  const { electionId, page } = await searchParams;

  const elections = await getElections();
  const selectedId = Number(electionId ?? elections[0]?.id);
  if (!selectedId || Number.isNaN(selectedId)) {
    return (
      <div className="space-y-5 mt-5 max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>จัดการคะแนนโหวต</CardTitle>
          </CardHeader>
          <CardContent>กรุณาสร้างการเลือกตั้งก่อน</CardContent>
        </Card>
      </div>
    );
  }

  const initialData = await listVotes({
    electionId: selectedId,
    page: Number(page ?? "1"),
  });

  return (
    <div className="space-y-5 mt-5 max-w-6xl mx-auto">
      <SelectElectionVote elections={elections} selectedId={selectedId} />

      <VoteTable
        initialData={
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          initialData.rows as any
        }
        page={initialData.page}
        totalPages={initialData.pages}
      />
    </div>
  );
}
