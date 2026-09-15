import UiText, { useUiTranslation } from "../components/UiText";
// Privacy Policy and Accessibility Statement. Rendered inside App (global navbar
// and footer wrap it). Institutional, plain-language policy content.
import { ChevronRight } from "../components/icons";

interface Props {
  onNavigate: (page: string) => void;
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-[18px] font-bold text-[var(--color-text-primary)] mb-2 font-sans">
        <span className="text-[var(--color-text-muted)] font-mono mr-2">{n}</span>
        {title}
      </h2>
      <div className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function Privacy({ onNavigate }: Props) {
  const trUi = useUiTranslation();
  return (
    <div className="min-h-screen bg-[var(--color-base-bg)]">
      <div className="gov-accent-top bg-[var(--color-surface)] border-b border-[var(--color-border-subtle)]">
        <div className="max-w-[900px] mx-auto px-4 py-8">
          <nav className="flex items-center gap-1.5 text-[12px] text-[var(--color-text-muted)] mb-3">
            <button onClick={() => onNavigate("landing")} className="hover:text-[var(--color-primary)] hover:underline"><UiText>Home</UiText></button>
            <ChevronRight size={13} />
            <span className="text-[var(--color-text-secondary)]"><UiText>Privacy Policy</UiText></span>
          </nav>
          <h1 className="text-[30px] text-[var(--color-text-primary)]"><UiText>Privacy Policy</UiText></h1>
          <p className="text-[13px] text-[var(--color-text-muted)] mt-2"><UiText>Effective September 2026. Includes the accessibility statement.</UiText></p>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-4 py-10">
        <Section n="1" title={trUi("Scope")}>
          <p><UiText>
            This policy explains how Decypher handles information when authorised personnel use the platform on
            behalf of the Ministry of Home Affairs, Government of India. It applies to the platform interface and its
            supporting services.
          </UiText></p>
        </Section>
        <Section n="2" title={trUi("Information we process")}>
          <p><UiText>
            The platform processes case records, entity records, and related investigative material that authorised
            users are permitted to access. It also records operational logs such as sign-in events, searches, and
            actions taken, so that access can be audited.
          </UiText></p>
        </Section>
        <Section n="3" title={trUi("Purpose and legal basis")}>
          <p><UiText>
            Information is processed for the purpose of lawful investigation and case management under the authority
            of the competent agency. Processing is limited to what is necessary for that purpose.
          </UiText></p>
        </Section>
        <Section n="4" title={trUi("Access, retention and security")}>
          <p><UiText>
            Access is restricted by role and protected by authentication. Records are retained in accordance with
            departmental record-management policy and applicable law. Reasonable technical and organisational measures
            are used to protect information against unauthorised access.
          </UiText></p>
        </Section>
        <Section n="5" title={trUi("Sharing and disclosure")}>
          <p><UiText>
            Information is shared only with authorised personnel and agencies for the stated purpose, or where
            required by law. It is not sold, and it is not used for advertising.
          </UiText></p>
        </Section>
        <Section n="6" title={trUi("Cookies and local storage")}>
          <p><UiText>
            The platform uses local browser storage to remember interface preferences such as text size, contrast,
            and language. These preferences stay on your device and are not used to track you across other sites.
          </UiText></p>
        </Section>
        <Section n="7" title={trUi("Your rights and grievances")}>
          <p><UiText>
            For questions about how your information is handled, or to raise a grievance, contact the grievance
            officer through your departmental help desk. Requests are handled in line with applicable law.
          </UiText></p>
        </Section>
        <Section n="8" title={trUi("Accessibility statement")}>
          <p><UiText>
            We are committed to making this platform usable by everyone, including people with disabilities, and we
            aim to follow the Guidelines for Indian Government Websites and the Web Content Accessibility Guidelines
            (WCAG 2.1) to the extent practicable.
          </UiText></p>
          <p><UiText>
            The interface provides adjustable text size, a high-contrast mode, and a bilingual (English and Hindi)
            label option in the top utility bar. Content is navigable by keyboard, focus is clearly indicated, and
            motion is reduced automatically when your system requests it.
          </UiText></p>
          <p><UiText>
            If you encounter a barrier to access, please report it through your departmental help desk so we can
            address it.
          </UiText></p>
        </Section>
        <Section n="9" title={trUi("Updates")}>
          <p><UiText>
            This policy may be updated from time to time. The effective date above reflects the most recent revision.
            See also the </UiText><button onClick={() => onNavigate("terms")} className="text-[var(--color-accent)] hover:underline font-medium"><UiText>Terms of Service</UiText></button>.
          </p>
        </Section>
      </div>
    </div>
  );
}
