/* eslint-disable @next/next/no-img-element -- admin-managed and YouTube thumbnail URLs are dynamic */
"use client";

import { BookOpenText, ExternalLink, LibraryBig, LoaderCircle, Pencil, Plus, Radio, RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { GuideArtist, GuideContent, GuideEpisode, GuideGlossaryTerm } from "@/lib/types";

type Tab = "ARTISTS" | "GLOSSARY" | "EPISODES";
type ArtistDraft = Pick<GuideArtist, "slug" | "name" | "role" | "content" | "imageUrl">;
type GlossaryDraft = { id?: string; term: string; definition: string };
type EpisodeDraft = { id?: string; episodeNumber: string; title: string; description: string; imageUrl: string; youtubeUrl: string };

function youtubeThumbnail(url: string) {
  try {
    const parsed = new URL(url);
    const id = parsed.hostname === "youtu.be" ? parsed.pathname.slice(1) : parsed.searchParams.get("v");
    return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "";
  } catch {
    return "";
  }
}

export function AdminGuideManager() {
  const [content, setContent] = useState<GuideContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<Tab>("ARTISTS");
  const [artistDraft, setArtistDraft] = useState<ArtistDraft | null>(null);
  const [glossaryDraft, setGlossaryDraft] = useState<GlossaryDraft | null>(null);
  const [episodeDraft, setEpisodeDraft] = useState<EpisodeDraft | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/guide-content", { cache: "no-store" })
      .then(async (response) => {
        if (response.status === 401) {
          window.location.reload();
          return;
        }
        const result = await response.json();
        if (!active) return;
        if (!response.ok) toast.error(result.error || "Không thể tải dữ liệu Fan Guide.");
        else setContent(result);
      })
      .catch(() => active && toast.error("Không thể tải dữ liệu Fan Guide."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  async function mutate(payload: Record<string, unknown>, successMessage: string) {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/guide-content", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        toast.error(result.error || "Không thể lưu thay đổi.");
        return false;
      }
      setContent(result.content);
      toast.success(successMessage);
      return true;
    } catch {
      toast.error("Không thể kết nối tới máy chủ.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function saveArtist(event: React.FormEvent) {
    event.preventDefault();
    if (!artistDraft) return;
    const ok = await mutate({
      action: "UPSERT_ARTIST",
      slug: artistDraft.slug,
      role: artistDraft.role,
      content: artistDraft.content,
      imageUrl: artistDraft.imageUrl,
    }, `Đã cập nhật hồ sơ ${artistDraft.name}.`);
    if (ok) setArtistDraft(null);
  }

  async function clearArtist(artist: Pick<GuideArtist, "slug" | "name">) {
    if (!window.confirm(`Đưa hồ sơ ${artist.name} về trạng thái trống?`)) return;
    if (await mutate({ action: "DELETE_ARTIST", slug: artist.slug }, `Đã để trống hồ sơ ${artist.name}.`)) setArtistDraft(null);
  }

  async function saveGlossary(event: React.FormEvent) {
    event.preventDefault();
    if (!glossaryDraft) return;
    const payload = glossaryDraft.id
      ? { action: "UPDATE_GLOSSARY", ...glossaryDraft }
      : { action: "CREATE_GLOSSARY", term: glossaryDraft.term, definition: glossaryDraft.definition };
    if (await mutate(payload, glossaryDraft.id ? "Đã cập nhật từ điển." : "Đã thêm từ mới.")) setGlossaryDraft(null);
  }

  async function deleteGlossary(item: GuideGlossaryTerm) {
    if (!window.confirm(`Xóa từ “${item.term}” khỏi từ điển?`)) return;
    await mutate({ action: "DELETE_GLOSSARY", id: item.id }, "Đã xóa từ khỏi từ điển.");
  }

  async function saveEpisode(event: React.FormEvent) {
    event.preventDefault();
    if (!episodeDraft) return;
    const values = {
      episodeNumber: Number(episodeDraft.episodeNumber),
      title: episodeDraft.title,
      description: episodeDraft.description,
      imageUrl: episodeDraft.imageUrl,
      youtubeUrl: episodeDraft.youtubeUrl,
    };
    const payload = episodeDraft.id
      ? { action: "UPDATE_EPISODE", id: episodeDraft.id, ...values }
      : { action: "CREATE_EPISODE", ...values };
    if (await mutate(payload, episodeDraft.id ? "Đã cập nhật tập phát sóng." : "Đã thêm tập phát sóng.")) setEpisodeDraft(null);
  }

  async function deleteEpisode(item: GuideEpisode) {
    if (!window.confirm(`Xóa tập ${item.episodeNumber}: ${item.title}?`)) return;
    await mutate({ action: "DELETE_EPISODE", id: item.id }, "Đã xóa tập phát sóng.");
  }

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "ARTISTS", label: "Hồ sơ Fan Guide", count: content?.artists.length || 0 },
    { id: "GLOSSARY", label: "Từ điển Gai Con", count: content?.glossary.length || 0 },
    { id: "EPISODES", label: "Series phát sóng", count: content?.episodes.length || 0 },
  ];

  return (
    <div className="mt-12 rounded-[30px] border border-orange-100 bg-[#fffdfa] p-5 shadow-[0_16px_50px_rgba(120,53,15,.07)] md:p-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="eyebrow"><BookOpenText size={13} /> Nội dung Fan Guide</span>
          <h2 className="mt-3 text-2xl font-black tracking-tight md:text-3xl">Quản lý nội dung dùng chung</h2>
          <p className="mt-2 text-sm text-stone-500">Mọi thay đổi sẽ xuất hiện ở trang người dùng sau khi tải lại trang.</p>
        </div>
        {content ? <span className="w-fit rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800">{content.storage === "postgresql" ? "PostgreSQL · đang lưu thật" : "SQLite local · đang lưu thật"}</span> : null}
      </div>

      <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
        {tabs.map((item) => (
          <button key={item.id} onClick={() => setTab(item.id)} className={`shrink-0 cursor-pointer rounded-full px-4 py-2.5 text-sm font-bold transition ${tab === item.id ? "bg-stone-950 text-white" : "border border-stone-200 bg-white text-stone-600 hover:border-orange-300"}`}>
            {item.label} <span className="ml-1 opacity-60">{item.count}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid min-h-64 place-items-center"><LoaderCircle className="animate-spin text-orange-600" /></div>
      ) : !content ? (
        <div className="grid min-h-64 place-items-center text-sm text-stone-500">Không thể tải dữ liệu.</div>
      ) : tab === "ARTISTS" ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {content.artists.map((artist) => (
            <button key={artist.slug} onClick={() => setArtistDraft({ slug: artist.slug, name: artist.name, role: artist.role || "", content: artist.content || "", imageUrl: artist.imageUrl })} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-stone-100 bg-white p-3 text-left transition hover:border-orange-300 hover:bg-orange-50/30">
              <img src={artist.imageUrl} alt="" className="size-14 shrink-0 rounded-xl object-cover" />
              <span className="min-w-0 flex-1">
                <strong className="block truncate text-sm text-stone-900">{artist.name}</strong>
                <span className={`mt-1 block text-xs font-semibold ${artist.hasProfile ? "text-emerald-600" : "text-stone-400"}`}>{artist.hasProfile ? "Đã có nội dung" : "Đang để trống"}</span>
              </span>
              <Pencil size={15} className="shrink-0 text-stone-400" />
            </button>
          ))}
        </div>
      ) : tab === "GLOSSARY" ? (
        <div className="mt-6">
          <Button size="sm" onClick={() => setGlossaryDraft({ term: "", definition: "" })}><Plus size={16} /> Thêm từ mới</Button>
          <div className="mt-4 divide-y divide-stone-100 overflow-hidden rounded-2xl border border-stone-100 bg-white">
            {content.glossary.length ? content.glossary.map((item) => (
              <div key={item.id} className="flex items-start gap-4 px-4 py-4">
                <div className="min-w-0 flex-1"><strong className="text-sm text-stone-900">{item.term}</strong><p className="mt-1 text-sm leading-6 text-stone-500">{item.definition}</p></div>
                <button onClick={() => setGlossaryDraft({ id: item.id, term: item.term, definition: item.definition })} className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-stone-500 hover:bg-orange-50 hover:text-orange-700" aria-label={`Sửa ${item.term}`}><Pencil size={15} /></button>
                <button onClick={() => deleteGlossary(item)} className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-stone-400 hover:bg-red-50 hover:text-red-600" aria-label={`Xóa ${item.term}`}><Trash2 size={15} /></button>
              </div>
            )) : <div className="px-5 py-12 text-center text-sm text-stone-500">Chưa có từ nào.</div>}
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <Button size="sm" onClick={() => setEpisodeDraft({ episodeNumber: String((content.episodes.at(-1)?.episodeNumber || 0) + 1), title: "", description: "", imageUrl: "", youtubeUrl: "" })}><Plus size={16} /> Thêm tập phát sóng</Button>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {content.episodes.map((episode) => (
              <div key={episode.id} className="flex gap-3 rounded-2xl border border-stone-100 bg-white p-3">
                <img src={episode.imageUrl} alt="" className="h-20 w-32 shrink-0 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-black tracking-wider text-orange-600">TẬP {String(episode.episodeNumber).padStart(2, "0")}</span>
                  <strong className="mt-1 block line-clamp-2 text-sm text-stone-900">{episode.title}</strong>
                  <div className="mt-2 flex gap-1">
                    <a href={episode.youtubeUrl} target="_blank" rel="noreferrer" className="grid size-8 place-items-center rounded-full text-stone-400 hover:bg-stone-100" aria-label="Mở YouTube"><ExternalLink size={14} /></a>
                    <button onClick={() => setEpisodeDraft({ id: episode.id, episodeNumber: String(episode.episodeNumber), title: episode.title, description: episode.description || "", imageUrl: episode.imageUrl, youtubeUrl: episode.youtubeUrl })} className="grid size-8 cursor-pointer place-items-center rounded-full text-stone-500 hover:bg-orange-50 hover:text-orange-700" aria-label="Sửa tập"><Pencil size={14} /></button>
                    <button onClick={() => deleteEpisode(episode)} className="grid size-8 cursor-pointer place-items-center rounded-full text-stone-400 hover:bg-red-50 hover:text-red-600" aria-label="Xóa tập"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Dialog open={Boolean(artistDraft)} onOpenChange={(open) => !open && setArtistDraft(null)}>
        <DialogContent className="max-w-2xl">
          <DialogTitle>Cập nhật hồ sơ {artistDraft?.name}</DialogTitle>
          <DialogDescription>Quản lý thông tin của 34 Anh Tài và 4 thành viên ekip; có thể thay ảnh đại diện mặc định.</DialogDescription>
          {artistDraft ? (
            <form onSubmit={saveArtist} className="mt-6 grid gap-4">
              <label><span className="mb-2 block text-sm font-bold text-stone-700">Vai trò / nghề nghiệp</span><Input value={artistDraft.role || ""} onChange={(event) => setArtistDraft({ ...artistDraft, role: event.target.value })} placeholder="Ví dụ: Ca sĩ · Nhạc sĩ" /></label>
              <label><span className="mb-2 block text-sm font-bold text-stone-700">URL ảnh đại diện</span><Input type="url" value={artistDraft.imageUrl} onChange={(event) => setArtistDraft({ ...artistDraft, imageUrl: event.target.value })} required /></label>
              <label><span className="mb-2 block text-sm font-bold text-stone-700">Nội dung hồ sơ</span><Textarea className="min-h-48" value={artistDraft.content || ""} onChange={(event) => setArtistDraft({ ...artistDraft, content: event.target.value })} minLength={3} required placeholder="Câu chuyện, hành trình hoặc thông tin bạn muốn chia sẻ…" /></label>
              <div className="flex flex-wrap justify-between gap-3">
                <Button type="button" variant="danger" onClick={() => clearArtist(artistDraft)} disabled={saving || !content?.artists.find((item) => item.slug === artistDraft.slug)?.hasProfile}><RotateCcw size={16} /> Để trống hồ sơ</Button>
                <Button type="submit" disabled={saving}>{saving ? <LoaderCircle size={16} className="animate-spin" /> : <BookOpenText size={16} />} Lưu hồ sơ</Button>
              </div>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(glossaryDraft)} onOpenChange={(open) => !open && setGlossaryDraft(null)}>
        <DialogContent>
          <DialogTitle>{glossaryDraft?.id ? "Sửa từ trong từ điển" : "Thêm từ mới"}</DialogTitle>
          <DialogDescription>Từ mới sẽ xuất hiện trong mục Từ điển Gai Con ở Fan Guide.</DialogDescription>
          {glossaryDraft ? (
            <form onSubmit={saveGlossary} className="mt-6 grid gap-4">
              <label><span className="mb-2 block text-sm font-bold text-stone-700">Từ / cụm từ</span><Input value={glossaryDraft.term} onChange={(event) => setGlossaryDraft({ ...glossaryDraft, term: event.target.value })} maxLength={80} required /></label>
              <label><span className="mb-2 block text-sm font-bold text-stone-700">Định nghĩa</span><Textarea value={glossaryDraft.definition} onChange={(event) => setGlossaryDraft({ ...glossaryDraft, definition: event.target.value })} minLength={3} maxLength={1000} required /></label>
              <Button type="submit" disabled={saving}>{saving ? <LoaderCircle size={16} className="animate-spin" /> : <LibraryBig size={16} />} Lưu vào từ điển</Button>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(episodeDraft)} onOpenChange={(open) => !open && setEpisodeDraft(null)}>
        <DialogContent className="max-w-2xl">
          <DialogTitle>{episodeDraft?.id ? "Sửa tập phát sóng" : "Thêm tập phát sóng"}</DialogTitle>
          <DialogDescription>Website chỉ lưu ảnh đại diện và liên kết mở ngoài YouTube, không nhúng video.</DialogDescription>
          {episodeDraft ? (
            <form onSubmit={saveEpisode} className="mt-6 grid gap-4">
              <label><span className="mb-2 block text-sm font-bold text-stone-700">Số tập</span><Input type="number" min={1} max={99} value={episodeDraft.episodeNumber} onChange={(event) => setEpisodeDraft({ ...episodeDraft, episodeNumber: event.target.value })} required /></label>
              <label><span className="mb-2 block text-sm font-bold text-stone-700">Tiêu đề</span><Input value={episodeDraft.title} onChange={(event) => setEpisodeDraft({ ...episodeDraft, title: event.target.value })} minLength={2} maxLength={160} required /></label>
              <label><span className="mb-2 block text-sm font-bold text-stone-700">Mô tả ngắn</span><Textarea className="min-h-24" value={episodeDraft.description} onChange={(event) => setEpisodeDraft({ ...episodeDraft, description: event.target.value })} maxLength={1000} /></label>
              <label><span className="mb-2 block text-sm font-bold text-stone-700">Link YouTube</span><Input type="url" value={episodeDraft.youtubeUrl} onChange={(event) => setEpisodeDraft({ ...episodeDraft, youtubeUrl: event.target.value })} placeholder="https://www.youtube.com/watch?v=…" required /></label>
              <label><span className="mb-2 block text-sm font-bold text-stone-700">URL ảnh đại diện</span><div className="flex flex-col gap-2 sm:flex-row"><Input type="url" value={episodeDraft.imageUrl} onChange={(event) => setEpisodeDraft({ ...episodeDraft, imageUrl: event.target.value })} required /><Button type="button" variant="secondary" className="shrink-0" onClick={() => { const imageUrl = youtubeThumbnail(episodeDraft.youtubeUrl); if (!imageUrl) toast.error("Link YouTube chưa hợp lệ."); else setEpisodeDraft({ ...episodeDraft, imageUrl }); }}>Lấy ảnh từ YouTube</Button></div></label>
              <Button type="submit" disabled={saving}>{saving ? <LoaderCircle size={16} className="animate-spin" /> : <Radio size={16} />} Lưu tập phát sóng</Button>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
