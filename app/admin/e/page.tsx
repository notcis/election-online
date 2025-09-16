import { getAllElections } from "@/actions/admin.action";
import ElectionList from "./components/election-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ElectionListPage(
  searchParams?: Promise<{
    page?: string;
  }>
) {
  const { page } = (await searchParams) || { page: "1" };
  const elections = await getAllElections(Number(page), 10);

  return (
    <div className="space-y-5 mt-5 max-w-6xl mx-auto">
      <h1 className="pb-4 font-bold">จัดการเลือกตั้ง</h1>
      <Button className="w-max" asChild>
        <Link href="/admin/e/create">สร้างเลือกตั้งใหม่</Link>
      </Button>
      <ElectionList
        elections={elections.data}
        totalPages={elections.totalPages}
        page={elections.page}
      />
    </div>
  );
}
