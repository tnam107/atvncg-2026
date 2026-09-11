"use client";

import { ChevronLeft, ChevronRight, ExternalLink, Images } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const slides = [
  {
    src: "/images/home-gallery/03-khoanh-khac-tap-the.jpg",
    alt: "34 Anh Tài Anh Trai Vượt Ngàn Chông Gai 2026 cùng hội ngộ",
    caption: "Đủ 34 Anh Tài trong một khung hình",
    source: "Báo Xây dựng · Ảnh: NSX",
    sourceUrl: "https://baoxaydung.vn/anh-trai-vuot-ngan-chong-gai-2026-gay-sot-du-vap-tranh-cai-192260707161104528.htm",
  },
  {
    src: "/images/home-gallery/01-hoa-tam-34-anh-tai.jpg",
    alt: "Đội hình 34 Anh Tài trên sân khấu Hỏa Tâm",
    caption: "34 cá tính, chung một hành trình",
    source: "VTV · Ảnh: chương trình cung cấp",
    sourceUrl: "https://vtv.vn/anh-trai-vuot-ngan-chong-gai-2026-tung-bom-tan-ca-khuc-chu-de-100260624222812789.htm",
  },
  {
    src: "/images/home-gallery/04-hop-bao-34-anh-tai.jpg",
    alt: "Dàn Anh Tài tại sự kiện ra mắt chương trình năm 2026",
    caption: "Khoảnh khắc gặp gỡ trước giờ lên sóng",
    source: "VOV · Ảnh: BTC",
    sourceUrl: "https://vov.vn/giai-tri/anh-trai-vuot-ngan-chong-gai-2026-cong-bo-luat-choi-moi-34-anh-tai-doi-dau-post1308737.vov",
  },
  {
    src: "/images/home-gallery/02-doi-hinh-34-anh-tai.jpg",
    alt: "Ảnh tổng hợp đội hình Anh Trai Vượt Ngàn Chông Gai 2026",
    caption: "Mỗi gương mặt là một sắc màu riêng",
    source: "Mực Tím · Ảnh: ATVNCG",
    sourceUrl: "https://muctim.tuoitre.vn/anh-trai-vuot-ngan-chong-gai-2026-chieu-dai-khan-gia-17-tiet-muc-man-nhan-101260628020710075.htm",
  },
];

export function HomeGallery() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % slides.length), 6500);
    return () => window.clearInterval(timer);
  }, [paused]);

  const move = (direction: number) => setIndex((current) => (current + direction + slides.length) % slides.length);
  const active = slides[index];

  return (
    <div
      className="relative overflow-hidden rounded-[30px] border border-orange-200/80 bg-[#f7c98e] shadow-[0_28px_80px_rgba(154,52,18,.22)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return;
        const distance = (event.changedTouches[0]?.clientX ?? touchStart.current) - touchStart.current;
        if (Math.abs(distance) > 45) move(distance > 0 ? -1 : 1);
        touchStart.current = null;
      }}
    >
      <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[5/4]">
        <Image key={active.src} src={active.src} alt={active.alt} fill priority={index === 0} sizes="(min-width: 1024px) 470px, 90vw" className="gallery-zoom object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#612008]/90 via-transparent to-[#7c2d12]/10" />
        <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-[#fff7e8]/92 px-3 py-2 text-[10px] font-black uppercase tracking-[.15em] text-orange-900 shadow-sm backdrop-blur">
          <Images size={13} /> Khoảnh khắc ATVNCG
        </span>
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white sm:p-6">
          <p className="max-w-sm text-lg font-black leading-6 tracking-tight sm:text-xl">{active.caption}</p>
          <a href={active.sourceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-orange-100 transition hover:text-white">
            {active.source} <ExternalLink size={11} />
          </a>
        </div>
      </div>

      <button type="button" onClick={() => move(-1)} aria-label="Xem ảnh trước" className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-[#fff8ec]/92 text-orange-950 shadow-lg backdrop-blur transition hover:scale-105 hover:bg-white"><ChevronLeft size={20} /></button>
      <button type="button" onClick={() => move(1)} aria-label="Xem ảnh tiếp theo" className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-[#fff8ec]/92 text-orange-950 shadow-lg backdrop-blur transition hover:scale-105 hover:bg-white"><ChevronRight size={20} /></button>

      <div className="absolute right-5 top-5 flex gap-1.5 rounded-full bg-[#7c2d12]/55 px-2.5 py-2 backdrop-blur">
        {slides.map((slide, slideIndex) => (
          <button key={slide.src} type="button" onClick={() => setIndex(slideIndex)} aria-label={`Xem ảnh ${slideIndex + 1}`} className={`h-1.5 cursor-pointer rounded-full transition-all ${index === slideIndex ? "w-5 bg-white" : "w-1.5 bg-white/55 hover:bg-white"}`} />
        ))}
      </div>
    </div>
  );
}
