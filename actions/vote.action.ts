"use server";

import { prisma } from "@/lib/prisma";
import { convertZoneTimeToServer } from "@/utils/utils";
import { headers } from "next/headers";

export const getVoteDetails = async (electionId: string, memberId: string) => {
  if (!electionId || !memberId) {
    return {
      vote: null,
    };
  }

  const userVote = await prisma.vote.findUnique({
    where: {
      electionId_memberId: {
        electionId: Number(electionId),
        memberId: memberId,
      },
    },
    include: {
      selections: { include: { candidate: true } },
    },
  });

  if (!userVote) {
    return {
      vote: null,
    };
  }
  return {
    vote: userVote,
  };
};

export const submitVote = async (
  electionId: string,
  memberId: string,
  candidateIds: number[]
) => {
  if (!electionId || !memberId) {
    return { success: false, message: "Invalid election or member ID" };
  }

  const [election, already] = await Promise.all([
    prisma.election.findUnique({ where: { id: Number(electionId) } }),
    prisma.vote.findUnique({
      where: {
        electionId_memberId: {
          electionId: Number(electionId),
          memberId: memberId,
        },
      },
    }),
  ]);

  if (!election) {
    return { success: false, message: "ไม่พบการเลือกตั้ง" };
  }

  const now = convertZoneTimeToServer(new Date());
  if (now < election.startAt || now > election.endAt) {
    return { success: false, message: "ไม่อยู่ในช่วงเวลาลงคะแนนเสียง" };
  }
  if (already) {
    return { success: false, message: "คุณได้ลงคะแนนเสียงไปแล้ว" };
  }

  if (candidateIds.length === 0) {
    return { success: false, message: "กรุณาเลือกผู้สมัครอย่างน้อย 1 คน" };
  }
  if (candidateIds.length > election.maxSelections) {
    return {
      success: false,
      message: `คุณสามารถเลือกได้ไม่เกิน ${election.maxSelections} คน`,
    };
  }

  const valid = await prisma.electionCandidate.findMany({
    where: {
      electionId: Number(electionId),
      candidateId: { in: candidateIds },
    },
    select: { candidateId: true },
  });
  if (valid.length !== candidateIds.length) {
    return { success: false, message: "มีผู้สมัครบางคนไม่ถูกต้อง" };
  }

  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for") ?? "";
  const ua = hdrs.get("user-agent") ?? "";

  try {
    await prisma.$transaction(async (tx) => {
      const vote = await tx.vote.create({
        data: {
          electionId: Number(electionId),
          memberId: memberId!,
          source: "line",
          ip,
          userAgent: ua,
        },
      });

      await tx.voteSelection.createMany({
        data: candidateIds.map((cid) => ({
          voteId: vote.id,
          electionId: Number(electionId),
          candidateId: cid,
        })),
      });
    });
    return { success: true, message: "บันทึกข้อมูลเรียบร้อย" };
  } catch (error) {
    console.error("Error submitting vote:", error);
    return { success: false, message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" };
  }
};

export const submitNoVote = async (electionId: string, memberId: string) => {
  if (!electionId || !memberId) {
    return { success: false, message: "Invalid election or member ID" };
  }
  const [election, already] = await Promise.all([
    prisma.election.findUnique({ where: { id: Number(electionId) } }),
    prisma.vote.findUnique({
      where: {
        electionId_memberId: {
          electionId: Number(electionId),
          memberId: memberId,
        },
      },
    }),
  ]);

  if (!election) {
    return { success: false, message: "ไม่พบการเลือกตั้ง" };
  }

  const now = convertZoneTimeToServer(new Date());
  if (now < election.startAt || now > election.endAt) {
    return { success: false, message: "ไม่อยู่ในช่วงเวลาลงคะแนนเสียง" };
  }
  if (already) {
    return { success: false, message: "คุณได้ลงคะแนนเสียงไปแล้ว" };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.vote.create({
        data: {
          electionId: Number(electionId),
          memberId: memberId!,
          source: "line",
        },
      });
    });
    return { success: true, message: "บันทึกข้อมูลเรียบร้อย" };
  } catch (error) {
    console.error("Error submitting no vote:", error);
    return { success: false, message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" };
  }
};
