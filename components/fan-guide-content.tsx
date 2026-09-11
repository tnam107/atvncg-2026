"use client";

import { BookOpenText, ExternalLink, Play, Radio, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { GuideContent } from "@/lib/types";

export function FanGuideContent({ content }: { content: GuideContent }) {
  return (
    <>
      <section className="container-shell py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="eyebrow"><Sparkles size={13} /> Sổ tay Anh Tài</span>
            <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">Những gương mặt thân quen</h2>
          </div>
          <span className="hidden text-sm font-semibold text-stone-400 md:block">34 Anh Tài · xếp theo alphabet</span>
        </div>

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {content.artists.map((artist, index) => (
            <Dialog key={artist.slug}>
              <DialogTrigger asChild>
                <button className="group cursor-pointer overflow-hidden rounded-[26px] border border-orange-100 bg-white p-3 text-left shadow-[0_12px_40px_rgba(120,53,15,.06)] transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-[0_18px_48px_rgba(120,53,15,.12)]">
                  <div className="relative aspect-[4/4.5] overflow-hidden rounded-[20px] bg-orange-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={artist.imageUrl}
                      alt={`Ảnh đại diện ${artist.name}`}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/75 to-transparent px-4 pb-4 pt-12">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${artist.hasProfile ? "bg-orange-500 text-white" : "bg-white/90 text-stone-600"}`}>
                        {artist.hasProfile ? "Đã có sổ tay" : "Chờ cập nhật"}
                      </span>
                    </div>
                  </div>
                  <div className="px-2 pb-2 pt-4">
                    <span className="text-[10px] font-black uppercase tracking-wider text-orange-600">Anh Tài {String(index + 1).padStart(2, "0")}</span>
                    <h3 className="mt-1 text-xl font-black tracking-tight text-stone-950">{artist.name}</h3>
                    <p className="mt-1 text-sm text-stone-500">{artist.role || "Sổ tay đang chờ admin cập nhật"}</p>
                  </div>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl p-0 sm:p-0">
                <div className="grid md:grid-cols-[240px_1fr]">
                  <div className="min-h-64 overflow-hidden bg-orange-100 md:min-h-[430px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={artist.imageUrl} alt={artist.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-6 sm:p-8">
                    <span className="eyebrow"><BookOpenText size={13} /> Sổ tay Anh Tài</span>
                    <DialogTitle className="mt-4">{artist.name}</DialogTitle>
                    <DialogDescription>{artist.role || "Thông tin đang chờ cập nhật"}</DialogDescription>
                    {artist.hasProfile ? (
                      <p className="mt-7 whitespace-pre-line border-t border-orange-100 pt-6 text-[15px] leading-7 text-stone-700">{artist.content}</p>
                    ) : (
                      <div className="mt-7 rounded-2xl border border-dashed border-orange-200 bg-orange-50/60 px-5 py-8 text-center">
                        <Sparkles className="mx-auto text-orange-400" size={22} />
                        <p className="mt-3 font-bold text-stone-800">Trang sổ tay này còn đang để trống</p>
                        <p className="mt-1 text-sm leading-6 text-stone-500">Admin sẽ bổ sung câu chuyện của Anh Tài trong thời gian tới.</p>
                      </div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </section>

      <section className="bg-stone-950 py-20 text-white">
        <div className="container-shell">
          <span className="eyebrow !text-orange-400"><Radio size={13} /> Series phát sóng</span>
          <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">Xem lại từng chặng đường</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-400">Chọn một tập để mở video trực tiếp trên YouTube. Website chỉ hiển thị ảnh đại diện và không nhúng trình phát.</p>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {content.episodes.map((episode) => (
              <a
                key={episode.id}
                href={episode.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="group overflow-hidden rounded-[24px] border border-white/10 bg-white/[.06] transition hover:-translate-y-1 hover:border-orange-400/60"
              >
                <div className="relative aspect-video overflow-hidden bg-stone-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={episode.imageUrl} alt={`Ảnh đại diện tập ${episode.episodeNumber}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 grid place-items-center bg-stone-950/20 transition group-hover:bg-stone-950/35">
                    <span className="grid size-14 place-items-center rounded-full bg-red-600 text-white shadow-xl"><Play size={22} fill="currentColor" /></span>
                  </div>
                </div>
                <div className="p-5">
                  <span className="text-xs font-black tracking-[.16em] text-orange-400">TẬP {String(episode.episodeNumber).padStart(2, "0")}</span>
                  <h3 className="mt-2 text-lg font-extrabold">{episode.title}</h3>
                  {episode.description ? <p className="mt-2 text-sm leading-6 text-stone-400">{episode.description}</p> : null}
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-orange-300">Mở trên YouTube <ExternalLink size={12} /></span>
                </div>
              </a>
            ))}
          </div>
          <p className="mt-5 flex items-center gap-2 text-xs text-stone-500"><ExternalLink size={12} /> Liên kết đến video trên kênh YEAH1 SHOW; nội dung được phát theo chính sách của YouTube.</p>
        </div>
      </section>

      <section className="container-shell py-20">
        <span className="eyebrow">Inside the fandom</span>
        <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">Từ điển Gai Con</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-500">Nội dung do admin cập nhật để lưu lại những cách gọi thân thương của cộng đồng.</p>
        {content.glossary.length ? (
          <div className="mt-10 divide-y divide-orange-100 border-y border-orange-100">
            {content.glossary.map((item, index) => (
              <div key={item.id} className="grid gap-3 py-7 md:grid-cols-[80px_220px_1fr] md:items-baseline">
                <span className="text-xs font-black text-orange-500">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="text-xl font-black">{item.term}</h3>
                <p className="max-w-2xl text-sm leading-6 text-stone-600">{item.definition}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-[2rem] border border-dashed border-orange-200 px-6 py-12 text-center text-sm text-stone-500">Từ điển đang chờ admin thêm nội dung.</div>
        )}
      </section>
    </>
  );
}
