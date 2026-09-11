"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Flame, UserRound, VenetianMask } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Identity = { mode: "nickname" | "anonymous"; nickname: string };
type IdentityContextValue = {
  identity: Identity | null;
  displayName: string;
  openIdentity: () => void;
  requireIdentity: (next: (identity: Identity) => void) => void;
};

const IdentityContext = createContext<IdentityContextValue | null>(null);
const STORAGE_KEY = "atvncg-identity";

export function IdentityProvider({ children }: { children: ReactNode }) {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Identity["mode"]>("nickname");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const pendingAction = useRef<((identity: Identity) => void) | null>(null);

  useEffect(() => {
    const hydrateIdentity = setTimeout(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return;
        const parsed = JSON.parse(saved) as Identity;
        if (parsed.mode === "anonymous" || (parsed.mode === "nickname" && parsed.nickname)) {
          setIdentity(parsed);
          setMode(parsed.mode);
          setNickname(parsed.nickname ?? "");
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }, 0);
    return () => clearTimeout(hydrateIdentity);
  }, []);

  const save = () => {
    const cleanName = nickname.trim();
    if (mode === "nickname" && cleanName.length < 2) {
      setError("Biệt danh cần ít nhất 2 ký tự.");
      return;
    }
    const nextIdentity: Identity = { mode, nickname: mode === "nickname" ? cleanName.slice(0, 40) : "" };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextIdentity));
    setIdentity(nextIdentity);
    setError("");
    setOpen(false);
    pendingAction.current?.(nextIdentity);
    pendingAction.current = null;
  };

  const openIdentity = useCallback(() => setOpen(true), []);
  const requireIdentity = useCallback(
    (next: (identity: Identity) => void) => {
      if (identity) next(identity);
      else {
        pendingAction.current = next;
        setOpen(true);
      }
    },
    [identity],
  );

  return (
    <IdentityContext.Provider
      value={{ identity, displayName: identity?.mode === "nickname" ? identity.nickname : identity ? "Ẩn danh" : "Chọn danh tính", openIdentity, requireIdentity }}
    >
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <div className="mb-5 grid size-12 place-items-center rounded-2xl bg-orange-100 text-orange-700">
            <Flame size={24} fill="currentColor" />
          </div>
          <DialogTitle>Bạn muốn được gọi là gì?</DialogTitle>
          <DialogDescription>
            Không cần tài khoản. Danh tính này chỉ được lưu trên thiết bị và có thể đổi bất kỳ lúc nào.
          </DialogDescription>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMode("nickname")}
              className={cn(
                "cursor-pointer rounded-2xl border p-4 text-left transition",
                mode === "nickname" ? "border-orange-400 bg-orange-50 ring-4 ring-orange-100" : "border-stone-200 bg-white hover:border-orange-200",
              )}
            >
              <UserRound className="mb-3 text-orange-600" size={22} />
              <span className="block text-sm font-extrabold text-stone-900">Dùng biệt danh</span>
              <span className="mt-1 block text-xs text-stone-500">Một cái tên thật riêng</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("anonymous")}
              className={cn(
                "cursor-pointer rounded-2xl border p-4 text-left transition",
                mode === "anonymous" ? "border-orange-400 bg-orange-50 ring-4 ring-orange-100" : "border-stone-200 bg-white hover:border-orange-200",
              )}
            >
              <VenetianMask className="mb-3 text-orange-600" size={22} />
              <span className="block text-sm font-extrabold text-stone-900">Ẩn danh</span>
              <span className="mt-1 block text-xs text-stone-500">Thoải mái sẻ chia</span>
            </button>
          </div>

          {mode === "nickname" && (
            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-bold text-stone-700">Biệt danh của bạn</span>
              <Input value={nickname} onChange={(event) => setNickname(event.target.value)} onKeyDown={(event) => event.key === "Enter" && save()} maxLength={40} placeholder="Ví dụ: Gai Con màu cam" autoFocus />
            </label>
          )}
          {error && <p className="mt-2 text-sm font-semibold text-red-600">{error}</p>}
          <Button onClick={save} className="mt-6 w-full" size="lg">
            Lưu và tiếp tục
          </Button>
        </DialogContent>
      </Dialog>
    </IdentityContext.Provider>
  );
}

export function useIdentity() {
  const context = useContext(IdentityContext);
  if (!context) throw new Error("useIdentity must be used inside IdentityProvider");
  return context;
}
