"use server";

import { prisma } from "@/lib/prisma";
import { MEMBER_ACTIVE } from "@/utils/constant";
import { convertZoneTimeToServer } from "@/utils/utils";

export const getLiveResults = async (electionId: string) => {
  if (!electionId) {
    return { success: false, message: "Invalid election ID" };
  }

  const election = await prisma.election.findUnique({
    where: { id: Number(electionId) },
    select: {
      id: true,
      title: true,
      year: true,
      maxSelections: true,
      startAt: true,
      endAt: true,
      isPublished: true,
    },
  });

  if (!election) {
    return { success: false, message: "Election not found" };
  }

  const now = convertZoneTimeToServer(new Date());

  const isOpen = now >= election.startAt && now <= election.endAt;
  const canShow = isOpen || election.isPublished;

  if (!canShow) {
    return {
      success: false,
      election: {
        ...election,
        startAt: election.startAt.toISOString(),
        endAt: election.endAt.toISOString(),
      },
      canShow: false as const,
      message: "ยังไม่เปิดเผยผลคะแนน",
      isOpen,
      lastUpdated: new Date(),
    };
  }

  const ecs = await prisma.electionCandidate.findMany({
    where: { electionId: Number(electionId) },
    orderBy: { ballotNo: "asc" },
    include: { candidate: true },
  });

  const grouped = await prisma.voteSelection.groupBy({
    by: ["candidateId"],
    where: { electionId: Number(electionId) },
    _count: { candidateId: true },
  });

  const countMap = new Map<number, number>();
  for (const g of grouped) countMap.set(g.candidateId, g._count.candidateId);

  const voters = await prisma.vote.count({
    where: { electionId: Number(electionId) },
  });

  const totals = ecs.map((ec) => ({
    candidateId: ec.candidateId,
    ballotNo: ec.ballotNo,
    name: ec.candidate.name,
    photoUrl: ec.candidate.photoUrl,
    bio: ec.candidate.bio,
    votes: countMap.get(ec.candidateId) ?? 0,
  }));

  totals.sort((a, b) => b.votes - a.votes);

  const totalSelections = totals.reduce((s, t) => s + t.votes, 0);

  const membersActive = MEMBER_ACTIVE;
  const turnoutPct = membersActive > 0 ? (voters / membersActive) * 100 : 0;

  return {
    success: true,
    election: {
      ...election,
      startAt: election.startAt,
      endAt: election.endAt,
    },
    canShow: true as const,
    totals,
    voters,
    membersActive,
    turnoutPct,
    totalSelections,
    lastUpdated: new Date(),
    isOpen,
  };
};
