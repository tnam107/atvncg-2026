"use client";

import type { SubmissionStatusValue, SubmissionTypeValue } from "@/lib/types";

export type TrackedSubmission = {
  token: string;
  id: string;
  type: SubmissionTypeValue;
  title: string | null;
  createdAt: string;
  lastStatus: SubmissionStatusValue;
  lastUpdatedAt: string;
};

const STORAGE_KEY = "atvncg-submission-tracking";
const MAX_TRACKED_SUBMISSIONS = 30;

function canUseStorage() {
  return typeof window !== "undefined";
}

export function getTrackedSubmissions(): TrackedSubmission[] {
  if (!canUseStorage()) return [];
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as unknown;
    if (!Array.isArray(value)) return [];
    return value.filter((item): item is TrackedSubmission => {
      if (!item || typeof item !== "object") return false;
      const candidate = item as Partial<TrackedSubmission>;
      return typeof candidate.token === "string"
        && typeof candidate.id === "string"
        && typeof candidate.type === "string"
        && typeof candidate.createdAt === "string"
        && (candidate.lastStatus === "PENDING" || candidate.lastStatus === "APPROVED" || candidate.lastStatus === "REJECTED");
    });
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

function saveTrackedSubmissions(items: TrackedSubmission[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_TRACKED_SUBMISSIONS)));
}

export function rememberSubmission(input: { token: string; id: string; type: SubmissionTypeValue; title?: string | null; createdAt: string }) {
  const current = getTrackedSubmissions().filter((item) => item.token !== input.token);
  saveTrackedSubmissions([
    {
      token: input.token,
      id: input.id,
      type: input.type,
      title: input.title || null,
      createdAt: input.createdAt,
      lastStatus: "PENDING",
      lastUpdatedAt: input.createdAt,
    },
    ...current,
  ]);
}

export function updateTrackedSubmission(token: string, status: SubmissionStatusValue, updatedAt: string) {
  const current = getTrackedSubmissions();
  saveTrackedSubmissions(current.map((item) => item.token === token ? { ...item, lastStatus: status, lastUpdatedAt: updatedAt } : item));
}

export function forgetTrackedSubmission(token: string) {
  saveTrackedSubmissions(getTrackedSubmissions().filter((item) => item.token !== token));
}
