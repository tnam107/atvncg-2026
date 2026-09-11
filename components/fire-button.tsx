"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Flame } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function FireButton({ id, initialCount, compact = false }: { id: string; initialCount: number; compact?: boolean }) {
  const storageKey = `atvncg-fire-${id}`;
  const [fired, setFired] = useState(() => typeof window !== "undefined" && localStorage.getItem(storageKey) === "1");
  const [count, setCount] = useState(initialCount);
  const [burst, setBurst] = useState(false);

  async function fire() {
    if (fired) { toast.info("Bạn đã thả lửa cho bài này rồi 🔥"); return; }
    setFired(true);
    setCount((value) => value + 1);
    setBurst(true);
    localStorage.setItem(storageKey, "1");
    setTimeout(() => setBurst(false), 700);
    const response = await fetch(`/api/submissions/${id}/fire`, { method: "POST" });
    if (!response.ok && response.status !== 429) {
      setFired(false);
      setCount((value) => value - 1);
      localStorage.removeItem(storageKey);
    }
  }

  return (
    <button type="button" onClick={fire} className={cn("relative inline-flex cursor-pointer items-center gap-1.5 rounded-full font-extrabold transition", compact ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm", fired ? "bg-orange-100 text-orange-700" : "bg-stone-100 text-stone-600 hover:bg-orange-50 hover:text-orange-700")}>
      <motion.span animate={burst ? { scale: [1, 1.7, .9, 1], rotate: [0, -12, 8, 0] } : {}} transition={{ duration: .55 }}>
        <Flame size={compact ? 14 : 16} fill={fired ? "currentColor" : "none"} />
      </motion.span>
      {count}
      <AnimatePresence>
        {burst && [0, 1, 2, 3].map((particle) => (
          <motion.span key={particle} className="pointer-events-none absolute left-3 top-1 text-[10px] text-orange-500" initial={{ opacity: 1, x: 0, y: 0, scale: .7 }} animate={{ opacity: 0, x: (particle - 1.5) * 16, y: -26 - (particle % 2) * 8, scale: 1.2 }} exit={{ opacity: 0 }} transition={{ duration: .65 }}>🔥</motion.span>
        ))}
      </AnimatePresence>
    </button>
  );
}
