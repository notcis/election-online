"use client";

import PaginationCustom from "@/components/pagination-custom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import Link from "next/link";
import DeleteDialog from "../../components/delete-dialog";
import { deleteElection } from "@/actions/admin.action";
import { toast } from "sonner";

export default function ElectionList({
  elections,
  totalPages,
  page,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  elections: any[];
  totalPages: number;
  page: number;
}) {
  const handleDelete = async (id: string) => {
    const res = await deleteElection(id);
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    toast.success(res.message);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">รหัส</TableHead>
            <TableHead>รายการ</TableHead>
            <TableHead>ปี</TableHead>
            <TableHead>เปิดโหวต</TableHead>
            <TableHead>ปิดโหวต</TableHead>
            <TableHead>สถานะ</TableHead>
            <TableHead>ลิงค์เลือกตั้ง</TableHead>
            <TableHead>จัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {elections.map((election) => (
            <TableRow key={election.id}>
              <TableCell className="font-medium">{election.id}</TableCell>
              <TableCell>{election.title}</TableCell>
              <TableCell>{election.year}</TableCell>
              <TableCell>
                {format(election.startAt, "dd/MM/yyyy HH:mm")}
              </TableCell>
              <TableCell>
                {format(election.endAt, "dd/MM/yyyy HH:mm")}
              </TableCell>

              <TableCell>
                {election.isPublished === "true" ? (
                  <Badge variant="default">เปิด</Badge>
                ) : (
                  <Badge variant="destructive">ปิด</Badge>
                )}
              </TableCell>
              <TableCell>{`${process.env.NEXT_PUBLIC_DOMAIN_NAME}/e/${election.id}/000000`}</TableCell>
              <TableCell className="space-x-4">
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/admin/e/edit/${election.id}`}>แก้ไข</Link>
                </Button>
                <DeleteDialog onDelete={() => handleDelete(election.id)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <PaginationCustom currentPage={page} totalPages={totalPages} />
    </>
  );
}
