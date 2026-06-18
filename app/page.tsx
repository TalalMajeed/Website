import { Button } from "@/components/ui/button";

const skillRows = [
  [
    ["TypeScript", "featured"],
    ["Python", ""],
    ["C / C++", ""],
    ["Java", ""],
    ["JavaScript", ""],
    ["SQL", ""],
    ["Kubernetes", "featured"],
    ["Docker", ""],
    ["Azure", ""],
    ["AWS", ""],
    ["Google Cloud", ""],
    ["Vertex AI", "outline-gold"],
    ["Jenkins", ""],
    ["CI / CD", ""],
    ["Kafka", ""],
  ],
  [
    ["ReactJS", ""],
    ["Next.js", ""],
    ["NestJS", ""],
    ["Spring", ""],
    ["Django", ""],
    ["FastAPI", ""],
    ["PyTorch", "outline-gold"],
    ["n8n", ""],
    ["Hadoop", ""],
    ["PowerBI", ""],
    ["Grafana · Loki", "featured"],
    ["Prometheus", ""],
    ["Redis", ""],
    ["LiveKit", ""],
    ["Twilio", ""],
  ],
];

const experiences = [
  {
    align: "left",
    period: "MAR 2026 → NOW",
    locale: "REMOTE",
    country: "→ IRELAND",
    role: "Software & DevOps Engineer",
    company: "Data Pulse Technologies",
    field: "Banking",
    bullets: [
      "Reshaped the production AKS cluster for cost — kept SLOs, cut the bill.",
      "Stood up observability with Grafana, Loki, Promtail, Prometheus, Azure Blob.",
      "Wired Jenkins CI/CD into Kubernetes with proper liveness & readiness probes.",
      "Built a custom VPN topology for inter-resource and end-user traffic.",
    ],
    stack: ["Kubernetes", "Jenkins", "Azure CLI", "VMSS", "NodeJS", "Spring", "Next.js"],
  },
  {
    align: "right",
    period: "MAY → AUG 2025",
    locale: "REMOTE",
    country: "→ DUBAI",
    role: "AI & Backend Engineer",
    company: "Qureos LLC",
    field: "Hiring · Voice AI",
    bullets: [
      "Shipped IRIS — a voice-first AI that helps candidates find jobs.",
      "Wrote a custom STT → LLM → TTS pipeline on LiveKit with Redis caching.",
      "Connected SIM-based calls through Twilio so candidates could phone in.",
      "Built the RAG layer that grounded the agent in live hiring data.",
    ],
    stack: ["LiveKit", "Redis", "RAG", "Twilio", "Kubernetes", "Python"],
  },
  {
    align: "left",
    period: "JUL 2024 → MAR 2025",
    locale: "REMOTE",
    country: "→ KARACHI",
    role: "Full Stack Engineer",
    company: "Objectual Systems Ltd",
    field: "Fintech · SaaS",
    bullets: [
      "Built a daily NASDAQ-100 scrape + visualization platform for investors.",
      "Maintained Spotit — an AWS-deployed inventory system in PHP / Laravel.",
      "Owned the deploy story across EC2, Mongo, and a Flutter companion.",
    ],
    stack: ["Next.js", "Express", "Puppeteer", "MongoDB", "AWS EC2", "Flutter"],
  },
  {
    align: "right",
    period: "SEP 2023 → SEP 2027",
    locale: "ON-CAMPUS",
    country: "→ PAKISTAN",
    role: "B.S. Computer Science",
    company: "NUST Islamabad",
    field: "CGPA 3.35 / 4",
    bullets: [
      "Coursework across ML, deep learning, big data, computer vision, advanced DS&A.",
      "Mentor at Edunautics — coaching students on problem-solving fundamentals.",
      "Coursera ML Specialization. Always something half-built on the side.",
    ],
    stack: ["Machine Learning", "Deep Learning", "Big Data", "Computer Vision"],
  },
];

const cases = [
  {
    glyph: "RAG · GEMINI\nVERTEX AI",
    num: "CS / 001",
    title: ["TheGoodSales", "Platform"],
    desc: "A working tool for sales executives — feed it your leads, get back the signal: who they are, what they care about, what to send next. Built on Vertex AI for reasoning, Firestore for state, deployed on Cloud Run. The kind of internal tool I'd want as an operator.",
    stack: ["Vertex AI", "Cloud Run", "Next.js", "Firestore"],
    delay: "",
    status: "",
  },
  {
    glyph: "SEPOLIA\nSOLIDITY",
    num: "CS / 002",
    title: ["Decentralized", "Voting"],
    desc: "A voting platform with verifiability baked in — Metamask for identity, Sepolia TestNet for the ledger. Ganache and Truffle locally; Next.js on top. A study in what real trustless systems take to build, end to end.",
    stack: ["Solidity", "Sepolia", "Ganache", "Truffle", "Next.js"],
    delay: "delay-1",
    status: "Shipped 2025",
  },
  {
    glyph: "WORKFLOWS\nGENERATIVE",
    num: "CS / 003",
    title: ["NeuroFlow", "AI"],
    desc: "A workflow generator. Describe what you're trying to do; it draws the workflow back, grounded in your existing context. Vue 3 on the frontend, Flask underneath, Postgres for memory. The earliest piece of agentic tooling I'd built.",
    stack: ["Vue 3", "Flask", "PostgreSQL"],
    delay: "delay-2",
    status: "Shipped 2024",
  },
];

const sectionBase =
  "relative mx-auto max-w-[var(--maxw)] px-[var(--gutter)] py-[clamp(80px,12vh,140px)]";
const coordClass =
  "coord absolute right-[var(--gutter)] top-[50px] text-right [font-family:var(--mono)] text-[10px] leading-relaxed tracking-[0.1em] text-[var(--muted-2)]";
const eyebrowClass =
  "eyebrow reveal mb-6 flex items-center gap-3 [font-family:var(--mono)] text-[11px] uppercase tracking-[0.15em] text-[var(--muted)]";
const sectionTitleClass =
  "section-title reveal mb-[60px] [font-family:var(--display)] text-[clamp(40px,6.4vw,84px)] font-medium leading-none tracking-[-0.04em]";

export default function Home() {
  return (
    <>
      <section
        className={`${sectionBase} hero relative flex min-h-screen flex-col justify-center overflow-hidden pt-[120px]`}
        id="top"
      >
        <div className="hero-glow" />
        <div className="hero-glow b" />

        <div className="hero-meta mb-10 flex flex-wrap gap-8 [font-family:var(--mono)] text-xs tracking-[0.05em] text-[var(--muted)]">
          <div className="hero-meta-item flex items-center gap-2">
            33.7°N, 73.1°E · Islamabad
          </div>
          <div className="hero-meta-item flex items-center gap-2">v.2026.06</div>
        </div>

        <h1 className="hero-headline mb-6 [font-family:var(--display)] text-[clamp(50px,9.6vw,146px)] font-medium leading-[0.9] tracking-[-0.05em]">
          <span className="line">
            <span className="line-inner">
              <span className="accent">M.</span>Talal{" "}
              <span className="accent">Majeed</span>
            </span>
          </span>
          <span className="line -mt-[0.16em] leading-[0.68]">
            <span className="line-inner">
              <span className="quiet text-[0.62em] font-light leading-[0.95] text-[var(--muted)]">
                Software Developer
              </span>
            </span>
          </span>
        </h1>

        <p className="hero-sub mb-10 max-w-[540px] text-[clamp(15px,1.35vw,18px)] leading-[1.5] text-[var(--muted)] [&_strong]:font-medium [&_strong]:text-[var(--text)]">
          Software & AI engineer working across <strong>cloud infrastructure</strong>,{" "}
          <strong>intelligent agents</strong>, and{" "}
          <strong>full-stack platforms</strong>. Currently shipping production
          Kubernetes for a banking platform, and exploring how language models
          change the shape of software.
        </p>

        <div className="hero-actions flex flex-wrap gap-4">
          <Button href="#work" variant="primary">
            See selected work{" "}
            <span className="arrow transition-transform duration-300 group-hover:translate-x-1">
              -&gt;
            </span>
          </Button>
          <Button href="#contact" variant="ghost">
            Reach out
          </Button>
        </div>

        <div className="hero-scroll absolute bottom-10 left-[var(--gutter)] flex items-center gap-3 [font-family:var(--mono)] text-[10px] tracking-[0.2em] text-[var(--muted)]">
          <span>SCROLL</span>
          <span className="line" />
        </div>
      </section>

      <section className={sectionBase} id="about">
        <div className={coordClass}>
          ABOUT — §01
          <br />
          NUST · ISLAMABAD
        </div>
        <div className={eyebrowClass}>
          <span>§ 01 · About</span>
        </div>
        <div className="about-grid grid grid-cols-[1.2fr_1fr] gap-20 max-[880px]:grid-cols-1 max-[880px]:gap-[50px]">
          <div className="about-thesis reveal [font-family:var(--display)] text-[clamp(28px,3.4vw,46px)] font-normal leading-[1.15] tracking-[-0.025em]">
            I&apos;m a builder who sits between{" "}
            <span className="accent">infrastructure</span> and{" "}
            <span className="accent">intelligence</span>—comfortable wiring up
            production Kubernetes one week,{" "}
            <span className="quiet text-[var(--muted)]">
              and shipping a retrieval pipeline the next.
            </span>
          </div>
          <div className="about-side flex flex-col gap-7 pt-5">
            <p className="reveal delay-1 text-base leading-[1.7] text-[var(--muted)] [&_strong]:font-medium [&_strong]:text-[var(--text)]">
              Currently a <strong>Software & DevOps Engineer</strong> at Data
              Pulse Technologies in Ireland, where I keep banking workloads
              running across Azure Kubernetes. Previously built voice-AI for a
              hiring platform in Dubai and full-stack tooling for a
              NASDAQ-focused fintech in Karachi.
            </p>
            <p className="reveal delay-2 text-base leading-[1.7] text-[var(--muted)] [&_strong]:font-medium [&_strong]:text-[var(--text)]">
              Studying CS at <strong>NUST Islamabad</strong>, graduating 2027. I
              mentor at Edunautics on the side and like the parts of engineering
              most people skip past—observability, cost shape, the geometry of a
              clean Jenkins pipeline.
            </p>
            <div className="about-stats reveal delay-3 mt-4 grid grid-cols-2 gap-5 border-t border-[var(--line)] pt-8">
              <div>
                <div className="stat-num mb-1.5 [font-family:var(--display)] text-[52px] font-medium leading-none tracking-[-0.03em] text-[var(--accent)]">
                  3+
                </div>
                <div className="stat-label [font-family:var(--mono)] text-[11px] uppercase tracking-[0.1em] text-[var(--muted)]">
                  Yrs shipping
                </div>
              </div>
              <div>
                <div className="stat-num mb-1.5 [font-family:var(--display)] text-[52px] font-medium leading-none tracking-[-0.03em] text-[var(--accent)]">
                  3
                </div>
                <div className="stat-label [font-family:var(--mono)] text-[11px] uppercase tracking-[0.1em] text-[var(--muted)]">
                  Countries · 1 remote desk
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="skills relative mx-auto max-w-full py-[clamp(80px,12vh,140px)]">
        <div className="skills-inner mx-auto max-w-[var(--maxw)] px-[var(--gutter)]">
          <div className={coordClass}>SKILLS — §02</div>
          <div className={eyebrowClass}>
            <span>§ 02 · Stack</span>
          </div>
          <h2 className={sectionTitleClass}>
            The tools I <span className="accent">reach for.</span>
          </h2>
        </div>

        {skillRows.map((row, index) => (
          <div
            className={`skills-marquee reveal ${index === 1 ? "delay-1" : ""}`}
            key={index}
          >
            <div className={`skills-track ${index === 1 ? "reverse fast" : ""}`}>
              {[...row, ...row].map(([skill, extra], skillIndex) => (
                <div
                  className={`skill border px-[22px] py-3.5 [font-family:var(--mono)] text-sm tracking-[0.01em] transition-all duration-300 ${
                    extra === "featured"
                      ? "border-[var(--accent)] bg-[var(--accent)] font-medium text-[var(--ink)]"
                      : extra === "outline-gold"
                        ? "border-[var(--gold)] bg-[var(--ink-2)] text-[var(--gold)]"
                        : "border-[var(--line)] bg-[var(--ink-2)] text-[var(--text)]"
                  }`}
                  key={`${skill}-${skillIndex}`}
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="skills-inner mx-auto max-w-[var(--maxw)] px-[var(--gutter)]">
          <div className="skills-cats reveal mt-10 flex flex-wrap gap-10 [font-family:var(--mono)] text-[11px] uppercase tracking-[0.12em] text-[var(--muted)]">
            <span className="text-[var(--accent)]">↳ Strongest:</span>
            <span>Cloud Infrastructure · DevOps</span>
            <span>Backend Systems</span>
            <span>AI Engineering · RAG</span>
            <span>Full Stack Web</span>
          </div>
        </div>
      </section>

      <section className={sectionBase} id="experience">
        <div className={coordClass}>EXPERIENCE — §03</div>
        <div className={eyebrowClass}>
          <span>§ 03 · Experience</span>
        </div>
        <h2 className={sectionTitleClass}>
          Where I&apos;ve <span className="accent">shipped.</span>
        </h2>

        <div className="exp-flow" id="expFlow">
          <div className="exp-spine-live" />
          <div className="exp-cards relative z-[2] flex flex-col gap-[60px] max-[880px]:gap-10">
            {experiences.map((item) => (
              <div
                className={`exp-card ${item.align} w-[calc(50%-50px)] border border-[var(--line)] bg-[var(--surface)] px-[30px] py-7 transition-all duration-500 hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-[0_20px_50px_-20px_rgb(255_84_54_/_25%)] max-[880px]:w-[calc(100%-60px)] max-[880px]:self-end max-[880px]:px-[22px] max-[880px]:py-6`}
                data-link
                key={item.role}
              >
                <div className="exp-card-head mb-4 flex items-start justify-between gap-4">
                  <div className="exp-period [font-family:var(--mono)] text-[11px] tracking-[0.08em] text-[var(--accent)]">
                    {item.period}
                  </div>
                  <div className="exp-locale text-right [font-family:var(--mono)] text-[10px] tracking-[0.08em] text-[var(--muted)]">
                    {item.locale}
                    <span className="country block text-[var(--gold)]">
                      {item.country}
                    </span>
                  </div>
                </div>
                <h3 className="exp-role mb-1.5 [font-family:var(--display)] text-[clamp(20px,2.2vw,26px)] font-medium leading-tight tracking-[-0.02em] transition-colors duration-300">
                  {item.role}
                </h3>
                <div className="exp-company mb-[18px] [font-family:var(--mono)] text-[13px] tracking-[0.03em] text-[var(--muted)] [&_strong]:font-medium [&_strong]:text-[var(--text)]">
                  <strong>{item.company}</strong> · {item.field}
                </div>
                <ul className="exp-bullets mb-[18px] grid list-none gap-2 p-0">
                  {item.bullets.map((bullet) => (
                    <li
                      className="relative pl-4 text-sm leading-[1.55] text-[var(--muted)] before:absolute before:left-0 before:text-[var(--accent)] before:content-['—']"
                      key={bullet}
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
                <div className="exp-stack flex flex-wrap gap-1.5 border-t border-[var(--line)] pt-[18px]">
                  {item.stack.map((tech) => (
                    <span
                      className="border border-[var(--line)] px-2.5 py-1 [font-family:var(--mono)] text-[10.5px] tracking-[0.04em] text-[var(--muted)]"
                      key={tech}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={sectionBase} id="work">
        <div className={coordClass}>SELECTED WORK — §04</div>
        <div className={eyebrowClass}>
          <span>§ 04 · Case Studies</span>
        </div>
        <h2 className={sectionTitleClass}>
          Three things I&apos;ve <span className="accent">built recently.</span>
        </h2>

        <div className="case-grid grid grid-cols-6 gap-6">
          {cases.map((item) => (
            <article
              className={`case reveal ${item.delay} relative col-span-3 flex min-h-[420px] flex-col overflow-hidden border border-[var(--line)] bg-[var(--ink-2)] p-9 transition-all duration-500 first:col-span-6 first:min-h-[380px] hover:-translate-y-1.5 hover:border-[var(--accent)] max-[880px]:col-span-6 max-[880px]:min-h-80 max-[880px]:p-7`}
              data-link
              key={item.num}
            >
              {!item.status ? (
                <div className="case-glyph absolute right-9 top-9 text-right [font-family:var(--mono)] text-[10px] leading-relaxed tracking-[0.1em] text-[var(--muted-2)] opacity-70">
                  {item.glyph.split("\n").map((line) => (
                    <span key={line}>
                      {line}
                      <br />
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="case-head mb-6 flex items-start justify-between">
                <div className="case-num [font-family:var(--mono)] text-[11px] tracking-[0.1em] text-[var(--muted)]">
                  {item.num}
                </div>
                {item.status ? (
                  <div className="case-status shipped border border-[rgb(232_199_122_/_30%)] bg-[rgb(232_199_122_/_10%)] px-2.5 py-1 [font-family:var(--mono)] text-[10px] uppercase tracking-[0.1em] text-[var(--gold)]">
                    {item.status}
                  </div>
                ) : null}
              </div>
              <h3 className="case-title mb-4 [font-family:var(--display)] text-[clamp(28px,3.2vw,46px)] font-medium leading-[1.05] tracking-[-0.03em]">
                {item.title[0]} <span className="accent">{item.title[1]}</span>
              </h3>
              <p className="case-desc mb-auto max-w-[580px] text-[15px] leading-relaxed text-[var(--muted)]">
                {item.desc}
              </p>
              <div className="case-foot mt-8 flex flex-wrap items-end justify-between gap-5 border-t border-[var(--line)] pt-6">
                <div className="case-stack flex flex-wrap gap-1.5">
                  {item.stack.map((tech) => (
                    <span
                      className="[font-family:var(--mono)] text-[10.5px] tracking-[0.04em] text-[var(--muted)]"
                      key={tech}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="case-arrow [font-family:var(--display)] text-[28px] text-[var(--accent)] transition-transform duration-300">
                  ↗
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="activity" className={`${sectionBase} activity`}>
        <div className={coordClass}>ACTIVITY — §05</div>
        <div className={eyebrowClass}>
          <span>§ 05 · Activity</span>
        </div>
        <h2 className={sectionTitleClass}>
          A year of <span className="accent">commits.</span>
        </h2>

        <div className="activity-meta reveal mb-10 flex flex-wrap gap-8 [font-family:var(--mono)] text-xs tracking-[0.04em] text-[var(--muted)] [&_strong]:font-medium [&_strong]:text-[var(--text)]">
          <span>
            <span className="accent-num font-semibold text-[var(--accent)]">1994</span> Contributions
          </span>
        </div>

        <div className="contrib-card reveal delay-1 overflow-hidden border border-[var(--line)] bg-[var(--ink-2)] p-8 max-[640px]:p-5">
          <div className="contrib-card-head mb-7 flex flex-wrap items-center justify-between gap-4">
            <div className="label [font-family:var(--mono)] text-[11px] uppercase tracking-[0.1em] text-[var(--muted)]">
              <span className="accent-text text-[var(--accent)]">@TalalMajeed</span> · github.com
            </div>
            <div className="label [font-family:var(--mono)] text-[11px] uppercase tracking-[0.1em] text-[var(--muted)]">
              JAN 2025 → DEC 2025
            </div>
          </div>
          <div className="contrib-graph-wrap overflow-x-auto pb-2">
            <div className="contrib-graph" id="contribGraph" />
          </div>
          <div className="contrib-legend mt-[18px] flex items-center justify-end gap-2 [font-family:var(--mono)] text-[10px] tracking-[0.05em] text-[var(--muted)]">
            <span>Less</span>
            <div className="legend-cells flex gap-[3px]">
              {[0, 1, 2, 3, 4].map((level) => (
                <div className={`contrib-cell level-${level}`} key={level} />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className={`${sectionBase} contact py-[clamp(80px,12vh,160px)] text-left`}
      >
        <div className={coordClass}>CONTACT — §06</div>
        <div className={eyebrowClass}>
          <span>§ 06 · Contact</span>
        </div>
        <h1 className="contact-headline reveal mb-[50px] [font-family:var(--display)] text-[clamp(48px,9vw,140px)] font-medium leading-[0.95] tracking-[-0.05em]">
          Have something <span className="accent">worth building?</span>
          <br />
          <span className="quiet font-light text-[var(--muted-2)]">
            Let&apos;s talk.
          </span>
        </h1>

        <a
          href="mailto:m.talal.majeed@gmail.com"
          className="contact-email reveal delay-1 mb-[60px] inline-flex items-center gap-3.5 border-b border-[var(--line)] pb-3 [font-family:var(--display)] text-[clamp(24px,3vw,40px)] font-medium tracking-[-0.02em] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          data-link
        >
          m.talal.majeed@gmail.com <span className="arrow text-[0.8em]">↗</span>
        </a>

        <div className="contact-socials reveal delay-2 flex flex-wrap gap-9 [font-family:var(--mono)] text-[13px] tracking-[0.04em]">
          <a
            href="https://github.com/TalalMajeed"
            target="_blank"
            rel="noopener"
            className="flex items-center gap-2 pb-0.5 text-[var(--muted)] transition-colors hover:text-[var(--text)]"
            data-link
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/talalmajeed"
            target="_blank"
            rel="noopener"
            className="flex items-center gap-2 pb-0.5 text-[var(--muted)] transition-colors hover:text-[var(--text)]"
            data-link
          >
            LinkedIn
          </a>
          <a
            href="mailto:m.talal.majeed@gmail.com"
            className="flex items-center gap-2 pb-0.5 text-[var(--muted)] transition-colors hover:text-[var(--text)]"
            data-link
          >
            Email
          </a>
        </div>
      </section>
    </>
  );
}
