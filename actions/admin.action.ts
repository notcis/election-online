"use server";

import { prisma } from "@/lib/prisma";
import { convertZoneTimeToClient } from "@/utils/utils";
import { revalidatePath } from "next/cache";
import { success } from "zod";

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

export const getAllElections = async () => {
  const elections = await prisma.election.findMany({
    orderBy: { createdAt: "desc" },
  });

  if (elections.length === 0) {
    return [];
  }

  const formattedElections = elections.map((election) => ({
    ...election,
    year: election.year.toString(),
    maxSelections: election.maxSelections.toString(),
    startAt: convertZoneTimeToClient(election.startAt),
    endAt: convertZoneTimeToClient(election.endAt),
    isPublished: election?.isPublished ? "true" : "false",
  }));
  return formattedElections;
};

export async function getCandidates() {
  const candidates = await prisma.candidate.findMany({
    orderBy: { id: "asc" },
  });

  if (candidates.length === 0) {
    return [];
  }
  return candidates;
}

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
