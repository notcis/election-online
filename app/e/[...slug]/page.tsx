import { getElectionDetails } from "@/actions/election.action";
import { getVoteDetails } from "@/actions/vote.action";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { convertZoneTimeToServer, formatToThaiDate } from "@/utils/utils";
import Image from "next/image";
import CandidateGrid from "./components/candidate-Grid";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ElectionPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  if (slug.length < 2) {
    return notFound();
  }
  const electionId = slug[0];
  const memberId = slug[1];

  const { election } = await getElectionDetails(electionId);

  if (!election) {
    return notFound();
  }

  const { vote } = await getVoteDetails(electionId, memberId);

  const now = convertZoneTimeToServer(new Date());
  const isOpen = now >= election.startAt && now <= election.endAt;

  return (
    <div className="container max-w-5xl mx-auto py-8 space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-2.5">
          <div className="flex flex-col items-center gap-2.5 w-full">
            <CardTitle className="text-xl text-center">
              {election.title}
            </CardTitle>
            <Badge variant={isOpen ? "default" : "destructive"}>
              {isOpen
                ? "เปิดโหวต"
                : now < election.startAt
                ? "ยังไม่เปิด"
                : "ปิดโหวตแล้ว"}
            </Badge>
          </div>
          <div className="hidden w-full text-center md:block text-sm opacity-70">
            เลือกได้ไม่เกิน{" "}
            <span className="font-bold text-lg">{election.maxSelections}</span>{" "}
            คน • เปิดโหวต{" "}
            <span className="font-bold text-lg">
              {formatToThaiDate(election.startAt)}
            </span>{" "}
            - ปิดโหวต{" "}
            <span className="font-bold text-lg">
              {formatToThaiDate(election.endAt)}
            </span>
          </div>
          <div className="md:hidden flex flex-col gap-2.5 text-sm opacity-70">
            <div>
              • เลือกได้ไม่เกิน{" "}
              <span className="font-bold text-lg">
                {election.maxSelections}
              </span>{" "}
              คน
            </div>
            <div>
              • เปิดโหวต{" "}
              <span className="font-bold text-lg">
                {formatToThaiDate(election.startAt)}
              </span>
            </div>
            <div>
              • ปิดโหวต{" "}
              <span className="font-bold text-lg">
                {formatToThaiDate(election.endAt)}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!isOpen && !vote && (
            <div className="text-sm opacity-80 md:text-center text-destructive">
              ขณะนี้อยู่นอกช่วงเวลาเลือกตั้ง โปรดกลับมาใหม่เมื่อระบบเปิดโหวต
            </div>
          )}
          {vote ? (
            <div className="space-y-5">
              <div className=" flex justify-between items-center">
                <div className="font-semibold">คุณได้ลงคะแนนแล้ว</div>
                <Button asChild>
                  <Link href={`/r/${electionId}`}>ดูคะแนนแบบ Real-time</Link>
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {vote.selections.length > 0 ? (
                  vote.selections
                    .sort((a, b) =>
                      (a.candidate.name || "").localeCompare(
                        b.candidate.name || ""
                      )
                    )
                    .map((s) => (
                      <div key={s.id} className="rounded-2xl border p-4">
                        <div className="font-medium">
                          เบอร์{" "}
                          <span className="text-xl">
                            {
                              election.candidates.find(
                                (c) => c.id === s.candidate.id
                              )?.ballotNo
                            }
                          </span>
                        </div>
                        <div className="font-medium">{s.candidate.name}</div>
                        {s.candidate.photoUrl && (
                          <Image
                            src={s.candidate.photoUrl}
                            alt={s.candidate.name}
                            width={400}
                            height={300}
                            className="mt-2 w-full rounded-lg object-cover aspect-[4/3]"
                          />
                        )}
                      </div>
                    ))
                ) : (
                  <Alert variant="destructive">
                    <AlertDescription>
                      คุณเลือกที่จะไม่ประสงค์ลงคะแนนเสียงในครั้งนี้
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          ) : isOpen ? (
            <CandidateGrid
              electionId={electionId}
              memberId={memberId}
              maxSelections={election.maxSelections}
              candidates={election.candidates}
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
