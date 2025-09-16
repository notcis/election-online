import { getCandidateById } from "@/actions/admin.action";
import { notFound } from "next/navigation";
import CandidateForm from "../../components/candidate-form";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const candidate = await getCandidateById(id);
  if (!candidate) {
    return notFound();
  }

  return (
    <div className="mt-5 max-w-6xl mx-auto">
      <CandidateForm type="edit" candidate={candidate} candidateId={id} />
    </div>
  );
}
