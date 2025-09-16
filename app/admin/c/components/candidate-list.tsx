"use client";

import { deleteCandidate } from "@/actions/admin.action";
import PaginationCustom from "@/components/pagination-custom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import DeleteDialog from "../../components/delete-dialog";

export default function CandidateList({
  candidates,
  totalPages,
  page,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  candidates: any[];
  totalPages: number;
  page: number;
}) {
  const handleDelete = async (id: string) => {
    const res = await deleteCandidate(id);
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
            <TableHead>รูปภาพ</TableHead>
            <TableHead>รหัส</TableHead>
            <TableHead>ชื่อผู้สมัคร</TableHead>
            <TableHead>จัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate) => (
            <TableRow key={candidate.id}>
              <TableCell>
                {candidate.photoUrl ? (
                  <Image
                    src={candidate.photoUrl}
                    alt={candidate.name}
                    width={100}
                    height={100}
                    className="h-20 w-20 rounded-md object-cover"
                  />
                ) : (
                  "No Image"
                )}
              </TableCell>
              <TableCell>{candidate.id}</TableCell>
              <TableCell>{candidate.name}</TableCell>
              <TableCell className="space-x-4">
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/admin/c/edit/${candidate.id}`}>แก้ไข</Link>
                </Button>
                <DeleteDialog onDelete={() => handleDelete(candidate.id)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <PaginationCustom currentPage={page} totalPages={totalPages} />
    </>
  );
}
