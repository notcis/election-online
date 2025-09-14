"use server";

import { prisma } from "@/lib/prisma";

export const getElectionDetails = async (electionId: string) => {
  if (!electionId) {
    return {
      election: null,
    };
  }

  const election = await prisma.election.findUnique({
    where: { id: Number(electionId) },
    include: {
      candidates: {
        orderBy: { ballotNo: "asc" },
        include: { candidate: true },
      },
    },
  });

  if (!election) {
    return {
      election: null,
    };
  }

  return {
    election: election,
  };
};
