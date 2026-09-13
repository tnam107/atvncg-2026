"use client";

import { Bell, CheckCircle2, Clock3, LoaderCircle, Trash2, XCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { forgetTrackedSubmission, getTrackedSubmissions, updateTrackedSubmission, type TrackedSubmission } from "@/lib/submission-tracking";
import type { SubmissionStatusValue, SubmissionTypeValue } from "@/lib/types";

type StatusItem = {
  id: string;
  type: SubmissionTypeValue;
  title: string | null;
  status: SubmissionStatusValue;
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
};

const typeLabels: Record<SubmissionTypeValue, string> = {
  LETTER: "Tâm thư",
  MEMORY: "Khoảnh khắc",
  FANMADE: "Fan Made",
  CALL: "Dự án fandom",
};

const statusLabels: Record<SubmissionStatusValue, string> = {
  PENDING: "Đang chờ duyệt",
  APPROVED: "Đã được duyệt",
  REJECTED: "Chưa được duyệt",
};

function statusIcon(status: SubmissionStatusValue) {
  if (status === "APPROVED") return <CheckCircle2 size={17} className="text-emerald-600" />;
  if (status === "REJECTED") return <XCircle size={17} className="text-red-500" />;
  return <Clock3 size={17} className="text-orange-500" />;
}

function statusClass(status: SubmissionStatusValue) {
  if (status === "APPROVED") return "bg-emerald-50 text-emerald-700";
  if (status === "REJECTED") return "bg-red-50 text-red-700";
  return "bg-orange-50 text-orange-700";
}

export function SubmissionNotifications() {
  const [tracked, setTracked] = useState<TrackedSubmission[]>([]);
  const [statuses, setStatuses] = useState<Record<string, StatusItem>>({});
  const [open, setOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const inFlight = useRef(false);

  const sync = useCallback(async () => {
    if (inFlight.current) return;
    const current = getTrackedSubmissions();
    setTracked(current);
    if (current.length === 0) {
      setStatuses({});
      return;
    }

    inFlight.current = true;
    setSyncing(true);
    try {
      const responses = await Promise.all(current.map(async (submission) => {
        try {
          const response = await fetch("/api/submissions/status", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ token: submission.token }),
            cache: "no-store",
          });
          if (response.status === 404) {
            forgetTrackedSubmission(submission.token);
            return null;
          }
          if (!response.ok) return null;
          const result = await response.json() as { item?: StatusItem };
          return result.item ? { submission, item: result.item } : null;
        } catch {
          return null;
        }
      }));

      const nextStatuses: Record<string, StatusItem> = {};
      for (const result of responses) {
        if (!result) continue;
        const { submission, item } = result;
        nextStatuses[submission.token] = item;
        if (item.status !== submission.lastStatus && item.status !== "PENDING") {
          const title = item.title || typeLabels[item.type];
          if (item.status === "APPROVED") {
            toast.success(`Bài “${title}” đã được Admin duyệt.`);
          } else {
            toast.error(`Bài “${title}” chưa được duyệt${item.adminNote ? `: ${item.adminNote}` : "."}`);
          }
          updateTrackedSubmission(submission.token, item.status, item.updatedAt);
        }
      }
      setStatuses(nextStatuses);
      setTracked(getTrackedSubmissions());
    } finally {
      inFlight.current = false;
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    const initialSync = window.setTimeout(() => void sync(), 0);
    const interval = window.setInterval(() => void sync(), 60_000);
    const handleFocus = () => void sync();
    window.addEventListener("focus", handleFocus);
    return () => {
      window.clearTimeout(initialSync);
      window.clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [sync]);

  const finishedCount = tracked.filter((submission) => {
    const status = statuses[submission.token]?.status || submission.lastStatus;
    return status !== "PENDING";
  }).length;

  function remove(token: string) {
    forgetTrackedSubmission(token);
    setTracked(getTrackedSubmissions());
    setStatuses((current) => {
      const next = { ...current };
      delete next[token];
      return next;
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative grid size-10 cursor-pointer place-items-center rounded-full bg-white text-stone-700 shadow-sm transition hover:bg-orange-50 hover:text-orange-700"
        aria-label="Thông báo bài gửi"
        aria-expanded={open}
      >
        <Bell size={18} />
        {finishedCount > 0 && <span className="absolute right-0.5 top-0.5 grid min-w-4.5 translate-x-1/4 -translate-y-1/4 place-items-center rounded-full bg-orange-600 px-1 text-[10px] font-black leading-4 text-white">{finishedCount > 9 ? "9+" : finishedCount}</span>}
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-orange-100 bg-[#fffdfa] shadow-2xl">
          <div className="flex items-center justify-between border-b border-orange-100 px-4 py-3">
            <div>
              <p className="text-sm font-black text-stone-900">Bài gửi của bạn</p>
              <p className="mt-0.5 text-[11px] text-stone-500">Trạng thái được cập nhật tự động</p>
            </div>
            <button type="button" onClick={() => void sync()} className="grid size-8 cursor-pointer place-items-center rounded-full text-stone-400 transition hover:bg-orange-50 hover:text-orange-700" aria-label="Cập nhật trạng thái">
              <LoaderCircle size={15} className={syncing ? "animate-spin" : ""} />
            </button>
          </div>

          {tracked.length === 0 ? (
            <p className="px-4 py-8 text-center text-xs leading-5 text-stone-500">Bạn chưa có bài gửi nào được lưu trên thiết bị này.</p>
          ) : (
            <div className="max-h-80 overflow-y-auto p-2">
              {tracked.map((submission) => {
                const item = statuses[submission.token];
                const status = item?.status || submission.lastStatus;
                const title = item?.title || submission.title || typeLabels[submission.type];
                return (
                  <div key={submission.token} className="group rounded-xl px-3 py-3 transition hover:bg-orange-50/70">
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 shrink-0">{statusIcon(status)}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-extrabold text-stone-800">{title}</p>
                        <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${statusClass(status)}`}>{statusLabels[status]}</span>
                        {status === "REJECTED" && item?.adminNote && <p className="mt-2 text-[11px] leading-4 text-red-700">Lý do: {item.adminNote}</p>}
                      </div>
                      <button type="button" onClick={() => remove(submission.token)} className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-full text-stone-300 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100" aria-label="Bỏ theo dõi bài gửi">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
