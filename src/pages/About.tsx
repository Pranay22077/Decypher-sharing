import UiText from "../components/UiText";
import { Target, Users, Lightbulb, TrendingUp, Shield, Globe, Award, Heart, Zap } from "../components/icons";

interface Props {
  onNavigate: (page: string) => void;
}

export default function About({ onNavigate }: Props) {
  const mission = [
    {
      icon: <Target size={24} />,
      title: "Our Mission",
      description: "To empower law enforcement and intelligence agencies across India with advanced AI-powered investigative tools that transform fragmented, disconnected data into connected, explainable, and actionable intelligence. Our mission is to help protect communities, solve complex criminal cases faster, and bring justice to victims by giving investigators the technological capabilities they need to uncover hidden networks, trace criminal activities, and build evidence-backed cases that stand up in court."
    },
    {
      icon: <Lightbulb size={24} />,
      title: "Our Vision",
      description: "A future where every investigative team, from metropolitan police to district crime branches to specialized agencies, has access to world-class, transparent, and explainable AI systems that augment human judgment rather than replace it. We envision a criminal justice ecosystem where technology enables faster case resolution, reduces investigation time from months to days, prevents crimes through early detection, and ensures that no criminal connection goes unnoticed, no matter how hidden or complex."
    },
    {
      icon: <TrendingUp size={24} />,
      title: "Our Approach",
      description: "We combine artificial intelligence, machine learning, natural language processing, and graph analytics with a deep understanding of Indian investigative workflows, legal requirements (IT Act, Evidence Act, CrPC), and the ground realities of policing. We build tools that are powerful yet intuitive, sophisticated yet explainable, effective yet responsible, and globally competitive yet contextually Indian, supporting multilingual content, regional variations, and jurisdiction-specific needs."
    }
  ];

  const values = [
    {
      icon: <Shield size={22} />,
      title: "Transparency",
      description: "Every insight is traceable to its source evidence. No black boxes and no unexplainable AI, just clear, evidence-backed intelligence."
    },
    {
      icon: <Users size={22} />,
      title: "Human-Centric Design",
      description: "Technology that supports and amplifies human judgment, not replaces it. Investigators remain in control of all decisions."
    },
    {
      icon: <Globe size={22} />,
      title: "Responsibility and Ethics",
      description: "Ethical AI practices, robust data governance, privacy protection, and compliance with legal frameworks at the core of everything we build."
    },
    {
      icon: <Award size={22} />,
      title: "Excellence",
      description: "Commitment to building world-class technology that meets the highest standards of accuracy, reliability, and performance."
    },
    {
      icon: <Heart size={22} />,
      title: "Service to Nation",
      description: "Contributing to national security and public safety through technology innovation that serves law enforcement and protects citizens."
    },
    {
      icon: <Zap size={22} />,
      title: "Innovation",
      description: "Continuously advancing the state of the art in investigative technology while staying grounded in practical, real-world needs."
    }
  ];

  const whatWeDo = {
    overview: "Decypher is an AI-powered criminal network intelligence platform designed specifically for Indian law enforcement and intelligence agencies. We help investigators make sense of complex, fragmented data by automatically discovering relationships, patterns, and insights that would be difficult, time-consuming, or impossible to find through manual analysis.",
    capabilities: [
      "<strong>Multi-Source Integration</strong>: We ingest and integrate data from FIRs, case files, forensic reports, call detail records (CDR), financial transactions, CCTV footage, social media, and more, bringing everything into a unified analytical environment.",
      "<strong>Entity Extraction</strong>: Our AI automatically identifies and extracts persons, organizations, locations, vehicles, phone numbers, bank accounts, and other entities from unstructured documents, handling English, Hindi, and regional languages.",
      "<strong>Relationship Discovery</strong>: We do not just find entities; we discover how they are connected. Phone calls, financial transactions, shared addresses, co-occurrence in documents, family relationships, and business associations, all mapped into a comprehensive knowledge graph.",
      "<strong>Pattern Recognition</strong>: Machine learning algorithms identify suspicious patterns, anomalies, and modus operandi. Detect impossible travel, unusual transaction flows, communication bursts, and coordinated activities.",
      "<strong>Visualization and Analytics</strong>: Interactive 2D and 3D network graphs, timeline reconstruction, geospatial mapping, and financial flow analysis, all designed to help investigators see the big picture and understand complex criminal networks.",
      "<strong>Evidence Chain</strong>: Every finding is linked to its source evidence with complete chain of custody, ensuring transparency, admissibility in court, and accountability."
    ],
    approach: "Most importantly, we build our technology with <strong>transparency and responsibility</strong> at the core. Every connection, insight, and pattern discovered by Decypher is explainable and traceable back to its source evidence. Human investigators remain in control of all decisions. Decypher provides intelligence support, not autonomous decision-making.",
    impact: "By automating the time-consuming work of data processing, entity extraction, and relationship mapping, Decypher frees investigators to focus on what humans do best: critical thinking, strategic planning, interviewing suspects, and building cases. What once took weeks of manual analysis can now be done in hours, enabling faster case resolution and more effective use of investigative resources."
  };

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
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-5"><UiText>About Decypher</UiText></h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-[700px] mx-auto"><UiText>
            Transforming criminal intelligence through responsible AI innovation, built for India's investigative agencies.
          </UiText></p>
        </div>
      </section>

      {/* Mission, Vision, Approach (stacked horizontal cards, not a 3-up row) */}
      <section className="py-16">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="space-y-5">
            {mission.map((item, i) => (
              <div key={i} className="gov-panel gov-accent-top p-6 md:p-7 flex flex-col md:flex-row gap-5 md:gap-8">
                <div className="flex items-start gap-4 md:w-72 flex-shrink-0">
                  <div className="w-12 h-12 rounded-sm bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mt-1.5"><UiText>{item.title}</UiText></h3>
                </div>
                <p className="text-[15px] text-[var(--color-text-secondary)] leading-relaxed flex-1"><UiText>{item.description}</UiText></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 bg-[var(--color-surface)] border-y border-[var(--color-border-subtle)]">
        <div className="max-w-[1000px] mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8"><UiText>What We Do</UiText></h2>

          <p className="text-base text-[var(--color-text-secondary)] leading-relaxed mb-8 max-w-[820px] mx-auto text-center">
            {whatWeDo.overview}
          </p>

          <h3 className="text-lg font-bold mb-4 text-[var(--color-text-primary)] uppercase tracking-wide"><UiText>Core Capabilities</UiText></h3>
          <div className="space-y-2.5 mb-10">
            {whatWeDo.capabilities.map((cap, i) => (
              <div key={i} className="flex items-start gap-3.5 bg-[var(--color-surface-2)] p-4 rounded-sm border border-[var(--color-border-subtle)]">
                <span className="w-1.5 h-1.5 bg-[var(--color-primary)] flex-shrink-0 mt-2" />
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed" dangerouslySetInnerHTML={{ __html: cap }} />
              </div>
            ))}
          </div>

          <h3 className="text-lg font-bold mb-4 text-[var(--color-text-primary)] uppercase tracking-wide"><UiText>Our Approach</UiText></h3>
          <p className="text-base text-[var(--color-text-secondary)] leading-relaxed mb-10" dangerouslySetInnerHTML={{ __html: whatWeDo.approach }} />

          <h3 className="text-lg font-bold mb-4 text-[var(--color-text-primary)] uppercase tracking-wide"><UiText>Impact</UiText></h3>
          <p className="text-base text-[var(--color-text-secondary)] leading-relaxed">{whatWeDo.impact}</p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-[1100px] mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12"><UiText>Our Values</UiText></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map((value, i) => (
              <div key={i} className="gov-panel p-6 flex items-start gap-4">
                <div className="w-11 h-11 rounded-sm bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                  {value.icon}
                </div>
                <div>
                  <h3 className="font-bold mb-1.5"><UiText>{value.title}</UiText></h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed"><UiText>{value.description}</UiText></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-[var(--color-border-subtle)]">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4"><UiText>Built for India's Investigators</UiText></h2>
          <p className="text-[var(--color-text-secondary)] mb-8"><UiText>
            See how Decypher can strengthen your investigative capabilities.
          </UiText></p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button className="btn-premium btn-lg" onClick={() => onNavigate("login")}><UiText>Access the Platform</UiText></button>
            <button className="btn-premium-outline btn-lg" onClick={() => onNavigate("landing")}><UiText>Back to Home</UiText></button>
          </div>
        </div>
      </section>
    </div>
  );
}
