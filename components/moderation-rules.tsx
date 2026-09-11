import { CheckCircle2, ShieldCheck, XCircle } from "lucide-react";

export function ModerationRules({
  approved,
  rejected,
  approvedTitle = "Được duyệt",
  rejectedTitle = "Không duyệt",
}: {
  approved: string[];
  rejected?: string[];
  approvedTitle?: string;
  rejectedTitle?: string;
}) {
  return (
    <section className="container-shell pt-16 md:pt-20">
      <div className="rounded-[30px] border border-orange-100 bg-white p-6 shadow-[0_16px_50px_rgba(120,53,15,.06)] md:p-9">
        <span className="eyebrow"><ShieldCheck size={13} /> Quy tắc xét duyệt</span>
        <div className={`mt-7 grid gap-5 ${rejected?.length ? "lg:grid-cols-2" : ""}`}>
          <div className="rounded-[24px] bg-emerald-50 p-5 md:p-6">
            <h2 className="flex items-center gap-2 font-black text-emerald-950"><CheckCircle2 size={20} /> {approvedTitle}</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-emerald-950/80">
              {approved.map((rule) => <li key={rule} className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-600" /><span>{rule}</span></li>)}
            </ul>
          </div>
          {rejected?.length ? (
            <div className="rounded-[24px] bg-red-50 p-5 md:p-6">
              <h2 className="flex items-center gap-2 font-black text-red-950"><XCircle size={20} /> {rejectedTitle}</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-red-950/80">
                {rejected.map((rule) => <li key={rule} className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-red-600" /><span>{rule}</span></li>)}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
