import { Newsletter } from "@/components/ui/newsletter";

const navigateLinks = [
  ["About", "#about"],
  ["Skills", "#skills"],
  ["Experience", "#experience"],
  ["Selected Work", "#work"],
  ["Activity", "#activity"],
  ["Contact", "#contact"],
];

const socialLinks = [
  ["GitHub", "https://github.com/TalalMajeed"],
  ["LinkedIn", "https://linkedin.com/in/talalmajeed"],
  ["X / Twitter", "https://twitter.com/"],
  ["Email", "mailto:m.talal.majeed@gmail.com"],
  ["Resume PDF", "#"],
];

export function Footer() {
  return (
    <div className="footer-wrap mt-10 border-t border-[var(--line)] bg-[var(--ink-2)]">
      <footer className="footer mx-auto max-w-[var(--maxw)] px-[var(--gutter)] pb-[30px] pt-20 max-[540px]:pb-6 max-[540px]:pt-[60px]">
        <div className="footer-grid mb-[70px] grid grid-cols-[1.6fr_1fr_1fr_1.6fr] gap-[60px] max-[980px]:grid-cols-2 max-[980px]:gap-[50px] max-[540px]:grid-cols-1 max-[540px]:gap-10">
          <div className="footer-brand">
            <span className="brand-large mb-5 block [font-family:var(--display)] text-[32px] font-semibold tracking-[-0.03em]">
              Talal <span className="accent">Majeed</span>
            </span>
            <p className="footer-tagline mb-7 max-w-80 text-sm leading-relaxed text-[var(--muted)]">
              Software & AI engineer. Building thoughtful systems from Islamabad
              - quietly, deliberately, on time.
            </p>
          </div>

          <div className="footer-col">
            <div className="footer-col-head mb-[22px] flex items-center gap-2 [font-family:var(--mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--accent)]">
              Navigate
            </div>
            {navigateLinks.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="flex items-center gap-1.5 py-[7px] text-sm text-[var(--muted)] transition hover:translate-x-1 hover:text-[var(--accent)]"
                data-link
              >
                {label}
              </a>
            ))}
          </div>

          <div className="footer-col">
            <div className="footer-col-head mb-[22px] flex items-center gap-2 [font-family:var(--mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--accent)]">
              Find me
            </div>
            {socialLinks.map(([label, href]) => (
              <a
                key={`${label}-${href}`}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener" : undefined}
                className="flex items-center gap-1.5 py-[7px] text-sm text-[var(--muted)] transition hover:translate-x-1 hover:text-[var(--accent)]"
                data-link
              >
                {label} <span className="ext text-[11px] opacity-50">↗</span>
              </a>
            ))}
          </div>

          <Newsletter />
        </div>

        <div className="footer-bottom flex flex-wrap justify-between gap-5 border-t border-[var(--line)] pt-[30px] [font-family:var(--mono)] text-[11px] tracking-[0.04em] text-[var(--muted)]">
          <div>© 2026 Talal Majeed · All systems nominal.</div>
          <div className="footer-meta flex flex-wrap gap-6">
            <span>33.7°N · 73.1°E</span>
            <span>Built in Islamabad</span>
            <span>v.2026.06</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
