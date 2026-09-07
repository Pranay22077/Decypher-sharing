import { useState, useRef } from "react";
import { Search, Shield, FileText, CheckCircle, ChevronRight, Upload, Lock, Video, Headphones, Image as ImageIcon, Database, ClipboardList, Brain, Eye, X } from "../components/icons";
import { evidence, EvidenceItem } from "../data/dummy";

interface Props { onNavigate: (page: string) => void; }

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

  const filtered = localEvidence.filter(ev => {
    const t = typeFilter === "all" || ev.type === typeFilter;
    const s = !search || ev.title.toLowerCase().includes(search.toLowerCase()) || ev.source.toLowerCase().includes(search.toLowerCase());
    return t && s;
  });

  const selectedEvidence = localEvidence.find(e => e.id === selected);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Start simulated upload flow
    setIsUploading(true);
    setUploadComplete(false);
    setUploadProgress(0);
    setUploadStep("Hashing and encrypting file...");

    setTimeout(() => {
      setUploadProgress(30);
      setUploadStep("Uploading to secure storage...");
    }, 800);

    setTimeout(() => {
      setUploadProgress(60);
      setUploadStep("Extracting entities (NLP / NER)...");
    }, 1800);

    setTimeout(() => {
      setUploadProgress(90);
      setUploadStep("Updating knowledge graph...");
    }, 2800);

    setTimeout(() => {
      setUploadProgress(100);
      setUploadStep("Processing complete.");
      setIsUploading(false);
      setUploadComplete(true);

      // Add mock uploaded item
      const newItem: EvidenceItem = {
        id: `EVD-NEW-${Math.floor(Math.random() * 1000)}`,
        type: file.type.includes("image") ? "image" : file.type.includes("video") ? "video" : "document",
        title: file.name,
        source: "Manual Upload via Portal",
        date: new Date().toISOString().split("T")[0],
        caseId: "CASE-2026-017",
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        hash: `sha256:${Math.random().toString(36).substring(2, 15)}...`,
        uploadedBy: "Investigator (Current User)",
        status: "processed",
        entities: ["PERSON-F", "ORG-042", "LOCATION-NEW"],
      };

      setLocalEvidence([newItem, ...localEvidence]);
      setSelected(newItem.id);

      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }, 3800);
  };

  return (
    <div className="min-h-screen bg-[var(--color-base-bg)] text-[var(--color-text-primary)]">
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border-subtle)] px-6 py-8">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] mb-1">Evidence Library</h1>
            <p className="text-[var(--color-text-secondary)] text-[14px]">CASE-2026-017 · {localEvidence.length} items · All secured and hash-verified</p>
          </div>
          <div className="flex items-center gap-3">
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
            <button className="btn-premium" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
              {isUploading ? <Loader className="animate-spin" size={16} /> : <Upload size={16} />}
              {isUploading ? "Processing..." : "Upload Evidence"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-8">

        {/* Upload Progress Banner */}
        {(isUploading || uploadComplete) && (
          <div className="gov-panel p-5 mb-8" style={{ borderColor: uploadComplete ? "var(--color-success)" : "var(--color-primary)" }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-[14px] flex items-center gap-2">
                {uploadComplete ? <CheckCircle style={{ color: "var(--color-success)" }} size={16} /> : <Loader className="animate-spin" style={{ color: "var(--color-primary)" }} size={16} />}
                {uploadComplete ? "Upload and Extraction Complete" : "Processing Evidence"}
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
                  <div className="text-[12px] font-semibold text-[var(--color-text-primary)] mb-1">AI Extraction Results</div>
                  <div className="text-[11px] text-[var(--color-text-secondary)] mb-2">The system automatically extracted the following entities and added them to the knowledge graph:</div>
                  <div className="flex flex-wrap gap-2">
                    {["PERSON-F", "ORG-042", "LOCATION-NEW"].map(e => (
                      <span key={e} className="text-[10px] bg-[var(--color-surface-2)] border border-[var(--color-border-strong)] px-2 py-1 rounded-sm font-mono text-[var(--color-text-secondary)]">{e}</span>
                    ))}
                  </div>
                </div>
                <button className="ml-auto text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors" onClick={() => setUploadComplete(false)}>Dismiss</button>
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
              placeholder="Search evidence..."
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
              >{t}</button>
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
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-sm border uppercase tracking-wider" style={statusStyle(ev.status)}>{ev.status}</span>
                    </div>
                    <p className="text-[12px] text-[var(--color-text-secondary)] mb-1.5">{ev.source} · {ev.date} · {ev.size}</p>
                    <p className="text-[10px] font-mono text-[var(--color-text-muted)] truncate mb-3">{ev.hash}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {ev.entities.slice(0, 5).map(e => (
                        <span key={e} className="text-[10px] bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] px-2 py-0.5 rounded-sm font-mono">{e}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 hidden sm:block">
                    <CheckCircle size={16} className="text-[var(--color-success)] ml-auto mb-2" />
                    <div className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">Uploaded by</div>
                    <div className="text-[11px] text-[var(--color-text-primary)] font-medium mt-0.5">{ev.uploadedBy}</div>
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="gov-panel p-10 text-center">
                <FileText size={32} className="text-[var(--color-text-muted)] mx-auto mb-3" />
                <p className="text-[14px] text-[var(--color-text-secondary)]">No evidence matches your search filters.</p>
              </div>
            )}
          </div>

          {/* Detail panel */}
          <div className="space-y-4">
            {selectedEvidence ? (
              <>
                <div className="gov-panel p-5">
                  <h3 className="font-bold text-[var(--color-text-primary)] text-[14px] mb-4 uppercase tracking-wider">Evidence Details</h3>
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
                        <span className="text-[var(--color-text-muted)]">{k}</span>
                        <span className="font-medium text-[var(--color-text-primary)] text-right">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 p-3 bg-[var(--color-surface-2)] border rounded-sm" style={{ borderColor: "var(--color-success)" }}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Shield size={14} style={{ color: "var(--color-success)" }} />
                      <span className="text-[12px] font-semibold" style={{ color: "var(--color-success)" }}>Hash Verified: Integrity Confirmed</span>
                    </div>
                    <p className="text-[10px] font-mono text-[var(--color-text-muted)] break-all">{selectedEvidence.hash}</p>
                  </div>
                </div>

                <button
                  className="w-full gov-panel p-4 text-left flex items-center gap-3 hover:border-[var(--color-primary)] transition-colors group"
                  onClick={() => setShowChain(true)}
                >
                  <div className="p-2 bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] rounded-sm text-[var(--color-primary)]">
                    <Lock size={16} />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">View Chain of Custody</div>
                    <div className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">Integrity and access history</div>
                  </div>
                  <ChevronRight size={14} className="text-[var(--color-text-muted)] ml-auto group-hover:text-[var(--color-primary)] transition-colors" />
                </button>

                <div className="flex gap-3">
                  <button className="btn-premium-outline btn-sm flex-1" onClick={() => onNavigate("graph")}>View in Graph</button>
                  <button className="btn-premium-outline btn-sm flex-1" onClick={() => onNavigate("timeline")}>View Timeline</button>
                </div>
              </>
            ) : (
              <div className="gov-panel p-8 text-center h-full min-h-[300px] flex flex-col items-center justify-center">
                <FileText size={32} className="text-[var(--color-text-muted)] mx-auto mb-4" />
                <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">Select an evidence item from the library to view its details, extracted entities, and verified chain of custody.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chain of Custody Modal */}
      {showChain && selectedEvidence && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: "rgba(11,24,45,0.55)" }}>
          <div className="gov-panel w-full max-w-[550px] p-0 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-2)]">
              <h2 className="font-bold text-[var(--color-text-primary)] text-[16px] flex items-center gap-2 tracking-tight">
                <Lock size={16} className="text-[var(--color-primary)]" /> Chain of Custody
              </h2>
              <button className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors p-1" onClick={() => setShowChain(false)} aria-label="Close">
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
                      <div className="text-[11px] text-[var(--color-text-secondary)] font-medium">By: {c.by}</div>
                      <div className="text-[10px] text-[var(--color-text-muted)] mt-1 font-mono">{c.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-[var(--color-surface-2)] border rounded-sm" style={{ borderColor: "var(--color-success)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={16} style={{ color: "var(--color-success)" }} />
                  <span className="text-[13px] font-semibold tracking-wide" style={{ color: "var(--color-success)" }}>Evidence Integrity: VERIFIED</span>
                </div>
                <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">Original SHA-256 hash matches the current cryptographic hash. No tampering or modifications detected since initial ingest.</p>
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
