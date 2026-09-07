import {
  Shield, Database, Brain, Network, Lock, Link, FileText, Users, MapPin,
  Phone, TrendingUp, Search, Zap, BarChart3, Clock, AlertCircle
} from "../components/icons";

interface Props {
  onNavigate: (page: string) => void;
}

export default function Capabilities({ onNavigate }: Props) {
  const capabilities = [
    {
      icon: <Database size={24} />,
      title: "Multi-Source Data Integration",
      description: "Ingest and integrate data from diverse sources including FIRs, case files, forensic reports, CDRs, financial transactions, CCTV footage, and social media. Process structured databases, unstructured documents, images, audio, and video with automated format conversion and validation."
    },
    {
      icon: <Brain size={24} />,
      title: "AI-Powered Entity Extraction",
      description: "NLP and machine learning models automatically identify and extract 14 or more entity types including persons, organizations, locations, vehicles, phone numbers, and bank accounts. Handle multilingual content in English, Hindi, and regional languages with contextual understanding."
    },
    {
      icon: <Network size={24} />,
      title: "Relationship Graph Analysis",
      description: "Build comprehensive knowledge graphs with 47 or more relationship types. Discover hidden connections through multi-hop traversal, community detection, centrality analysis, and path finding. Visualize complex networks in interactive 2D and immersive 3D views with real-time filtering."
    },
    {
      icon: <Shield size={24} />,
      title: "Pattern Detection and Anomalies",
      description: "Machine learning algorithms analyze communication patterns, financial flows, location movements, and behavioral indicators to identify anomalies, suspicious activities, and recurring modus operandi. Detect impossible travel, unusual transaction patterns, and coordinated activities."
    },
    {
      icon: <Lock size={24} />,
      title: "Security and Access Control",
      description: "Role-based access control (RBAC), multi-factor authentication, end-to-end encryption, and comprehensive audit trails. All activities are logged with timestamps and user attribution for accountability and compliance with law enforcement protocols and legal requirements."
    },
    {
      icon: <Link size={24} />,
      title: "Evidence Chain Management",
      description: "Maintain complete chain of custody for all evidence and analytical insights. Every connection, inference, and insight is traceable back to its source documents with cryptographic hashing and tamper detection, ensuring admissibility in court and transparency for judicial review."
    },
    {
      icon: <FileText size={24} />,
      title: "Case Intelligence Dashboard",
      description: "A unified command center providing a full view of investigations. Real-time analytics, timeline reconstruction, geospatial intelligence, financial flow analysis, and evidence management in a single platform. Track investigation progress, assign tasks, and collaborate across teams."
    },
    {
      icon: <Users size={24} />,
      title: "Entity Resolution and Deduplication",
      description: "Algorithms automatically resolve aliases, handle name variations, match partial information, and deduplicate entities across multiple data sources. Link the same person appearing as \"Raj Kumar\", \"R. Kumar\", or \"राज कुमार\" into a single canonical entity with confidence scores."
    },
    {
      icon: <MapPin size={24} />,
      title: "Geospatial Intelligence",
      description: "Plot entities, events, and activities on interactive maps with heat mapping, route analysis, geofencing, and proximity detection. Identify impossible travel patterns, frequent locations, meeting points, and operational areas. Integrate tower dump data, GPS traces, and CCTV locations."
    },
    {
      icon: <Phone size={24} />,
      title: "Communication Analysis",
      description: "Analyze call detail records (CDR), tower dumps, and other communication patterns. Identify frequent contacts, call clusters, communication bursts, and dormant periods. Visualize communication networks with temporal filtering and anomaly detection."
    },
    {
      icon: <TrendingUp size={24} />,
      title: "Financial Intelligence",
      description: "Track money trails through bank transactions, UPI payments, cash deposits, and cryptocurrency movements. Detect structuring, layering, and smurfing patterns. Link financial accounts to entities and uncover beneficial ownership structures."
    },
    {
      icon: <Search size={24} />,
      title: "Semantic Search and Discovery",
      description: "Search across all data using natural language queries. Find people, places, events, and relationships using fuzzy matching, phonetic search, and semantic understanding. Search by case ID, phone number, vehicle registration, address, or any entity attribute."
    },
    {
      icon: <Zap size={24} />,
      title: "Real-Time Alerts and Monitoring",
      description: "Configure custom alerts for specific patterns, entities, or activities. Get notified when suspects make contact, enter geofenced areas, conduct financial transactions, or when new evidence matches existing cases. Priority-based alert routing to relevant investigators."
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Analytics and Reporting",
      description: "Generate investigation reports, evidence summaries, network diagrams, timeline charts, and statistical analysis. Export court-ready documentation with evidence references, chain of custody, and analytical methodology. Support for PDF, Excel, and presentation formats."
    },
    {
      icon: <Clock size={24} />,
      title: "Timeline Reconstruction",
      description: "Automatically construct chronological timelines from disparate evidence sources. Correlate events across phone calls, financial transactions, location movements, and case activities. Identify temporal patterns, gaps in alibis, and the sequence of events leading to incidents."
    },
    {
      icon: <AlertCircle size={24} />,
      title: "Cross-Case Intelligence",
      description: "Discover connections between seemingly unrelated cases. Identify common entities, shared modus operandi, and linked criminal networks across multiple investigations. Enable inter-agency collaboration while maintaining data security and access controls."
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
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-5">Platform Capabilities</h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-[720px] mx-auto">
            Decypher combines AI, machine learning, and graph analytics to deliver comprehensive criminal network intelligence.
          </p>
        </div>
      </section>

      {/* Capabilities Grid (4-up on large screens: 16 cards form a clean 4x4) */}
      <section className="py-16">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {capabilities.map((cap, i) => (
              <div key={i} className="gov-panel gov-accent-top p-5">
                <div className="w-11 h-11 rounded-sm bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] text-[var(--color-primary)] flex items-center justify-center mb-4">
                  {cap.icon}
                </div>
                <h3 className="text-[15px] font-bold mb-2 leading-snug">{cap.title}</h3>
                <p className="text-[var(--color-text-secondary)] leading-relaxed text-[13px]">{cap.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Put These Capabilities to Work</h2>
          <p className="text-[var(--color-text-secondary)] mb-8">
            See how Decypher helps your team uncover critical insights and connections.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button className="btn-premium btn-lg" onClick={() => onNavigate("login")}>Access the Platform</button>
            <button className="btn-premium-outline btn-lg" onClick={() => onNavigate("how-it-works")}>See How It Works</button>
          </div>
        </div>
      </section>
    </div>
  );
}
