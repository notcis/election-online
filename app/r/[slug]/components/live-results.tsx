"use client";

import { getLiveResults } from "@/actions/result.action";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatToThaiDate } from "@/utils/utils";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

export default function LiveResults({ electionId }: { electionId: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any | null>(null);
  const [err, setErr] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const pull = async () => {
    const res = await getLiveResults(electionId);
    if (!res?.success) {
      setErr(res?.message || "เกิดข้อผิดพลาด");
      setData(null);
      setLoading(false);
    } else {
      setErr("");
      setData(res);
      setLoading(false);
    }
  };

  useEffect(() => {
    pull();
    timerRef.current = setInterval(pull, 3000); // poll ทุก 3 วินาที
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [electionId]);

  const maxVotes = useMemo(() => {
    if (!data?.totals || data.totals.length === 0) return 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Math.max(...data.totals.map((t: any) => t.votes));
  }, [data]);

  const totalSelections = data?.totalSelections ?? 0;

  return (
    <div className="space-y-6">
      {err && (
        <Alert variant="destructive">
          <AlertDescription>{err}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xl">
            {data?.election ? `${data.election.title} ` : "กำลังโหลด..."}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={data?.isOpen ? "default" : "secondary"}>
              {data?.isOpen ? "กำลังลงคะแนน" : "ปิดรับคะแนน"}
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={pull}
              disabled={loading}
              className=" cursor-pointer"
            >
              รีเฟรช
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm opacity-80">
          {data?.canShow === false ? (
            <div>ยังไม่เปิดเผยผลคะแนน</div>
          ) : (
            <>
              <div>
                ผู้มาใช้สิทธิ์:{" "}
                <span className="font-semibold">{data?.voters ?? "-"}</span> /
                สมาชิกทั้งหมด{" "}
                <span className="font-semibold">
                  {data?.membersActive ?? "-"}
                </span>{" "}
                {typeof data?.turnoutPct === "number" && (
                  <span>({data.turnoutPct.toFixed(2)}%)</span>
                )}
              </div>
              <div>
                จำนวนคะแนนทั้งหมด :{" "}
                <span className="font-semibold">{totalSelections}</span>
              </div>
              <div>
                เปิดโหวต :{" "}
                <span className="font-semibold text-primary">
                  {data?.election
                    ? formatToThaiDate(data.election.startAt)
                    : ""}
                </span>
              </div>
              <div>
                ปิดโหวต :{" "}
                <span className="font-semibold text-destructive">
                  {data?.election ? formatToThaiDate(data.election.endAt) : ""}
                </span>
              </div>
              <div className="opacity-60">
                อัปเดตล่าสุด:{" "}
                {data?.lastUpdated ? data.lastUpdated.toLocaleString() : "-"}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* ตารางคะแนน */}
      <div className="grid gap-4">
        {loading && (
          <div className="grid gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-2xl bg-muted animate-pulse"
              />
            ))}
          </div>
        )}

        {!loading && data?.canShow && (data?.totals?.length ?? 0) === 0 && (
          <div className="text-sm opacity-70">ยังไม่มีคะแนน</div>
        )}

        {!loading &&
          data?.canShow &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (data?.totals ?? []).map((t: any) => {
            const rel =
              maxVotes > 0 ? Math.round((t.votes / maxVotes) * 100) : 0;
            const share =
              totalSelections > 0
                ? ((t.votes / totalSelections) * 100).toFixed(2)
                : "0.00";
            return (
              <Card key={t.candidateId}>
                <CardContent className="py-4">
                  <div className="flex items-start gap-4">
                    {t.photoUrl ? (
                      <Image
                        src={t.photoUrl}
                        alt={t.name}
                        width={64}
                        height={64}
                        className="h-16 w-16 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-xl bg-muted" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="truncate ">
                          <p className="text-sm opacity-60 mr-2">
                            หมายเลข {t.ballotNo}
                          </p>
                          <p className="font-semibold text-xs sm:text-base">
                            {t.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            {t.votes.toLocaleString()} คะแนน
                          </div>
                          <div className="text-xs opacity-70">
                            {share}% ของคะแนนทั้งหมด
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Progress value={rel} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
}
