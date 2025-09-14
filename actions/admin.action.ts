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
