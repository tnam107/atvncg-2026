/* eslint-disable @next/next/no-img-element -- moderation previews have runtime URLs and unknown dimensions */
"use client";

import { Check, Eye, Flame, LoaderCircle, LogOut, ShieldCheck, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AdminGuideManager } from "@/components/admin-guide-manager";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { formatDate, safeMediaUrl } from "@/lib/utils";
import type { PublicSubmission, SubmissionStatusValue } from "@/lib/types";

const typeLabels = { LETTER: "Tâm thư", MEMORY: "Khoảnh khắc", FANMADE: "Fan Made", CALL: "Dự án" };

export function AdminLogin({ showDevHint = false }: { showDevHint?: boolean }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password }) });
    const result = await response.json();
    if (!response.ok) { toast.error(result.error || "Không thể đăng nhập."); setLoading(false); return; }
    window.location.reload();
  }

  return (
    <section className="container-shell grid min-h-[70vh] place-items-center py-16">
      <div className="surface w-full max-w-md rounded-[30px] p-7 md:p-9">
        <div className="grid size-13 place-items-center rounded-2xl bg-stone-950 text-orange-400"><ShieldCheck size={24} /></div>
        <h1 className="mt-6 text-3xl font-black tracking-tight">Khu vực quản trị</h1>
        <p className="mt-2 text-sm leading-6 text-stone-500">Đăng nhập để xem và kiểm duyệt nội dung do cộng đồng gửi.</p>
        <form onSubmit={login} className="mt-7 grid gap-4">
          <label><span className="mb-2 block text-sm font-bold text-stone-700">Mật khẩu quản trị</span><Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required autoFocus autoComplete="current-password" placeholder="••••••••••••" /></label>
          <Button type="submit" size="lg" disabled={loading}>{loading ? <LoaderCircle size={17} className="animate-spin" /> : <ShieldCheck size={17} />}{loading ? "Đang xác minh…" : "Đăng nhập an toàn"}</Button>
        </form>
        {showDevHint && <p className="mt-5 rounded-xl bg-emerald-50 px-3 py-2 text-xs leading-5 text-emerald-800">Local dùng SQLite và tự động lưu vào <code className="font-bold">data/atvncg-local.sqlite</code>. Nếu chưa đặt <code className="font-bold">ADMIN_PASSWORD</code>, mật khẩu thử là <code className="font-bold">ATVNCG2026!admin</code>.</p>}
      </div>
    </section>
  );
}

export function AdminDashboard() {
  const [items, setItems] = useState<PublicSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<SubmissionStatusValue | "ALL">("PENDING");
  const [selected, setSelected] = useState<PublicSubmission | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/submissions", { cache: "no-store" })
      .then(async (response) => {
        if (response.status === 401) { window.location.reload(); return; }
        const result = await response.json();
        if (!active) return;
        if (!response.ok) toast.error(result.error || "Không thể tải danh sách.");
        else setItems(result.items);
      })
      .catch(() => active && toast.error("Không thể tải danh sách."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const visible = useMemo(() => filter === "ALL" ? items : items.filter((item) => item.status === filter), [filter, items]);
  const pending = items.filter((item) => item.status === "PENDING").length;

  async function moderate(item: PublicSubmission, action: "APPROVE" | "REJECT") {
    const adminNote = action === "REJECT" ? window.prompt("Lý do từ chối (bắt buộc):")?.trim() : undefined;
    if (action === "REJECT" && !adminNote) return;
    const response = await fetch(`/api/admin/submissions/${item.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ action, adminNote }) });
    const result = await response.json();
    if (!response.ok) { toast.error(result.error || "Thao tác thất bại."); return; }
    setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, status: action === "APPROVE" ? "APPROVED" : "REJECTED", adminNote: adminNote || null } : entry));
    setSelected(null);
    toast.success(action === "APPROVE" ? "Đã phê duyệt bài viết." : "Đã từ chối bài viết.");
  }

  async function remove(item: PublicSubmission) {
    if (!window.confirm("Xóa vĩnh viễn bài viết này? Thao tác không thể hoàn tác.")) return;
    const response = await fetch(`/api/admin/submissions/${item.id}`, { method: "DELETE" });
    if (!response.ok) { toast.error("Không thể xóa bài viết."); return; }
    setItems((current) => current.filter((entry) => entry.id !== item.id));
    setSelected(null);
    toast.success("Đã xóa bài viết.");
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  return (
    <section className="container-shell py-12 md:py-16">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div><span className="eyebrow"><Flame size={13} /> Moderation desk</span><h1 className="mt-4 text-4xl font-black tracking-[-.05em] md:text-5xl">Hàng chờ kiểm duyệt</h1><p className="mt-3 text-sm text-stone-500">{pending} nội dung đang đợi bạn xem.</p></div>
        <Button variant="secondary" onClick={logout}><LogOut size={16} /> Đăng xuất</Button>
      </div>

      <AdminGuideManager />

      <div className="mt-16 border-t border-orange-100 pt-10">
        <span className="eyebrow"><Flame size={13} /> Bài cộng đồng</span>
        <h2 className="mt-3 text-2xl font-black tracking-tight md:text-3xl">Kiểm duyệt nội dung gửi về</h2>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {(["PENDING", "APPROVED", "REJECTED", "ALL"] as const).map((status) => <button key={status} onClick={() => setFilter(status)} className={`cursor-pointer rounded-full px-4 py-2 text-sm font-bold ${filter === status ? "bg-stone-950 text-white" : "border border-stone-200 bg-white text-stone-600"}`}>{status === "PENDING" ? "Chờ duyệt" : status === "APPROVED" ? "Đã duyệt" : status === "REJECTED" ? "Từ chối" : "Tất cả"}</button>)}
      </div>

      <div className="mt-6 overflow-hidden rounded-[24px] border border-orange-100 bg-white shadow-sm">
        {loading ? <div className="grid min-h-60 place-items-center"><LoaderCircle className="animate-spin text-orange-600" /></div> : visible.length === 0 ? <div className="grid min-h-60 place-items-center px-4 text-center text-sm text-stone-500">Không có nội dung trong mục này.</div> : (
          <div className="overflow-x-auto"><table className="w-full min-w-[850px] border-collapse text-left text-sm"><thead className="bg-[#fff7e9] text-xs uppercase tracking-wider text-stone-500"><tr><th className="px-5 py-4">Loại</th><th className="px-5 py-4">Người gửi</th><th className="px-5 py-4">Nội dung</th><th className="px-5 py-4">Ngày gửi</th><th className="px-5 py-4 text-right">Thao tác</th></tr></thead><tbody className="divide-y divide-stone-100">{visible.map((item) => <tr key={item.id} className="align-top hover:bg-orange-50/30"><td className="px-5 py-5"><span className="rounded-full bg-orange-100 px-2.5 py-1 text-[11px] font-black text-orange-800">{typeLabels[item.type]}</span></td><td className="px-5 py-5 font-bold text-stone-800">{item.authorName}<span className="mt-1 block text-xs font-normal text-stone-400">{item.targetId || "—"}</span></td><td className="max-w-md px-5 py-5"><p className="line-clamp-2 font-semibold text-stone-800">{item.title || item.content}</p>{item.title && <p className="mt-1 line-clamp-1 text-xs text-stone-500">{item.content}</p>}</td><td className="px-5 py-5 text-xs text-stone-500">{formatDate(item.createdAt)}</td><td className="px-5 py-4"><div className="flex justify-end gap-1"><button onClick={() => setSelected(item)} className="grid size-9 cursor-pointer place-items-center rounded-full text-stone-500 hover:bg-stone-100" aria-label="Xem chi tiết"><Eye size={16} /></button>{item.status === "PENDING" && <><button onClick={() => moderate(item, "APPROVE")} className="grid size-9 cursor-pointer place-items-center rounded-full text-emerald-600 hover:bg-emerald-50" aria-label="Phê duyệt"><Check size={17} /></button><button onClick={() => moderate(item, "REJECT")} className="grid size-9 cursor-pointer place-items-center rounded-full text-red-600 hover:bg-red-50" aria-label="Từ chối"><X size={17} /></button></>}<button onClick={() => remove(item)} className="grid size-9 cursor-pointer place-items-center rounded-full text-stone-400 hover:bg-red-50 hover:text-red-600" aria-label="Xóa"><Trash2 size={16} /></button></div></td></tr>)}</tbody></table></div>
        )}
      </div>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          <DialogTitle>Chi tiết nội dung</DialogTitle><DialogDescription>Kiểm tra kỹ nội dung và media trước khi phê duyệt.</DialogDescription>
          {selected && <div className="mt-6"><div className="flex flex-wrap gap-2 text-xs font-bold"><span className="rounded-full bg-orange-100 px-3 py-1 text-orange-800">{typeLabels[selected.type]}</span><span className="rounded-full bg-stone-100 px-3 py-1 text-stone-600">{selected.authorName}</span>{selected.targetId && <span className="rounded-full bg-stone-100 px-3 py-1 text-stone-600">Gửi {selected.targetId}</span>}</div>{selected.title && <h2 className="mt-5 text-xl font-black">{selected.title}</h2>}<p className="mt-3 whitespace-pre-line text-sm leading-7 text-stone-700">{selected.content}</p>{safeMediaUrl(selected.mediaUrl) && (selected.mediaType === "VIDEO" ? <video src={safeMediaUrl(selected.mediaUrl)!} controls className="mt-5 max-h-80 w-full rounded-2xl bg-stone-100" /> : <img src={safeMediaUrl(selected.mediaUrl)!} alt="Media được gửi" className="mt-5 max-h-80 w-full rounded-2xl object-contain bg-stone-100" />)}{selected.status === "PENDING" && <div className="mt-6 grid grid-cols-2 gap-3"><Button onClick={() => moderate(selected, "APPROVE")}><Check size={17} /> Phê duyệt</Button><Button variant="danger" onClick={() => moderate(selected, "REJECT")}><X size={17} /> Từ chối</Button></div>}</div>}
        </DialogContent>
      </Dialog>
    </section>
  );
}
