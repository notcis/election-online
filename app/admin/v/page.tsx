import { getElections, listVotes } from "@/actions/admin.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SelectElectionVote from "./components/select-election-vote";
import VoteTable from "./components/vote-table";

export default async function AdminVotePage({
  searchParams,
}: {
  searchParams: Promise<{ electionId?: string; page?: string; q?: string }>;
}) {
  const { electionId, page, q } = await searchParams;

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
    q,
  });

  // serialize createdAt → string
  const initial = {
    ...initialData,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rows: initialData.rows.map((r: any) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    })),
  };

  return (
    <div className="space-y-5 mt-5 max-w-6xl mx-auto">
      <SelectElectionVote elections={elections} selectedId={selectedId} />

      <VoteTable
        initialData={
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          initial.rows as any
        }
        page={initial.page}
        totalPages={initial.pages}
        selectedId={selectedId}
      />
    </div>
  );
}
