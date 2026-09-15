import UiText from "../components/UiText";
import { useState } from "react";
import { ClipboardList, FileText, Shield } from "../components/icons";
import { api, appMode, authToken, waitForJob } from "../lib/api";
import { useLocale } from "../context/LocaleContext";

export default function ReportsPage({onNavigate}:{onNavigate:(page:string,param?:string)=>void}) {
  const {locale}=useLocale(); const [busy,setBusy]=useState(false); const [message,setMessage]=useState("");
  async function generate() {
    setBusy(true); setMessage("");
    try {
      if (appMode === "showcase") {
        const a = document.createElement("a"); a.href = "/demo/nightfall-fir.pdf"; a.download = "CASE-2026-017-fictional-FIR.pdf"; a.click();
        setMessage("Downloaded the fictional FIR sample. Current investigation reports require the local backend.");
      } else {
        const queued = await api.generateReport("CASE-2026-017", locale);
        const report = await waitForJob(queued.jobId, status => setMessage(`Report ${status} · ${queued.jobId}`));
        const response = await fetch(api.downloadUrl(report.downloadUrl), { headers:{Authorization:`Bearer ${authToken()}`} });
        if (!response.ok) throw new Error("Report download failed.");
        const url = URL.createObjectURL(await response.blob()); const a = document.createElement("a"); a.href = url; a.download = `CASE-2026-017-${locale}.pdf`; a.click(); URL.revokeObjectURL(url);
        setMessage("Report generated from the current stored investigation state. Human review remains required.");
      }
    } catch (e) { setMessage(e instanceof Error ? e.message : "Report generation failed."); }
    finally { setBusy(false); }
  }
  const sections=["Case summary","Key findings","Timeline","Entities and relationships","Evidence register","Cross-case connections","Alerts","Chain of custody","Blockchain verification","Human review notice"];
  return <div className="min-h-screen bg-[var(--color-base-bg)]"><header className="bg-[var(--color-primary)] text-white p-8"><div className="max-w-[1100px] mx-auto"><p className="font-mono text-xs text-white/70">CASE-2026-017</p><h1 className="text-3xl !text-white mt-1">{locale==="hi"?"जाँच रिपोर्ट":"Investigation report"}</h1><p className="text-white/75 mt-2">{locale==="hi"?"स्रोत साक्ष्य और मानव समीक्षा के साथ":"With source evidence and mandatory human review"}</p></div></header><main className="max-w-[1100px] mx-auto p-6 grid lg:grid-cols-[1fr_320px] gap-6"><section className="gov-panel p-6"><div className="flex items-center gap-3 mb-6"><ClipboardList className="text-[var(--color-primary)]"/><div><h2 className="text-xl">Operation Nightfall</h2><p className="text-sm text-[var(--color-text-muted)]"><UiText>Decypher by Epoch · Fictional demonstration</UiText></p></div></div><div className="grid sm:grid-cols-2 gap-3">{sections.map((s,i)=><div className="p-4 border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)]" key={s}><span className="font-mono text-xs text-[var(--color-text-muted)]">{String(i+1).padStart(2,"0")}</span><p className="font-semibold mt-1"><UiText>{s}</UiText></p></div>)}</div></section><aside className="space-y-4"><div className="gov-panel p-5"><Shield className="text-[var(--color-success)]"/><h2 className="font-bold mt-3"><UiText>Traceability check</UiText></h2><p className="text-sm text-[var(--color-text-secondary)] mt-2"><UiText>Findings are included only when they reference stored evidence IDs.</UiText></p></div><button className="btn-premium w-full" disabled={busy} onClick={generate}><FileText size={15}/>{busy?(locale==="hi"?"बन रहा है…":"Generating…"):locale==="hi"?"PDF बनाएँ":"Generate & download PDF"}</button>{message&&<div className="gov-panel p-4 text-sm"><UiText>{message}</UiText></div>}<button className="btn-premium-outline w-full" onClick={()=>onNavigate("case-detail","CASE-2026-017")}><UiText>Back to case</UiText></button></aside></main></div>;
}
