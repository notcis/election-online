import PaginationCustom from "@/components/pagination-custom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ElectionList({ elections }: { elections: any[] }) {
  return (
    <Table>
      <TableCaption>
        <PaginationCustom currentPage={1} totalPages={10} />
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">รหัส</TableHead>
          <TableHead>รายการ</TableHead>
          <TableHead>ปี</TableHead>
          <TableHead>เปิดโหวต</TableHead>
          <TableHead>ปิดโหวต</TableHead>
          <TableHead>สถานะ</TableHead>
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
            <TableCell>{format(election.endAt, "dd/MM/yyyy HH:mm")}</TableCell>
            <TableCell>
              {election.isPublished ? (
                <Badge variant="default">เปิด</Badge>
              ) : (
                <Badge variant="destructive">ปิด</Badge>
              )}
            </TableCell>
            <TableCell className="space-x-4">
              <Button variant="outline" asChild>
                <Link href={`/admin/e/edit/${election.id}`}>Edit</Link>
              </Button>
              <Button variant="destructive">Delete</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
