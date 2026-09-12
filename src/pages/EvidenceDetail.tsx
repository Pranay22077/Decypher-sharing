import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle, ClipboardList, FileText, Lock, Shield, Upload, X } from "../components/icons";
import { api, ApiEvidence, appMode, authToken, waitForJob } from "../lib/api";
import { useLocale } from "../context/LocaleContext";

interface Props { onNavigate: (page: string, param?: string) => void; }

const demoFiles: Record<string, { name: string; path: string; type: string; mime: string }> = {
  "EV-2026-0001": { name: "FIR and initial field report", path: "/demo/nightfall-fir.pdf", type: "document", mime: "application/pdf" },
  "EV-2026-0002": { name: "Call detail records", path: "/demo/nightfall-cdr.csv", type: "data", mime: "text/csv" },
  "EV-2026-0003": { name: "Financial transaction export", path: "/demo/nightfall-transactions.csv", type: "data", mime: "text/csv" },
  "EV-2026-0004": { name: "Synthetic CCTV still", path: "/demo/nightfall-cctv-still.png", type: "image", mime: "image/png" },
  "EV-2026-0005": { name: "Synthetic dispatch audio", path: "/demo/nightfall-audio.wav", type: "audio", mime: "audio/wav" },
  "EV-2026-0006": { name: "Synthetic CCTV clip", path: "/demo/nightfall-cctv.mp4", type: "video", mime: "video/mp4" },
  "EV-2026-0007": { name: "Investigation note", path: "/demo/nightfall-investigation-note.txt", type: "document", mime: "text/plain" },
};

export default function EvidenceDetail({ onNavigate }: Props) {
  const { evidenceId = "EV-2026-0001" } = useParams();
  const { locale } = useLocale();
  const [item, setItem] = useState<ApiEvidence | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const demo = demoFiles[evidenceId] || demoFiles["EV-2026-0001"];

  useEffect(() => {
    let active = true; let objectUrl = ""; let qrObjectUrl = "";
    async function load() {
      setLoading(true); setError("");
      try {
        if (appMode === "full") {
          const loaded = await api.getEvidence(evidenceId); if (!active) return; setItem(loaded);
          const response = await fetch(api.fileUrl(evidenceId), { headers: { Authorization: `Bearer ${authToken()}` } });
          if (response.ok) { objectUrl = URL.createObjectURL(await response.blob()); setPreviewUrl(objectUrl); }
          const qrResponse = await fetch(api.qrUrl(evidenceId), { headers: { Authorization: `Bearer ${authToken()}` } });
          if (qrResponse.ok && active) { qrObjectUrl = URL.createObjectURL(await qrResponse.blob()); setQrUrl(qrObjectUrl); }
        } else {
          const response = await fetch(demo.path); const bytes = await response.arrayBuffer();
          const digest = await crypto.subtle.digest("SHA-256", bytes); const hash = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2,"0")).join("");
          if (!active) return;
          setQrUrl(`/demo/nightfall-${evidenceId.toLowerCase()}-qr.png`);
          setItem({ id:evidenceId, case_id:"CASE-2026-017", name:demo.name, description:"Synthetic evidence for the Operation Nightfall demonstration.", type:demo.type, mime_type:demo.mime, size:bytes.byteLength, sha256:hash, status:"analyzed", verification_token:`nightfall-${evidenceId.toLowerCase()}`, created_at:"2026-09-10T20:15:00+05:30", registered_at:null }); setPreviewUrl(demo.path);
        }
      } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to load evidence."); }
      finally { setLoading(false); }
    }
    load(); return () => { active=false; if (objectUrl) URL.revokeObjectURL(objectUrl); if (qrObjectUrl) URL.revokeObjectURL(qrObjectUrl); };
  }, [evidenceId, demo.path, demo.mime, demo.name, demo.type]);

  const lifecycle = useMemo(() => ["COLLECTED", "HASHED", item?.registered_at ? "BLOCKCHAIN ANCHORED" : "BLOCKCHAIN PENDING", "QR ATTACHED", appMode === "showcase" ? "CURATED DEMO FINDINGS" : item?.status === "analyzed" ? "ANALYZED" : "ANALYSIS PENDING", "HUMAN REVIEW PENDING"], [item]);
  async function action(kind: "register" | "analyze" | "verify") {
    if (appMode !== "full") { setNotice(locale === "hi" ? "यह क्रिया वास्तविक स्थानीय सुरक्षित सेवा पर उपलब्ध है। कोई नकली ब्लॉकचेन रिकॉर्ड नहीं बनाया गया।" : "This action is available on the real local secure service. No blockchain record has been fabricated."); return; }
    setBusy(kind); setNotice("");
    try {
      const result = kind === "register" ? await api.registerEvidence(evidenceId) : kind === "analyze" ? await api.analyzeEvidence(evidenceId) : await api.verifyEvidence(evidenceId);
      const analysis = kind === "analyze" ? await waitForJob(result.jobId, status => setNotice(`Analysis ${status} · ${result.jobId}`)) : null;
      setNotice(kind === "verify" ? `Integrity result: ${result.status}` : kind === "analyze" ? analysis?.summary || "Analysis completed." : `Confirmed in block ${result.blockNumber}.`);
      setItem(await api.getEvidence(evidenceId));
    } catch (cause) { setNotice(cause instanceof Error ? cause.message : "Operation failed."); }
    finally { setBusy(""); }
  }

  if (loading) return <State text={locale === "hi" ? "साक्ष्य लोड हो रहा है..." : "Loading evidence..."} />;
  if (error || !item) return <State text={error || "Evidence not found."} />;
  return (
    <div className="min-h-screen bg-[var(--color-base-bg)]">
      <header className="bg-[var(--color-primary)] text-white px-6 py-8">
        <div className="max-w-[1200px] mx-auto"><button className="text-sm text-white/75 hover:text-white mb-3" onClick={() => onNavigate("evidence")}>← {locale === "hi" ? "साक्ष्य सूची" : "Evidence library"}</button><p className="font-mono text-xs text-white/65">{item.id} · {item.case_id}</p><h1 className="text-3xl !text-white mt-1">{item.name}</h1><p className="text-white/75 mt-2">{locale === "hi" ? "काल्पनिक प्रदर्शन साक्ष्य — आधिकारिक रिकॉर्ड नहीं" : "Fictional demonstration evidence — not an official record"}</p></div>
      </header>
      <div className="max-w-[1200px] mx-auto p-6 grid lg:grid-cols-[1.35fr_.65fr] gap-6">
        <section className="space-y-6">
          <div className="gov-panel overflow-hidden min-h-[360px] bg-black flex items-center justify-center">
            {item.mime_type.startsWith("image/") && <img src={previewUrl} alt={item.name} className="w-full max-h-[600px] object-contain" />}
            {item.mime_type.startsWith("video/") && <video src={previewUrl} controls className="w-full max-h-[600px]" />}
            {item.mime_type.startsWith("audio/") && <div className="bg-[var(--color-surface)] w-full p-10"><audio src={previewUrl} controls className="w-full" /><p className="text-sm text-[var(--color-text-secondary)] mt-4">Synthetic radio-channel sample. Transcript is available in the evidence pack.</p></div>}
            {item.mime_type === "application/pdf" && <iframe title={item.name} src={previewUrl} className="w-full h-[620px] bg-white" />}
            {!/^(image|video|audio)\//.test(item.mime_type) && item.mime_type !== "application/pdf" && <a className="btn-premium" href={previewUrl} download>{locale === "hi" ? "फ़ाइल डाउनलोड करें" : "Download source file"}</a>}
          </div>
          <a className="btn-premium-outline" href={previewUrl} download={item.name}>{locale === "hi" ? "मूल साक्ष्य डाउनलोड करें" : "Download source evidence"}</a>
          <div className="gov-panel p-6"><h2 className="text-xl mb-4">{locale === "hi" ? "साक्ष्य जीवनचक्र" : "Evidence lifecycle"}</h2><div className="grid sm:grid-cols-3 gap-3">{lifecycle.map((step,index)=><div key={step} className="p-3 border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)]"><div className="flex items-center gap-2"><CheckCircle size={15} className={step.includes("PENDING") ? "text-[var(--color-text-muted)]" : "text-[var(--color-success)]"}/><span className="font-mono text-[11px] font-semibold">{step}</span></div><div className="text-[10px] text-[var(--color-text-muted)] mt-2">STEP {index+1}</div></div>)}</div></div>
        </section>
        <aside className="space-y-4">
          <div className="gov-panel holographic-bg p-5 text-center"><h2 className="text-sm font-bold mb-3">{locale === "hi" ? "साक्ष्य सत्यापन QR" : "Evidence verification QR"}</h2>{qrUrl && <img src={qrUrl} alt="Evidence verification QR code" className="w-44 h-44 mx-auto border-4 border-white" />}<p className="text-xs mt-3">{appMode === "showcase" ? "Demo QR targets localhost:8443; use the link on hosted previews." : "Opaque identity token; no evidence file is encoded."}</p><button className="btn-premium-outline btn-sm mt-3" onClick={() => onNavigate("verify", item.verification_token)}>{locale === "hi" ? "सत्यापन खोलें" : "Open verification"}</button></div>
          {notice && <div className="gov-panel p-4 border-[var(--color-saffron)] text-sm">{notice}<button aria-label="Dismiss" className="float-right" onClick={()=>setNotice("")}><X size={14}/></button></div>}
          <div className="gov-panel p-5"><h2 className="font-bold uppercase tracking-wider text-sm mb-4">{locale === "hi" ? "क्रिप्टोग्राफ़िक पहचान" : "Cryptographic identity"}</h2><p className="text-xs text-[var(--color-text-muted)]">SHA-256</p><p className="font-mono text-[11px] break-all mt-1 p-3 bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)]">{item.sha256}</p><button className="btn-premium-outline btn-sm mt-3" onClick={async()=>{await navigator.clipboard.writeText(item.sha256);setNotice("Hash copied.")}}>Copy hash</button></div>
          <div className="gov-panel p-5"><h2 className="font-bold uppercase tracking-wider text-sm mb-4">Blockchain proof</h2>{item.blockchain ? <div className="text-sm text-[var(--color-success)]"><Shield size={18} className="inline mr-2"/>CONFIRMED<p className="font-mono text-[10px] break-all mt-3">{String(item.blockchain.transactionHash)}</p></div> : <div><p className="text-sm text-[var(--color-text-secondary)]">{appMode === "full" ? "Not registered yet." : "Unavailable in public showcase mode."}</p><button className="btn-premium btn-sm mt-3" disabled={busy!==""} onClick={()=>action("register")}><Lock size={14}/>Register evidence</button></div>}</div>
          <div className="gov-panel p-5"><h2 className="font-bold uppercase tracking-wider text-sm mb-3">Actions</h2><div className="grid gap-2"><button className="btn-premium-outline" disabled={busy!==""} onClick={()=>action("analyze")}><Upload size={14}/>Run analysis</button><button className="btn-premium-outline" disabled={busy!==""} onClick={()=>action("verify")}><CheckCircle size={14}/>Verify integrity</button><button className="btn-premium-outline" onClick={()=>onNavigate("graph")}><FileText size={14}/>Open graph</button><button className="btn-premium-outline" onClick={()=>onNavigate("reports")}><ClipboardList size={14}/>Generate report</button></div></div>
        </aside>
      </div>
    </div>
  );
}

function State({text}:{text:string}) { return <div className="min-h-[60vh] grid place-items-center bg-[var(--color-base-bg)]"><div className="gov-panel p-8 text-[var(--color-text-secondary)]">{text}</div></div>; }
