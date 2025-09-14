import { notFound } from "next/navigation";
import LiveResults from "./components/live-results";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) {
    return notFound();
  }

  return (
    <div className="container max-w-5xl mx-auto py-8">
      <h1 className="text-2xl text-center font-semibold mb-6">
        สรุปคะแนนแบบ Real-time
      </h1>
      <LiveResults electionId={slug} />
    </div>
  );
}
