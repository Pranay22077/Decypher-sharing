import UiText from "../components/UiText";
import { Database, Brain, GitBranch, Network, Eye } from "../components/icons";

interface Props {
  onNavigate: (page: string) => void;
}

export default function HowItWorks({ onNavigate }: Props) {
  const steps = [
    {
      num: "01",
      icon: <Database size={26} />,
      title: "Data Ingestion and Preprocessing",
      description: "Upload and process authorized data from multiple sources including FIRs, case files, forensic reports, CDRs, financial records, CCTV footage, and digital evidence. The platform supports 50 or more file formats including PDFs, Word documents, Excel sheets, images, audio, and video. Automated validation checks data integrity, removes duplicates, and standardizes formats for consistent processing.",
      features: [
        "Multi-format support: documents, images, audio, video, databases",
        "Automated OCR for scanned documents and image-based text",
        "Data validation, deduplication, and quality assessment",
        "Secure upload with encryption and access logging",
        "Batch processing for large-scale data imports"
      ]
    },
    {
      num: "02",
      icon: <Brain size={26} />,
      title: "Entity Extraction and Recognition",
      description: "AI and NLP models automatically scan ingested content to identify and extract 14 or more entity types including persons, organizations, locations, vehicles, phone numbers, bank accounts, email addresses, and IP addresses. The system handles multilingual content, recognizes name variations and aliases, and extracts contextual information such as roles, relationships, and temporal references.",
      features: [
        "Named Entity Recognition (NER) for 14 or more entity types",
        "Multilingual support: English, Hindi, and regional languages",
        "Contextual extraction: roles, dates, amounts, relationships",
        "OCR integration for extracting text from images and scans",
        "Confidence scoring for each extracted entity"
      ]
    },
    {
      num: "03",
      icon: <GitBranch size={26} />,
      title: "Entity Resolution and Linking",
      description: "Algorithms resolve related entities across different sources, handling aliases, name variations, spelling mistakes, and inconsistent identifiers. The system uses fuzzy matching, phonetic algorithms, and machine learning to link \"Raj Kumar\", \"R. Kumar\", \"राज कुमार\", and \"Rajkumar\" to the same canonical entity. It discovers explicit relationships stated in documents and infers implicit relationships from co-occurrence patterns and shared attributes.",
      features: [
        "Fuzzy matching and phonetic algorithms for name variations",
        "Cross-lingual entity matching across English, Hindi, and regional languages",
        "Deduplication and canonical entity creation",
        "Relationship discovery: explicit and implicit connections",
        "Confidence-based entity merging with manual override"
      ]
    },
    {
      num: "04",
      icon: <Network size={26} />,
      title: "Graph Construction and Advanced Analytics",
      description: "Build comprehensive knowledge graphs representing entities as nodes and relationships as edges. Apply graph algorithms including community detection to identify criminal clusters, centrality analysis to find key actors, pathfinding to trace connections between suspects, temporal analysis to track relationship evolution, and anomaly detection to identify unusual patterns. Visualize networks in interactive 2D or immersive 3D views with real-time filtering.",
      features: [
        "Knowledge graph with 47 or more relationship types",
        "Community detection to identify organized groups and clusters",
        "Centrality analysis to find influential nodes and key actors",
        "Multi-hop pathfinding to trace connections up to N degrees",
        "Temporal analysis to track how networks evolve over time",
        "Interactive 2D and 3D visualizations with filtering"
      ]
    },
    {
      num: "05",
      icon: <Eye size={26} />,
      title: "Insight Generation and Reporting",
      description: "Present evidence-linked analytical insights through interactive dashboards, visualizations, timelines, and reports. All findings are explainable: every connection, pattern, or insight can be traced back to its source evidence with full transparency. Generate court-ready documentation with chain of custody, evidence references, analytical methodology, and confidence scores. Export findings in multiple formats for case briefings and judicial proceedings.",
      features: [
        "Interactive dashboards with real-time analytics",
        "Evidence-linked insights: every finding traceable to source",
        "Timeline reconstruction with event correlation",
        "Geospatial mapping and route analysis",
        "Network diagrams with relationship explanations",
        "Court-ready reports with evidence chain documentation",
        "Export options: PDF, Excel, PowerPoint, JSON"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-base-bg)] text-[var(--color-text-primary)]">
      {/* Hero */}
      <section className="bg-[var(--color-surface)] border-b border-[var(--color-border-subtle)] py-16">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="tricolor-strip w-16 mx-auto mb-5">
            <span className="flag-saffron" />
            <span className="flag-white" />
            <span className="flag-green" />
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-5"><UiText>How Decypher Works</UiText></h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-[720px] mx-auto"><UiText>
            A structured five-stage pipeline that transforms raw data into actionable intelligence.
          </UiText></p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="space-y-6">
            {steps.map((step, i) => (
              <div key={i}>
                <div className="gov-panel gov-accent-top p-6 md:p-7 flex flex-col md:flex-row gap-6">
                  {/* Number and Icon rail */}
                  <div className="flex md:flex-col items-center md:items-start gap-4 md:w-40 flex-shrink-0">
                    <div className="stat-number text-4xl font-bold text-[var(--color-border-strong)] leading-none">{step.num}</div>
                    <div className="w-12 h-12 rounded-sm bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] text-[var(--color-primary)] flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-3"><UiText>{step.title}</UiText></h3>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed mb-5 text-[15px]"><UiText>{step.description}</UiText></p>

                    <div className="bg-[var(--color-surface-2)] p-4 rounded-sm border border-[var(--color-border-subtle)]">
                      <h4 className="text-xs font-bold text-[var(--color-text-muted)] mb-3 uppercase tracking-widest"><UiText>Key Features</UiText></h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                        {step.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-[13px] text-[var(--color-text-secondary)]">
                            <span className="w-1.5 h-1.5 bg-[var(--color-primary)] flex-shrink-0 mt-1.5" />
                            <span><UiText>{feature}</UiText></span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Vertical connector between stages */}
                {i < steps.length - 1 && (
                  <div className="flex justify-center py-1">
                    <div className="w-px h-6 bg-[var(--color-border-strong)]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4"><UiText>See the Pipeline in Action</UiText></h2>
          <p className="text-[var(--color-text-secondary)] mb-8"><UiText>
            Move from raw data to evidence-linked insight inside the platform.
          </UiText></p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button className="btn-premium btn-lg" onClick={() => onNavigate("login")}><UiText>Access the Platform</UiText></button>
            <button className="btn-premium-outline btn-lg" onClick={() => onNavigate("capabilities")}><UiText>View Capabilities</UiText></button>
          </div>
        </div>
      </section>
    </div>
  );
}
