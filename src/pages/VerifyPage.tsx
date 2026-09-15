import UiText from "../components/UiText";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle, Shield, X } from "../components/icons";
import { api, appMode } from "../lib/api";
import { useLocale } from "../context/LocaleContext";

import DemoVerification from "../components/documents/DemoVerification";

export default function VerifyPage({ onNavigate }: { onNavigate: (page:string,param?:string)=>void }) {
  const { token="" }=useParams(); const {locale}=useLocale(); const [data,setData]=useState<any>(null); const [error,setError]=useState("");
  useEffect(()=>{ if(token.startsWith("demo-v1")) return; if(appMode==="full") api.publicVerify(token).then(setData).catch(e=>setError(e.message)); else { const id=token.match(/ev-2026-\d+/i)?.[0]?.toUpperCase() || "EV-2026-0001"; setData({evidenceId:id,caseId:"CASE-2026-017",name:"Operation Nightfall synthetic evidence",type:"demo",status:"ANALYZED",blockchainRegistered:false}); } },[token]);
  if(token.startsWith("demo-v1")) return <DemoVerification token={token} onNavigate={onNavigate} />;
  return <div className="min-h-screen holographic-bg p-6 grid place-items-center"><div className="w-full max-w-2xl gov-panel overflow-hidden shadow-2xl"><div className="tricolor-strip"><div className="flag-saffron"/><div className="flag-white"/><div className="flag-green"/></div><div className="p-8"><p className="font-mono text-xs tracking-[.24em] text-[var(--color-primary)]">DECYPHER BY EPOCH</p><h1 className="text-3xl mt-2">{locale==="hi"?"साक्ष्य सत्यापन":"Evidence verification"}</h1>{error?<div className="mt-6 text-[var(--color-alert-critical)] flex gap-2"><X/>{error}</div>:!data?<p className="mt-6"><UiText>Verifying…</UiText></p>:<><div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">{[["Evidence ID",data.evidenceId],["Case",data.caseId],["Type",data.type],["Status",data.status]].map(([k,v])=><div className="p-4 bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)]" key={k}><p className="text-xs text-[var(--color-text-muted)]"><UiText>{k}</UiText></p><p className="font-mono font-semibold mt-1"><UiText>{v}</UiText></p></div>)}</div><div className={`mt-6 p-5 border ${data.blockchainRegistered?"border-[var(--color-success)]":"border-[var(--color-alert-medium)]"}`}><div className="flex items-center gap-2 font-semibold">{data.blockchainRegistered?<CheckCircle className="text-[var(--color-success)]"/>:<Shield className="text-[var(--color-alert-medium)]"/>}<UiText>{data.blockchainRegistered?"Blockchain anchor confirmed":"Blockchain anchor not registered"}</UiText></div><p className="text-sm text-[var(--color-text-secondary)] mt-2"><UiText>{appMode==="showcase"?"Public showcase mode never invents blockchain transactions. Use the local full stack to register and verify this record.":"The result was retrieved from the evidence database and local EVM record."}</UiText></p></div></>}<button className="btn-premium mt-6" onClick={()=>onNavigate("landing")}><UiText>Return to Decypher</UiText></button></div></div></div>;
}

