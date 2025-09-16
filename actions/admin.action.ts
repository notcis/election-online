"use server";

import { prisma } from "@/lib/prisma";
import { convertZoneTimeToClient } from "@/utils/utils";
import { revalidatePath } from "next/cache";

export const createElection = async (data: FormData) => {
  try {
    await prisma.election.create({
      data: {
        title: data.get("title") as string,
        year: parseInt(data.get("year") as string),
        maxSelections: parseInt(data.get("maxSelections") as string),
        startAt: new Date(data.get("startAt") as string),
        endAt: new Date(data.get("endAt") as string),
        isPublished: data.get("isPublished") === "true" ? true : false,
      },
    });

    revalidatePath(`/admin/e`);
    return {
      success: true,
      message: "Election created successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to create election",
    };
  }
};

export const editElection = async (id: string, data: FormData) => {
  try {
    await prisma.election.update({
      where: { id: Number(id) },
      data: {
        title: data.get("title") as string,
        year: parseInt(data.get("year") as string),
        maxSelections: parseInt(data.get("maxSelections") as string),
        startAt: new Date(data.get("startAt") as string),
        endAt: new Date(data.get("endAt") as string),
        isPublished: data.get("isPublished") === "true" ? true : false,
      },
    });

    revalidatePath(`/admin/e`);
    return {
      success: true,
      message: "Election updated successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to update election",
    };
  }
};

export const deleteElection = async (id: string) => {
  try {
    await prisma.election.delete({
      where: { id: Number(id) },
    });
    revalidatePath(`/admin/e`);
    return {
      success: true,
      message: "Election deleted successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to delete election",
    };
  }
};

export const getElectionById = async (id: string) => {
  const election = await prisma.election.findUnique({
    where: { id: Number(id) },
  });

  if (!election) {
    return null;
  }

  return {
    ...election,
    year: election.year.toString(),
    maxSelections: election.maxSelections.toString(),
    startAt: convertZoneTimeToClient(election.startAt),
    endAt: convertZoneTimeToClient(election.endAt),
    isPublished: election?.isPublished ? "true" : "false",
  };
};

export async function getAllElections(page = 1, perPage = 10) {
  const pageNumber = Math.max(1, Number(page) || 1);
  const take = Number(perPage) || 10;
  const skip = (pageNumber - 1) * take;

  const [total, elections] = await Promise.all([
    prisma.election.count(),
    prisma.election.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / take));

  if (elections.length === 0) {
    return {
      data: [],
      total,
      totalPages,
      page: pageNumber,
      perPage: take,
    };
  }

  const formattedElections = elections.map((election) => ({
    ...election,
    year: election.year.toString(),
    maxSelections: election.maxSelections.toString(),
    startAt: convertZoneTimeToClient(election.startAt),
    endAt: convertZoneTimeToClient(election.endAt),
    isPublished: election?.isPublished ? "true" : "false",
  }));

  return {
    data: formattedElections,
    total,
    totalPages,
    page: pageNumber,
    perPage: take,
  };
}

export async function getCandidates(page = 1, perPage = 10) {
  const pageNumber = Math.max(1, Number(page) || 1);
  const take = Number(perPage) || 10;
  const skip = (pageNumber - 1) * take;

  const [total, data] = await Promise.all([
    prisma.candidate.count(),
    prisma.candidate.findMany({
      orderBy: { id: "asc" },
      skip,
      take,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / take));

  if (data.length === 0) {
    return {
      data: [],
      total,
      totalPages,
      page: pageNumber,
      perPage: take,
    };
  }

  return {
    data,
    total,
    totalPages,
    page: pageNumber,
    perPage: take,
  };
}

export const getCandidateById = async (id: string) => {
  const candidate = await prisma.candidate.findUnique({
    where: { id: Number(id) },
  });
  if (!candidate) {
    return null;
  }

  return {
    ...candidate,
    id: candidate.id.toString(),
  };
};

export async function addCandidate(data: {
  name: string;
  bio?: string;
  photoUrl?: string;
}) {
  if (!data.name) {
    return { success: false, message: "Name is required" };
  }

  try {
    await prisma.candidate.create({ data });

    revalidatePath("/admin/c");
    return { success: true, message: "Candidate added successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to add candidate" };
  }
}

export async function updateCandidate(
  id: string,
  data: {
    name?: string;
    bio?: string;
    photoUrl?: string;
  }
) {
  if (!id) {
    return { success: false, message: "ID is required" };
  }

  try {
    await prisma.candidate.update({
      where: { id: Number(id) },
      data,
    });
    revalidatePath("/admin/c");
    return { success: true, message: "Candidate updated successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to update candidate" };
  }
}

export async function deleteCandidate(id: string) {
  if (!id) {
    return { success: false, message: "ID is required" };
  }
  try {
    await prisma.candidate.delete({ where: { id: Number(id) } });
    revalidatePath("/admin/c");
    return { success: true, message: "Candidate deleted successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to delete candidate" };
  }
}

export async function getElections() {
  const list = await prisma.election.findMany({
    orderBy: [{ year: "desc" }, { id: "desc" }],
    select: { id: true, title: true, year: true, maxSelections: true },
  });
  return list;
}

export async function getElectionEditorData(electionId: number) {
  if (!electionId || Number.isNaN(electionId))
    throw new Error("Invalid electionId");

  const [election, candidates, mappings] = await Promise.all([
    prisma.election.findUnique({
      where: { id: electionId },
      select: { id: true, title: true, year: true, maxSelections: true },
    }),
    prisma.candidate.findMany({
      orderBy: { id: "asc" },
      select: { id: true, name: true, photoUrl: true, bio: true },
    }),
    prisma.electionCandidate.findMany({
      where: { electionId },
      orderBy: { ballotNo: "asc" },
      select: { id: true, candidateId: true, ballotNo: true },
    }),
  ]);

  if (!election) throw new Error("Election not found");

  return { election, candidates, mappings };
}

export async function saveElectionCandidates(
  electionId: number,
  items: { candidateId: number; ballotNo: number }[]
) {
  if (!electionId || Number.isNaN(electionId))
    throw new Error("Invalid electionId");

  // validate ขั้นต้น
  if (!Array.isArray(items)) throw new Error("Invalid payload");
  // ballotNo ต้องเป็น int > 0 และไม่ซ้ำกัน
  const ballotSet = new Set<number>();
  for (const it of items) {
    if (!it.candidateId || !it.ballotNo)
      throw new Error("Invalid candidateId/ballotNo");
    if (it.ballotNo <= 0) throw new Error("หมายเลขบัตรต้องมากกว่า 0");
    if (ballotSet.has(it.ballotNo))
      throw new Error(`หมายเลขบัตรซ้ำ: ${it.ballotNo}`);
    ballotSet.add(it.ballotNo);
  }

  // ตรวจว่า candidate ที่ส่งมา “มีอยู่จริง”
  const ids = items.map((x) => x.candidateId);
  const existed = await prisma.candidate.findMany({
    where: { id: { in: ids } },
    select: { id: true },
  });
  if (existed.length !== ids.length) throw new Error("พบ candidate ไม่ถูกต้อง");

  await prisma.$transaction(async (tx) => {
    // ลบ mapping ที่หายไป
    await tx.electionCandidate.deleteMany({
      where: {
        electionId,
        candidateId: { notIn: ids.length ? ids : [0] },
      },
    });

    // upsert ทุกรายการ (ถ้ามีอยู่แล้ว อัปเดต ballotNo, ถ้าไม่มีให้สร้างใหม่)
    for (const it of items) {
      await tx.electionCandidate.upsert({
        where: {
          // ต้องมี unique composite ใน Prisma schema: @@unique([electionId, candidateId])
          electionId_candidateId: { electionId, candidateId: it.candidateId },
        },
        update: { ballotNo: it.ballotNo },
        create: {
          electionId,
          candidateId: it.candidateId,
          ballotNo: it.ballotNo,
        },
      });
    }

    // กัน ballotNo ซ้ำระดับฐานข้อมูล: unique (electionId, ballotNo)
    // ถ้ามี race เฉือนกัน transaction จะ throw error เอง
  });

  return { ok: true };
}
