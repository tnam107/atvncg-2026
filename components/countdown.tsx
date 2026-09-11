"use client";

import { useEffect, useState } from "react";

const episodeAt = process.env.NEXT_PUBLIC_NEXT_EPISODE_AT || "2026-09-19T20:00:00+07:00";

function difference() {
  const distance = Math.max(0, new Date(episodeAt).getTime() - Date.now());
  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1000) % 60),
  };
}

export function Countdown() {
  const [time, setTime] = useState<ReturnType<typeof difference> | null>(null);
  useEffect(() => {
    const kickoff = setTimeout(() => setTime(difference()), 0);
    const timer = setInterval(() => setTime(difference()), 1000);
    return () => { clearTimeout(kickoff); clearInterval(timer); };
  }, []);

  const units = [
    [time?.days ?? "--", "Ngày"],
    [time?.hours ?? "--", "Giờ"],
    [time?.minutes ?? "--", "Phút"],
    [time?.seconds ?? "--", "Giây"],
  ];
  return (
    <div className="grid grid-cols-4 gap-2" aria-label="Đếm ngược đến tập tiếp theo">
      {units.map(([value, label]) => (
        <div key={label} className="rounded-2xl border border-white/20 bg-white/10 px-2 py-3 text-center backdrop-blur md:px-4">
          <strong className="block text-2xl font-black tabular-nums md:text-3xl">{String(value).padStart(2, "0")}</strong>
          <span className="mt-1 block text-[10px] font-bold uppercase tracking-wider text-orange-100">{label}</span>
        </div>
      ))}
    </div>
  );
}
