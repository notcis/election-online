"use client";

import PaginationCustom from "@/components/pagination-custom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CandidateList({ candidates }: { candidates: any[] }) {
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
              <TableCell className="space-x-4"></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <PaginationCustom currentPage={1} totalPages={10} />
    </>
  );
}
