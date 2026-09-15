import UiText, { useUiTranslation } from "../components/UiText";
// Terms of Service, Copyright and Disclaimer. Rendered inside App (global navbar
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

export default function Terms({ onNavigate }: Props) {
  const trUi = useUiTranslation();
  return (
    <div className="min-h-screen bg-[var(--color-base-bg)]">
      <div className="gov-accent-top bg-[var(--color-surface)] border-b border-[var(--color-border-subtle)]">
        <div className="max-w-[900px] mx-auto px-4 py-8">
          <nav className="flex items-center gap-1.5 text-[12px] text-[var(--color-text-muted)] mb-3">
            <button onClick={() => onNavigate("landing")} className="hover:text-[var(--color-primary)] hover:underline"><UiText>Home</UiText></button>
            <ChevronRight size={13} />
            <span className="text-[var(--color-text-secondary)]"><UiText>Terms of Service</UiText></span>
          </nav>
          <h1 className="text-[30px] text-[var(--color-text-primary)]"><UiText>Terms of Service</UiText></h1>
          <p className="text-[13px] text-[var(--color-text-muted)] mt-2"><UiText>Effective September 2026. Includes copyright policy and disclaimer.</UiText></p>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-4 py-10">
        <Section n="1" title={trUi("Acceptance and authorised use")}>
          <p><UiText>
            Decypher is a restricted platform operated on behalf of the Ministry of Home Affairs, Government of India.
            By signing in you confirm that you are an authorised user and that your use is limited to official duties.
            Any other use is prohibited.
          </UiText></p>
        </Section>
        <Section n="2" title={trUi("Eligibility and access control")}>
          <p><UiText>
            Access is granted by role and is subject to verification. You are responsible for the confidentiality of
            your credentials and for all activity carried out under your account. Report suspected compromise
            immediately to your system administrator.
          </UiText></p>
        </Section>
        <Section n="3" title={trUi("Permitted and prohibited conduct")}>
          <p><UiText>
            You may access only the cases and records assigned to your role. You must not attempt to bypass access
            controls, export data without authorisation, or use the platform to process matters outside a sanctioned
            investigation. All activity is logged and auditable.
          </UiText></p>
        </Section>
        <Section n="4" title={trUi("Data handling and confidentiality")}>
          <p><UiText>
            Information within the platform is sensitive and, in many cases, legally protected. Handle it in
            accordance with applicable law and departmental policy. Do not reproduce, transmit, or store records on
            unauthorised systems.
          </UiText></p>
        </Section>
        <Section n="5" title={trUi("Intellectual property and copyright")}>
          <p><UiText>
            Unless stated otherwise, the material on this platform is owned by or licensed to the Government of India.
            Material may be reproduced for official, non-commercial purposes provided the source is acknowledged and
            the reproduction is not misleading. Reproduction for commercial purposes requires prior written
            permission.
          </UiText></p>
        </Section>
        <Section n="6" title={trUi("Disclaimer")}>
          <p><UiText>
            The platform is provided for authorised investigative use. While reasonable care is taken to maintain
            accuracy, the Government of India accepts no liability for any loss arising from reliance on the material.
            In this demonstration environment the records shown are illustrative and do not represent real persons or
            cases.
          </UiText></p>
        </Section>
        <Section n="7" title={trUi("Amendments and governing law")}>
          <p><UiText>
            These terms may be updated from time to time. Continued use after a change constitutes acceptance. These
            terms are governed by the laws of India, and the courts at New Delhi have exclusive jurisdiction.
          </UiText></p>
        </Section>
        <Section n="8" title={trUi("Contact")}>
          <p><UiText>
            For questions regarding these terms, contact the platform administrator through your departmental help
            desk. See also the </UiText><button onClick={() => onNavigate("privacy")} className="text-[var(--color-accent)] hover:underline font-medium"><UiText>Privacy Policy</UiText></button>.
          </p>
        </Section>
      </div>
    </div>
  );
}
