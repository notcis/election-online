import { getElectionById } from "@/actions/admin.action";
import { notFound } from "next/navigation";
import ElectionForm from "../../components/election-form";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const election = await getElectionById(id);
  if (!election) {
    return notFound();
  }
  return <ElectionForm type="edit" election={election} electionId={id} />;
}
