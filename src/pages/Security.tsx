import UiText from "../components/UiText";
import {
  Shield, Lock, Eye, ClipboardList, FileText, AlertTriangle, Key,
  UserCheck, Database, Activity, GitBranch, Clock, Server
} from "../components/icons";

interface Props {
  onNavigate: (page: string) => void;
}

export default function Security({ onNavigate }: Props) {
  const principles = [
    {
      icon: <Shield size={24} />,
      title: "Human Oversight and Control",
      description: "Decypher is designed as a decision support tool, not an autonomous decision-making system. All analytical outputs, insights, and recommendations require explicit review, validation, and approval by authorized investigators before any action is taken. The platform augments human judgment with AI capabilities rather than replacing the critical reasoning and ethical considerations that trained investigators bring to complex cases.",
      details: [
        "All AI-generated insights flagged clearly as AI-Assisted",
        "Mandatory human review checkpoints in workflows",
        "Investigators retain full control over case decisions",
        "System provides recommendations, not directives"
      ]
    },
    {
      icon: <Eye size={24} />,
      title: "Explainability and Transparency",
      description: "Every insight, connection, inference, and pattern detected by the system is fully explainable and traceable. Investigators can drill down from any finding to understand what source evidence supports a conclusion, what analytical method was used, what the confidence level is, and what alternative interpretations exist. This transparency ensures accountability and enables investigators to present evidence-backed findings in court.",
      details: [
        "Every connection linked to source evidence documents",
        "Confidence scores displayed for all AI predictions",
        "Analytical methodology explained in plain language",
        "Full evidence chain from raw data to insights",
        "Export evidence trail for judicial proceedings"
      ]
    },
    {
      icon: <Lock size={24} />,
      title: "Data Governance and Privacy",
      description: "All data processing strictly adheres to applicable legal frameworks including the IT Act 2000, the Evidence Act, CrPC provisions, and relevant privacy regulations. The platform implements data minimization, purpose limitation, retention policies with automatic deletion after case closure, and need-to-know access controls. Sensitive personal information is protected with additional safeguards.",
      details: [
        "Compliance with IT Act 2000, Evidence Act, and CrPC",
        "Data minimization and purpose limitation principles",
        "Automated retention policies and secure deletion",
        "Role-based access controls with need-to-know",
        "Special protection for sensitive categories",
        "Regular compliance audits and assessments"
      ]
    },
    {
      icon: <ClipboardList size={24} />,
      title: "Auditability and Accountability",
      description: "Comprehensive audit trails track every user action, data access event, query executed, insight generated, and system operation. Logs capture who accessed what data, when, why, and what actions were performed. These immutable audit logs support internal accountability, enable compliance verification, facilitate investigation of misuse, and provide evidence for legal proceedings. Audit logs are tamper-proof with cryptographic verification.",
      details: [
        "Immutable audit logs with cryptographic integrity",
        "Track all user actions with timestamp and justification",
        "Data access logging: who, what, when, why",
        "System operation logs for technical accountability",
        "Export audit trails for compliance reviews",
        "Automated alerts for suspicious access patterns"
      ]
    }
  ];

  const securityFeatures = [
    { icon: <Key size={22} />, title: "Role-Based Access Control", description: "Granular permissions with predefined roles (Admin, Senior Investigator, Investigator, Forensics, Analyst) and customizable access levels. Control who can view, edit, delete, or export specific case data and analytical outputs." },
    { icon: <Lock size={22} />, title: "End-to-End Encryption", description: "All data encrypted in transit (TLS 1.3) and at rest (AES-256). Encryption keys managed through a secure key management service with regular rotation. Database-level encryption for sensitive fields like phone numbers and financial data." },
    { icon: <UserCheck size={22} />, title: "Multi-Factor Authentication", description: "Mandatory MFA for all users with support for OTP (SMS or email), authenticator apps, and hardware tokens. Additional biometric authentication for high-security operations." },
    { icon: <AlertTriangle size={22} />, title: "Anomaly Detection and Alerts", description: "Continuous monitoring for suspicious access patterns including unusual login times, bulk data downloads, access to unrelated cases, privilege escalation attempts, and failed authentication attempts. Real-time alerts to security administrators." },
    { icon: <Database size={22} />, title: "Data Isolation and Segmentation", description: "Logical data isolation between agencies, jurisdictions, and case categories. Multi-tenancy architecture ensures one agency cannot access another's data. Case-level isolation with explicit data-sharing approvals." },
    { icon: <Activity size={22} />, title: "Network Security", description: "Deployed on secure government network infrastructure with firewall protection, intrusion detection and prevention systems, DDoS mitigation, and network segmentation. VPN access for remote users with secure tunneling." },
    { icon: <GitBranch size={22} />, title: "Version Control and Rollback", description: "Complete version history for all data changes with the ability to roll back to previous states. Track who made what changes, when, and why. Prevents accidental data loss and enables recovery from unauthorized modifications." },
    { icon: <Clock size={22} />, title: "Session Management", description: "Automatic session timeout after inactivity, secure session tokens, device fingerprinting, and concurrent session limits. Users are notified of active sessions and can remotely terminate suspicious ones." },
    { icon: <FileText size={22} />, title: "Compliance and Certifications", description: "Designed to meet the requirements of ISO 27001, ISO 27701, SOC 2 Type II, and government security standards. Regular security audits and penetration testing by independent agencies." },
    { icon: <Server size={22} />, title: "Infrastructure Security", description: "Hosted on secure government cloud or on-premise infrastructure with physical security controls, redundant systems for high availability, regular security patches, and disaster recovery with backup and restoration." }
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
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-5"><UiText>Security and Responsible AI</UiText></h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-[720px] mx-auto"><UiText>
            Built on principles of transparency, accountability, and human oversight to support responsible intelligence operations.
          </UiText></p>
        </div>
      </section>

      {/* Principles */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12"><UiText>Responsible AI Principles</UiText></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {principles.map((principle, i) => (
              <div key={i} className="gov-panel gov-accent-top p-6">
                <div className="w-11 h-11 rounded-sm bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] text-[var(--color-primary)] flex items-center justify-center mb-4">
                  {principle.icon}
                </div>
                <h3 className="text-lg font-bold mb-3"><UiText>{principle.title}</UiText></h3>
                <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4 text-sm"><UiText>{principle.description}</UiText></p>

                <div className="bg-[var(--color-surface-2)] p-4 rounded-sm border border-[var(--color-border-subtle)]">
                  <ul className="space-y-2">
                    {principle.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-[var(--color-text-secondary)]">
                        <span className="w-1.5 h-1.5 bg-[var(--color-primary)] flex-shrink-0 mt-1.5" />
                        <span><UiText>{detail}</UiText></span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16 bg-[var(--color-surface)] border-y border-[var(--color-border-subtle)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12"><UiText>Platform Security Controls</UiText></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {securityFeatures.map((feature, i) => (
              <div key={i} className="gov-panel p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-bold mb-1.5 text-sm"><UiText>{feature.title}</UiText></h3>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed"><UiText>{feature.description}</UiText></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4"><UiText>Secure by Design</UiText></h2>
          <p className="text-[var(--color-text-secondary)] mb-8"><UiText>
            Decypher prioritizes security, privacy, and accountability in every aspect of the platform.
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
