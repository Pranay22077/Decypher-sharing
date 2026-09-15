import UiText, { useUiTranslation } from "../components/UiText";
import { useState, useRef, useEffect, useCallback } from "react";
import { Search, Shield, FileText, CheckCircle, ChevronRight, Upload, Lock, Video, Headphones, Image as ImageIcon, Database, ClipboardList, Brain, Eye, X } from "../components/icons";
import { evidence, EvidenceItem } from "../data/dummy";
import { api, appMode, browserSha256 } from "../lib/api";

import { createDocument, listDocuments, deleteDocument, type DemoDocument } from "../lib/documents/store";
import Scanner from "../components/documents/Scanner";
import DocumentWorkbench from "../components/documents/DocumentWorkbench";
import LocalDocumentDetails from "../components/documents/LocalDocumentDetails";
import { translateUi } from "../context/uiMessages";
import { useLocale } from "../context/LocaleContext";

function evidenceSummary(record: DemoDocument): EvidenceItem {
  return { id:record.id, type:record.mime.startsWith("image/")?"image":record.mime.startsWith("video/")?"video":record.mime.startsWith("audio/")?"audio":"document", title:record.name, source:"Browser-local demo intake", date:record.createdAt.slice(0,10), caseId:"CASE-2026-017", size:`${(record.original.size/1024/1024).toFixed(2)} MB`, hash:`sha256:${record.hash}`, uploadedBy:"Showcase visitor", status:"pending", entities:[] };
}

interface Props { onNavigate: (page: string, param?: string) => void; }

function statusStyle(s: string): React.CSSProperties {
  if (s === "processed") return { color: "var(--color-success)", borderColor: "var(--color-success)", background: "var(--color-surface-2)" };
  if (s === "processing") return { color: "var(--color-alert-medium)", borderColor: "var(--color-alert-medium)", background: "var(--color-surface-2)" };
  return { color: "var(--color-text-muted)", borderColor: "var(--color-border-strong)", background: "var(--color-surface-2)" };
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "document": return <FileText size={22} style={{ color: "var(--color-primary)" }} />;
    case "video": return <Video size={22} style={{ color: "var(--color-alert-high)" }} />;
    case "audio": return <Headphones size={22} style={{ color: "var(--color-success)" }} />;
    case "image": return <ImageIcon size={22} style={{ color: "var(--color-accent)" }} />;
    case "data": return <Database size={22} style={{ color: "var(--color-primary)" }} />;
    case "report": return <ClipboardList size={22} style={{ color: "var(--color-alert-medium)" }} />;
    default: return <FileText size={22} style={{ color: "var(--color-text-muted)" }} />;
  }
};

export default function EvidencePage({ onNavigate }: Props) {
  const trUi = useUiTranslation();
  const { locale } = useLocale(); const l = (en:string,hi:string)=>locale==="hi"?hi:en;
  const [documents, setDocuments] = useState<DemoDocument[]>([]);
  const [scanner, setScanner] = useState(appMode === "showcase" && new URLSearchParams(window.location.search).get("tool") === "document");
  const [editing, setEditing] = useState<string | null>(null);
  const closeWorkbench = useCallback(() => setEditing(null), []);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [showChain, setShowChain] = useState(false);

  // Upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStep, setUploadStep] = useState("");
  const [uploadComplete, setUploadComplete] = useState(false);
  const [localEvidence, setLocalEvidence] = useState<EvidenceItem[]>(evidence);
  const [loadError, setLoadError] = useState("");
  useEffect(() => {
    if (appMode !== "full") {
      let active = true;
      listDocuments().then(records => { if(active) { setDocuments(records); setLocalEvidence([...records.sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).map(evidenceSummary),...evidence]); } }).catch(cause => { if(active)setLoadError(cause.message); });
      return () => { active=false; };
    }
    api.listEvidence().then(items => setLocalEvidence(items.map(saved => ({ id:saved.id, type:saved.type as EvidenceItem["type"], title:saved.name, source:"Secure evidence intake", date:saved.created_at.slice(0,10), caseId:saved.case_id, size:`${(saved.size/1024/1024).toFixed(2)} MB`, hash:`sha256:${saved.sha256}`, uploadedBy:"Authenticated intake", status:saved.status === "analyzed" ? "processed" : "pending", entities:[] })))).catch(cause => { setLocalEvidence([]); setLoadError(cause.message); });
  }, []);

  const filtered = localEvidence.filter(ev => {
    const t = typeFilter === "all" || ev.type === typeFilter;
    const s = !search || ev.title.toLowerCase().includes(search.toLowerCase()) || ev.source.toLowerCase().includes(search.toLowerCase());
    return t && s;
  });

  const selectedEvidence = localEvidence.find(e => e.id === selected);

  const selectedLocal = documents.find(record=>record.id===selected);
  const editedDocument = documents.find(record=>record.id===editing);
  const updateDocument = (record:DemoDocument) => {
    setDocuments(current=>[record,...current.filter(item=>item.id!==record.id)]);
    setLocalEvidence(current=>[evidenceSummary(record),...current.filter(item=>item.id!==record.id)]);
  };
  const intake = async (file:File) => {
    setScanner(false); setIsUploading(true); setLoadError("");setUploadComplete(false);setUploadProgress(0);
    setUploadStep(l("Hashing and saving the original in this browser…","मूल फ़ाइल का हैश बनाकर इस ब्राउज़र में सहेजा जा रहा है…"));
    try { const record=await createDocument(file); updateDocument(record);setSelected(record.id);setEditing(record.id);setUploadProgress(100);setUploadComplete(true);setUploadStep(l("Original saved locally. Preview and adjust, then choose Run OCR if needed.","मूल फ़ाइल स्थानीय रूप से सहेजी गई। पूर्वावलोकन और सुधार के बाद चाहें तो OCR चलाएँ।")); }
    catch(cause) { setLoadError(cause instanceof Error?translateUi(cause.message,locale):"Upload failed."); }
    finally {setIsUploading(false);if(fileInputRef.current)fileInputRef.current.value="";}
  };
  const removeLocal = async (id:string) => {
    try {await deleteDocument(id);setDocuments(current=>current.filter(record=>record.id!==id));setLocalEvidence(current=>current.filter(record=>record.id!==id));setSelected(null);}
    catch(cause){setLoadError(cause instanceof Error?translateUi(cause.message,locale):"Delete failed.");}
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if(appMode === "showcase") { await intake(file); return; }

    if (file.size > 100 * 1024 * 1024) { setLoadError("Evidence must be 100 MB or smaller."); return; }
    setIsUploading(true);
    setUploadComplete(false);
    setUploadProgress(0);
    setUploadStep("Calculating deterministic SHA-256...");
    try {
      await browserSha256(file);
      setUploadProgress(35);
      setUploadStep("Uploading to MinIO secure storage...");
      const saved = await api.uploadEvidence("CASE-2026-017", file, "Uploaded during the Operation Nightfall demonstration.");
      const newItem: EvidenceItem = { id:saved.id, type:saved.type as EvidenceItem["type"], title:saved.name, source:"Secure evidence intake", date:saved.created_at.slice(0,10), caseId:saved.case_id, size:`${(saved.size/1024/1024).toFixed(2)} MB`, hash:`sha256:${saved.sha256}`, uploadedBy:"Current authenticated user", status:"processing", entities:[] };
      setUploadProgress(100); setUploadStep("Stored and hashed. Open the record to register and analyze it."); setUploadComplete(true); setLocalEvidence(current=>[newItem,...current]); setSelected(newItem.id);
    } catch (cause) {
      setUploadStep(cause instanceof Error ? cause.message : "Upload failed.");
    } finally {
      setIsUploading(false); if(fileInputRef.current) fileInputRef.current.value="";
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-base-bg)] text-[var(--color-text-primary)]">
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border-subtle)] px-6 py-8">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] mb-1"><UiText>Evidence Library</UiText></h1>
            <p className="text-[var(--color-text-secondary)] text-[14px]">CASE-2026-017 · {localEvidence.length}<UiText> items · </UiText><UiText>{appMode === "full" ? "Persistent secure intake" : "Fictional showcase evidence"}</UiText></p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {appMode === "showcase" && <button className="btn-premium-outline" disabled={isUploading} onClick={()=>setScanner(true)}>{l("Scan Document","दस्तावेज़ स्कैन करें")}</button>}
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
            <button className="btn-premium" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
              {isUploading ? <Loader className="animate-spin" size={16} /> : <Upload size={16} />}
              <UiText>{isUploading ? "Processing..." : "Upload Evidence"}</UiText>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {loadError && <div role="alert" className="gov-panel p-4 mb-4">{loadError}</div>}

        {/* Upload Progress Banner */}
        {(isUploading || uploadComplete) && (
          <div className="gov-panel p-5 mb-8" style={{ borderColor: uploadComplete ? "var(--color-success)" : "var(--color-primary)" }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-[14px] flex items-center gap-2">
                {uploadComplete ? <CheckCircle style={{ color: "var(--color-success)" }} size={16} /> : <Loader className="animate-spin text-[var(--color-primary)]" size={16} />}
                <UiText>{uploadComplete ? "Hashing and Intake Complete" : "Processing Evidence"}</UiText>
              </h3>
              <span className="text-[12px] font-mono text-[var(--color-text-muted)]">{uploadProgress}%</span>
            </div>

            <div className="w-full bg-[var(--color-surface-2)] rounded-sm h-1.5 mb-2 overflow-hidden border border-[var(--color-border-subtle)]">
              <div
                className="h-1.5 rounded-sm transition-all duration-500 ease-out"
                style={{ width: `${uploadProgress}%`, background: uploadComplete ? "var(--color-success)" : "var(--color-primary)" }}
              />
            </div>
            <p className="text-[12px] text-[var(--color-text-secondary)]">{uploadStep}</p>

            {uploadComplete && (
              <div className="mt-4 pt-4 border-t border-[var(--color-border-subtle)] flex items-start gap-4">
                <div className="p-2 bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] rounded-sm" style={{ color: "var(--color-success)" }}>
                  <Brain size={16} />
                </div>
                <div>
                  <div className="text-[12px] font-semibold text-[var(--color-text-primary)] mb-1"><UiText>{appMode === "full" ? "Analysis has not run yet" : "OCR is optional"}</UiText></div>
                  <div className="text-[11px] text-[var(--color-text-secondary)] mb-2"><UiText>{appMode === "full" ? "Open the stored record to register and analyze it. Showcase uploads remain browser-only." : "Preview and adjust your document, then select Run OCR. New demo files are stored only in this browser."}</UiText></div>
                </div>
                <button className="ml-auto text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors" onClick={() => setUploadComplete(false)}><UiText>Dismiss</UiText></button>
              </div>
            )}
          </div>
        )}

        {/* Search + filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border-strong)] focus-within:border-[var(--color-primary)] rounded-sm px-4 py-2.5 flex-1 min-w-[250px] transition-colors">
            <Search size={16} className="text-[var(--color-text-muted)]" />
            <input
              type="text"
              placeholder={trUi("Search evidence...")}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 text-[14px] bg-transparent outline-none text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {["all", "document", "video", "audio", "image", "data", "report"].map(t => (
              <button
                key={t}
                className={`gov-chip capitalize ${typeFilter === t ? "is-active" : ""}`}
                aria-pressed={typeFilter === t}
                onClick={() => setTypeFilter(t)}
              ><UiText>{t}</UiText></button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {filtered.map(ev => (
              <div
                key={ev.id}
                className={`gov-panel p-5 cursor-pointer transition-colors ${selected === ev.id ? "border-[var(--color-primary)]" : "hover:border-[var(--color-border-strong)]"}`}
                onClick={() => setSelected(s => s === ev.id ? null : ev.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] rounded-sm flex-shrink-0">
                    {getTypeIcon(ev.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-[var(--color-text-primary)] text-[14px]">{ev.title}</h3>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-sm border uppercase tracking-wider" style={statusStyle(ev.status)}><UiText>{ev.status}</UiText></span>
                    </div>
                    <p className="text-[12px] text-[var(--color-text-secondary)] mb-1.5"><UiText>{ev.source}</UiText> · {ev.date} · {ev.size}</p>
                    <p className="text-[10px] font-mono text-[var(--color-text-muted)] truncate mb-3">{ev.hash}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {ev.entities.slice(0, 5).map(e => (
                        <span key={e} className="text-[10px] bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] px-2 py-0.5 rounded-sm font-mono">{e}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 hidden sm:block">
                    {!ev.id.startsWith("LOCAL-") && <CheckCircle size={16} className="text-[var(--color-success)] ml-auto mb-2" />}
                    <div className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider"><UiText>Uploaded by</UiText></div>
                    <div className="text-[11px] text-[var(--color-text-primary)] font-medium mt-0.5"><UiText>{ev.uploadedBy}</UiText></div>
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="gov-panel p-10 text-center">
                <FileText size={32} className="text-[var(--color-text-muted)] mx-auto mb-3" />
                <p className="text-[14px] text-[var(--color-text-secondary)]"><UiText>No evidence matches your search filters.</UiText></p>
              </div>
            )}
          </div>

          {/* Detail panel */}
          <div className="space-y-4">
            {selectedLocal ? <LocalDocumentDetails record={selectedLocal} onEdit={()=>setEditing(selectedLocal.id)} onDelete={()=>void removeLocal(selectedLocal.id)} /> : selectedEvidence ? (
              <>
                <div className="gov-panel p-5">
                  <h3 className="font-bold text-[var(--color-text-primary)] text-[14px] mb-4 uppercase tracking-wider"><UiText>Evidence Details</UiText></h3>
                  <div className="space-y-3 text-[12px]">
                    {[
                      ["Evidence ID", selectedEvidence.id],
                      ["Type", selectedEvidence.type.toUpperCase()],
                      ["Source", selectedEvidence.source],
                      ["Date", selectedEvidence.date],
                      ["File Size", selectedEvidence.size],
                      ["Uploaded By", selectedEvidence.uploadedBy],
                      ["Case ID", selectedEvidence.caseId],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-3 border-b border-[var(--color-border-subtle)] pb-2 last:border-0 last:pb-0">
                        <span className="text-[var(--color-text-muted)]"><UiText>{k}</UiText></span>
                        <span className="font-medium text-[var(--color-text-primary)] text-right"><UiText>{v}</UiText></span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 p-3 bg-[var(--color-surface-2)] border rounded-sm" style={{ borderColor: "var(--color-success)" }}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Shield size={14} style={{ color: "var(--color-success)" }} />
                      <span className="text-[12px] font-semibold" style={{ color: "var(--color-success)" }}><UiText>Recorded identity — open record to verify</UiText></span>
                    </div>
                    <p className="text-[10px] font-mono text-[var(--color-text-muted)] break-all">{selectedEvidence.hash}</p>
                  </div>
                </div>

                <button
                  className="w-full gov-panel p-4 text-left flex items-center gap-3 hover:border-[var(--color-primary)] transition-colors group"
                  disabled={selectedEvidence.id.startsWith("LOCAL-")}
                  title={selectedEvidence.id.startsWith("LOCAL-") ? "Local secure service required for custody history" : "Open persisted evidence record"}
                  onClick={() => onNavigate("evidence-detail", selectedEvidence.id)}
                >
                  <div className="p-2 bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] rounded-sm text-[var(--color-primary)]">
                    <Lock size={16} />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors"><UiText>View Chain of Custody</UiText></div>
                    <div className="text-[11px] text-[var(--color-text-secondary)] mt-0.5"><UiText>Integrity and access history</UiText></div>
                  </div>
                  <ChevronRight size={14} className="text-[var(--color-text-muted)] ml-auto group-hover:text-[var(--color-primary)] transition-colors" />
                </button>

                <div className="flex gap-3">
                  {!selectedEvidence.id.startsWith("LOCAL-") && <button className="btn-premium btn-sm flex-1" onClick={() => onNavigate("evidence-detail", selectedEvidence.id)}><UiText>Open Record</UiText></button>}
                  <button className="btn-premium-outline btn-sm flex-1" onClick={() => onNavigate("graph")}><UiText>View in Graph</UiText></button>
                  <button className="btn-premium-outline btn-sm flex-1" onClick={() => onNavigate("timeline")}><UiText>View Timeline</UiText></button>
                </div>
              </>
            ) : (
              <div className="gov-panel p-8 text-center h-full min-h-[300px] flex flex-col items-center justify-center">
                <FileText size={32} className="text-[var(--color-text-muted)] mx-auto mb-4" />
                <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed"><UiText>Select an evidence item from the library to view its details, extracted entities, and verified chain of custody.</UiText></p>
              </div>
            )}
          </div>
        </div>
      </div>

      {scanner && <Scanner onClose={()=>setScanner(false)} onCapture={file=>void intake(file)} />}
      {editedDocument && <DocumentWorkbench key={editedDocument.id} record={editedDocument} onSaved={updateDocument} onClose={closeWorkbench} />}
      {/* Chain of Custody Modal */}
      {showChain && selectedEvidence && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: "rgba(11,24,45,0.55)" }}>
          <div className="gov-panel w-full max-w-[550px] p-0 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-2)]">
              <h2 className="font-bold text-[var(--color-text-primary)] text-[16px] flex items-center gap-2 tracking-tight">
                <Lock size={16} className="text-[var(--color-primary)]" /><UiText> Chain of Custody
              </UiText></h2>
              <button className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors p-1" onClick={() => setShowChain(false)} aria-label={trUi("Close")}>
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              <div className="relative pl-6 border-l-2 border-[var(--color-border-strong)] space-y-6 pb-2">
                {[
                  { action: "Evidence Uploaded", by: selectedEvidence.uploadedBy, time: `${selectedEvidence.date} 09:30`, icon: <Upload size={12} /> },
                  { action: "Hash Computed and Stored", by: "System", time: `${selectedEvidence.date} 09:30`, icon: <Lock size={12} /> },
                  { action: "Evidence Reviewed", by: "Sr. Insp. P. Verma", time: `${selectedEvidence.date} 11:15`, icon: <Eye size={12} /> },
                  { action: "Entities Extracted and Linked to Graph", by: "Decypher Engine (AI)", time: `${selectedEvidence.date} 11:20`, icon: <Brain size={12} /> },
                  { action: "Hash Re-Verified", by: "System (Automated)", time: "Just now", icon: <CheckCircle size={12} /> },
                ].map((c, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[35px] top-0 p-1.5 bg-[var(--color-surface)] border border-[var(--color-border-strong)] rounded-sm text-[var(--color-primary)]">
                      {c.icon}
                    </div>
                    <div className="bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] rounded-sm p-4 ml-2">
                      <div className="text-[13px] font-semibold text-[var(--color-text-primary)] mb-1">{c.action}</div>
                      <div className="text-[11px] text-[var(--color-text-secondary)] font-medium"><UiText>By: </UiText>{c.by}</div>
                      <div className="text-[10px] text-[var(--color-text-muted)] mt-1 font-mono">{c.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-[var(--color-surface-2)] border rounded-sm" style={{ borderColor: "var(--color-success)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={16} style={{ color: "var(--color-success)" }} />
                  <span className="text-[13px] font-semibold tracking-wide" style={{ color: "var(--color-success)" }}><UiText>Evidence Integrity: VERIFIED</UiText></span>
                </div>
                <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed"><UiText>Original SHA-256 hash matches the current cryptographic hash. No tampering or modifications detected since initial ingest.</UiText></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Loading spinner used during the upload/extraction flow.
function Loader({ className, size = 16 }: { className?: string, size?: number }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="2" x2="12" y2="6"></line>
      <line x1="12" y1="18" x2="12" y2="22"></line>
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
      <line x1="2" y1="12" x2="6" y2="12"></line>
      <line x1="18" y1="12" x2="22" y2="12"></line>
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
    </svg>
  );
}
