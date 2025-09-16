import { getCandidates } from "@/actions/admin.action";
import CandidateList from "./components/candidate-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function CandidatePage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const { page } = (await searchParams) || { page: "1" };

  const result = await getCandidates(Number(page), 10);

  return (
    <div className="space-y-5 mt-5 max-w-6xl mx-auto">
      <h1 className="pb-4 font-bold">จัดการผู้สมัคร</h1>
      <Button className="w-max" asChild>
        <Link href="/admin/c/create">เพิ่มผู้สมัครใหม่</Link>
      </Button>
      <CandidateList
        candidates={result.data}
        totalPages={result.totalPages}
        page={result.page}
      />
    </div>
  );
}
