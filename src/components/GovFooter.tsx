import UiText, { useUiTranslation } from "./UiText";
// Government-style site footer (GIGW conventions): quick links, policy links
// (Terms of Service, Privacy Policy, Copyright & Disclaimer, Accessibility),
// content-managed / hosted-by lines, and a tiranga strip. Every link routes to
// a real page in the app. Mounted globally by App.tsx (except on the login route).
import StateEmblem from "./StateEmblem";

interface Props {
  onNavigate: (page: string) => void;
}

function FootLink({ label, page, onNavigate }: { label: string; page: string; onNavigate: (p: string) => void }) {
  return (
    <li>
      <button
        onClick={() => onNavigate(page)}
        className="text-left text-[13px] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:underline transition-colors"
      >
        {label}
      </button>
    </li>
  );
}

export default function GovFooter({ onNavigate }: Props) {
  const trUi = useUiTranslation();
  return (
    <footer className="mt-auto gov-accent-top bg-[var(--color-surface-2)] border-t border-[var(--color-border-subtle)]">
      <div className="max-w-[1440px] mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Institutional identity */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-3 mb-3">
            <StateEmblem size={40} className="text-[var(--color-primary)]" />
            <div>
              <div className="font-semibold text-[var(--color-text-primary)] text-[14px] leading-tight"><UiText>Decypher by Epoch</UiText></div>
              <div className="text-[11px] text-[var(--color-text-muted)] leading-tight"><UiText>Criminal Network Intelligence</UiText></div>
            </div>
          </div>
          <p className="text-[12px] text-[var(--color-text-secondary)] leading-relaxed"><UiText>
            A fictional evidence-intelligence prototype designed for authorised investigative workflows. Access is
            restricted to demo personnel.
          </UiText></p>
        </div>

        {/* Quick links */}
        <nav aria-label={trUi("Quick links")}>
          <h3 className="text-[12px] font-bold uppercase tracking-wider text-[var(--color-text-primary)] mb-3"><UiText>Explore</UiText></h3>
          <ul className="space-y-2">
            <FootLink label="Home" page="landing" onNavigate={onNavigate} />
            <FootLink label="Capabilities" page="capabilities" onNavigate={onNavigate} />
            <FootLink label="How It Works" page="how-it-works" onNavigate={onNavigate} />
            <FootLink label="Security" page="security" onNavigate={onNavigate} />
            <FootLink label="About" page="about" onNavigate={onNavigate} />
          </ul>
        </nav>

        {/* Policies */}
        <nav aria-label={trUi("Policies")}>
          <h3 className="text-[12px] font-bold uppercase tracking-wider text-[var(--color-text-primary)] mb-3"><UiText>Policies</UiText></h3>
          <ul className="space-y-2">
            <FootLink label="Terms of Service" page="terms" onNavigate={onNavigate} />
            <FootLink label="Privacy Policy" page="privacy" onNavigate={onNavigate} />
            <FootLink label="Copyright & Disclaimer" page="terms" onNavigate={onNavigate} />
            <FootLink label="Accessibility Statement" page="privacy" onNavigate={onNavigate} />
          </ul>
        </nav>

        {/* Managed by */}
        <div>
          <h3 className="text-[12px] font-bold uppercase tracking-wider text-[var(--color-text-primary)] mb-3"><UiText>Governance</UiText></h3>
          <p className="text-[12px] text-[var(--color-text-secondary)] leading-relaxed"><UiText>
            Demonstration interface inspired by Indian public-sector accessibility and evidence-management requirements.
          </UiText></p>
          <p className="text-[12px] text-[var(--color-text-muted)] mt-3"><UiText>Last updated: September 2026</UiText></p>
        </div>
      </div>

      {/* Sub-bar */}
      <div className="bg-[var(--color-primary)] text-white/90">
        <div className="max-w-[1440px] mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[12px]"><UiText>© 2026 Decypher by Epoch. Prototype demonstration.</UiText></p>
          <p className="text-[11px] text-white/70"><UiText>
            This is a demonstration environment. Data shown is illustrative and does not represent real records.
          </UiText></p>
        </div>
      </div>

      {/* Tiranga strip */}
      <div className="tricolor-strip" aria-hidden="true">
        <div className="flag-saffron" />
        <div className="flag-white" />
        <div className="flag-green" />
      </div>
    </footer>
  );
}
