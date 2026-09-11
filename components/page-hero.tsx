import type { LucideIcon } from "lucide-react";

export function PageHero({ eyebrow, title, description, icon: Icon, action }: { eyebrow: string; title: string; description: string; icon: LucideIcon; action?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-orange-100 bg-[#fff6e7]">
      <div className="absolute -right-24 -top-24 size-80 rounded-full border-[48px] border-orange-200/30" />
      <div className="container-shell relative flex min-h-[360px] flex-col items-start justify-end gap-8 py-14 md:flex-row md:items-end md:justify-between md:py-20">
        <div className="max-w-3xl">
          <span className="eyebrow"><Icon size={14} /> {eyebrow}</span>
          <h1 className="section-title mt-5 max-w-3xl text-stone-950">{title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-stone-600 md:text-lg">{description}</p>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </section>
  );
}
