import { getVoteDetail } from "@/actions/admin.action";
import { notFound } from "next/navigation";
import VoteDetail from "../components/vote-detail";

export default async function VoteDetailPage({
  params,
}: {
  params: Promise<{ voteId: string }>;
}) {
  const { voteId } = await params;

  if (!voteId || Number.isNaN(Number(voteId))) {
    return notFound();
  }

  const v = await getVoteDetail(Number(voteId));

  return (
    <div className="space-y-5 mt-5 max-w-6xl mx-auto">
      <VoteDetail v={v} />
    </div>
  );
}
