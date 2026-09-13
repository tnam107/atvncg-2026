"use client";

import { useState } from "react";
import { Heart, Quote } from "lucide-react";
import { FireButton } from "@/components/fire-button";
import type { PublicSubmission } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { artistCatalog } from "@/lib/guide-catalog";

export function LetterWall({ items }: { items: PublicSubmission[] }) {
  const [filter, setFilter] = useState("ALL");
  const catalogTargets = ["Tất cả Anh Tài", ...artistCatalog.map((artist) => artist.name)];
  const customTargets = Array.from(new Set(items.map((item) => item.targetId).filter((target): target is string => typeof target === "string" && !catalogTargets.includes(target))));
  const targets = ["ALL", ...catalogTargets, ...customTargets];
  const visible = filter === "ALL" ? items : items.filter((item) => item.targetId === filter);

  return (
    <>
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-xs font-extrabold uppercase tracking-[.14em] text-stone-400">Gửi cho ai · Anh Tài · nhóm · Nhà</p>
          <span className="text-xs text-stone-400">Kéo ngang để xem thêm →</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-3 [scrollbar-color:#fdba74_transparent] [scrollbar-width:thin]">
        {targets.map((target) => <button key={target} onClick={() => setFilter(target)} className={`shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-bold transition ${filter === target ? "bg-stone-900 text-white" : "border border-orange-100 bg-white text-stone-600 hover:border-orange-300"}`}>{target === "ALL" ? "Tất cả" : target}</button>)}
        </div>
      </div>
      <div className="masonry">
        {visible.map((item, index) => (
          <article key={item.id} className={`paper-texture relative overflow-hidden rounded-[24px] border p-6 shadow-[0_12px_40px_rgba(120,53,15,.07)] ${index % 3 === 1 ? "border-amber-200" : index % 3 === 2 ? "border-rose-200" : "border-orange-200"}`}>
            <Quote size={30} className="absolute right-5 top-5 text-orange-100" fill="currentColor" />
            <p className="text-xs font-extrabold uppercase tracking-wider text-orange-600">Gửi {item.targetId || "các Anh Tài"}</p>
            <p className="mt-5 whitespace-pre-line text-[15px] leading-7 text-stone-700">{item.content}</p>
            <div className="mt-6 flex items-end justify-between gap-3 border-t border-dashed border-orange-200 pt-4">
              <div>
                <p className="flex items-center gap-1.5 text-sm font-black text-stone-900"><Heart size={13} fill="currentColor" className="text-orange-500" />{item.authorName}</p>
                <p className="mt-1 text-[11px] text-stone-400">{formatDate(item.createdAt)}</p>
              </div>
              <FireButton id={item.id} initialCount={item.likesCount} compact />
            </div>
          </article>
        ))}
      </div>
      {visible.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-orange-200 bg-white/70 px-6 py-14 text-center">
          <p className="font-display text-2xl text-stone-900">Chưa có tâm thư gửi đến Anh Tài này</p>
          <p className="mt-2 text-sm text-stone-500">Bạn có thể là người đầu tiên gửi một lời nhắn thật ấm áp.</p>
        </div>
      ) : null}
    </>
  );
}
