import { getCandidates } from "@/actions/admin.action";
import CandidateList from "./components/candidate-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function CandidatePage() {
  const candidates = await getCandidates();

  return (
    <div className="space-y-5 mt-5 max-w-6xl mx-auto">
      <h1 className="pb-4 font-bold">จัดการผู้สมัคร</h1>
      <Button className="w-max" asChild>
        <Link href="/admin/c/create">เพิ่มผู้สมัครใหม่</Link>
      </Button>
      <CandidateList candidates={candidates} />
    </div>
  );
}
