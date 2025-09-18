import PaginationCustom from "@/components/pagination-custom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

type VoteRow = {
  id: number;
  createdAt: string; // serialize ใน page.tsx
  source: string;
  ip?: string | null;
  userAgent?: string | null;
  _count: { selections: number };
  memberId: string;
};

export default function VoteTable({
  initialData,
  page,
  totalPages,
}: {
  initialData: VoteRow[];
  page: number;
  totalPages: number;
}) {
  return (
    <div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#Vote</TableHead>
                <TableHead>สมาชิก</TableHead>
                <TableHead>เวลา</TableHead>
                <TableHead>เลือก (รายชื่อ)</TableHead>
                <TableHead>แหล่ง</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>UA</TableHead>
                <TableHead>จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialData.map((vote) => (
                <TableRow key={vote.id}>
                  <TableCell>{vote.id}</TableCell>
                  <TableCell>{vote.memberId}</TableCell>
                  <TableCell>
                    {new Date(vote.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>{vote._count.selections}</TableCell>
                  <TableCell>{vote.source}</TableCell>
                  <TableCell>{vote.ip ?? "-"}</TableCell>
                  <TableCell className="truncate max-w-[240px]">
                    {vote.userAgent ?? "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/v/${vote.id}`}>รายละเอียด</Link>
                      </Button>
                      <Button variant="destructive" size="sm">
                        ลบ
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <PaginationCustom currentPage={page} totalPages={totalPages} />
    </div>
  );
}
