import { OrbitGame } from "@/components/ui/orbit";

export default function NotFound() {
  return (
    <section
      className="notfound relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-[var(--gutter)] py-[120px]"
      id="not-found"
    >
      <div className="hero-glow" />
      <div className="hero-glow b" />

      <div className="relative z-[2] mx-auto w-full max-w-[920px]">
        <div className="mb-6 flex items-center justify-center gap-4 [font-family:var(--mono)] text-[12px] uppercase tracking-[0.18em] text-[var(--muted)]">
          <span className="[font-family:var(--display)] text-[clamp(40px,6vw,64px)] font-medium leading-none tracking-[-0.04em] text-[var(--text)]">
            4<span className="accent">0</span>4
          </span>
        </div>

        <OrbitGame />
      </div>
    </section>
  );
}
