import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function VoteDetail({ v }: { v: any }) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>รายละเอียดโหวต #{v.id}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>
            <span className="opacity-70">การเลือกตั้ง:</span> {v.election.title}{" "}
            ({v.election.year})
          </div>
          <div>
            <span className="opacity-70">สมาชิก:</span> {v.memberId}
          </div>
          <div>
            <span className="opacity-70">เวลา:</span>{" "}
            {v.createdAt.toLocaleString()}
          </div>
          <div>
            <span className="opacity-70">แหล่ง:</span> {v.source}
          </div>
          <div>
            <span className="opacity-70">IP:</span> {v.ip ?? "-"}
          </div>
          <div className="truncate">
            <span className="opacity-70">User-Agent:</span> {v.userAgent ?? "-"}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            รายชื่อผู้สมัครที่ถูกเลือก ({v.selections.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {v.selections.map(
              (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                s: any
              ) => (
                <div
                  key={s.id}
                  className="rounded-xl border p-3 flex items-center gap-3"
                >
                  {s.candidate.photoUrl ? (
                    <Image
                      src={s.candidate.photoUrl}
                      alt={s.candidate.name}
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-lg bg-muted" />
                  )}
                  <div className="font-medium">{s.candidate.name}</div>
                </div>
              )
            )}
            {v.selections.length === 0 && (
              <div className="opacity-70 text-sm">ไม่มีรายการ</div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
