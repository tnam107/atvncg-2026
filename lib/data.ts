import { localListPublicSubmissions } from "@/lib/local-database";
import { databaseConfigured, prisma } from "@/lib/prisma";
import type { PublicSubmission, SubmissionTypeValue } from "@/lib/types";

export async function getPublicSubmissions(type: SubmissionTypeValue): Promise<PublicSubmission[]> {
  if (!databaseConfigured) return localListPublicSubmissions(type);
  try {
    const items = await prisma.submission.findMany({
      where: { type, status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return items.map((item) => ({ ...item, createdAt: item.createdAt.toISOString() }));
  } catch (error) {
    console.error(`Failed to load ${type} submissions`, error);
    throw error;
  }
}
