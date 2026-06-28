"use client";

import { useEffect, useRef } from "react";
import { Newsletter } from "@/components/ui/newsletter";

/**
 * A self-contained pixel runner. The canvas is an absolute overlay covering the
 * whole footer so the jump arc has room and is never clipped. The "ground" is
 * the top border line of the footer-bottom row (passed in via lineRef); the CSS
 * border is the only visible line — the canvas draws no baseline of its own.
 */
function PixelRunner({
  lineRef,
}: {
  lineRef: React.RefObject<HTMLDivElement | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const c2d = el.getContext("2d");
    if (!c2d) return;
    const canvas: HTMLCanvasElement = el;
    const ctx: CanvasRenderingContext2D = c2d;

    const accent =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim() || "#ff6b4a";

    const PX = 4; // size of one "pixel"
    const RUNNER_W = 8; // in PX units
    const RUNNER_H = 10;
    let H = 0; // canvas px height (full footer height)
    let W = 0;
    let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    // Logical baseline (the ground line) measured in canvas px.
    let baseline = 0;

    const runner = {
      x: 80, // canvas px, fixed horizontal position (inset from the left edge)
      y: 0, // top of runner relative to baseline (0 = standing)
      vy: 0,
      onGround: true,
    };
    const GRAVITY = 0.9;
    const JUMP_V = -13;

    type Obstacle = { x: number; w: number; h: number };
    let obstacles: Obstacle[] = [];
    let speed = 3.2;
    let spawnTimer = 0;
    let frame = 0;
    let dead = 0; // >0 = death flash countdown

    function resize() {
      const parent = canvas.parentElement;
      if (!parent) return;
      const parentRect = parent.getBoundingClientRect();
      W = parent.clientWidth;
      H = parent.clientHeight;
      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
      // Baseline = the top border of the footer-bottom row, in canvas coords.
      const line = lineRef.current;
      baseline = line
        ? line.getBoundingClientRect().top - parentRect.top
        : H - 8;
    }

    function reset() {
      obstacles = [];
      runner.y = 0;
      runner.vy = 0;
      runner.onGround = true;
      speed = 3.2;
      spawnTimer = 40;
    }

    function rect(x: number, y: number, w: number, h: number, color: string) {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
    }

    // Draw a tiny pixel humanoid. ox/oy = bottom-left anchor in canvas px.
    function drawRunner(ox: number, oy: number, run: boolean, color: string) {
      const p = (cx: number, cy: number) =>
        rect(ox + cx * PX, oy - (cy + 1) * PX, PX, PX, color);
      // head
      p(3, 9);
      p(4, 9);
      p(3, 8);
      p(4, 8);
      // torso
      p(3, 7);
      p(4, 7);
      p(3, 6);
      p(4, 6);
      p(3, 5);
      p(4, 5);
      // arms
      p(2, 6);
      p(5, 6);
      // legs (alternate when running)
      if (run) {
        p(2, 4);
        p(2, 3);
        p(5, 4);
        p(5, 3);
        p(1, 2);
        p(6, 2);
      } else {
        p(3, 4);
        p(3, 3);
        p(4, 4);
        p(4, 3);
        p(3, 2);
        p(4, 2);
      }
    }

    // Draw a pixel-art spike (pyramid). ox = left, baseY = bottom (on the line).
    // w PX wide at the base, h PX tall, narrowing one PX-row per level.
    function drawSpike(ox: number, baseY: number, w: number, h: number) {
      for (let row = 0; row < h; row++) {
        // how many PX columns are filled at this height level
        const fill = Math.max(1, Math.round(w * (1 - row / h)));
        const offset = Math.floor((w - fill) / 2);
        const y = baseY - (row + 1) * PX;
        rect(ox + offset * PX, y, fill * PX, PX, accent);
      }
    }

    let raf = 0;
    function loop() {
      frame++;
      ctx.clearRect(0, 0, W, H);

      // No baseline is drawn here — the CSS border of footer-bottom is the line.

      // physics
      if (!runner.onGround || runner.vy < 0) {
        runner.vy += GRAVITY;
        runner.y += runner.vy;
        if (runner.y >= 0) {
          runner.y = 0;
          runner.vy = 0;
          runner.onGround = true;
        }
      }

      // spawn spikes
      spawnTimer--;
      if (spawnTimer <= 0) {
        const h = 4 + Math.floor(Math.random() * 3); // 4..6 PX tall
        const w = h; // pyramid base width tracks height
        obstacles.push({ x: W + 8, w, h });
        spawnTimer = 60 + Math.floor(Math.random() * 70);
        speed = Math.min(6, speed + 0.06);
      }

      const runnerBottom = baseline + runner.y;
      const runnerLeft = runner.x;
      const runnerRight = runner.x + RUNNER_W * PX;
      const runnerTop = runnerBottom - RUNNER_H * PX;

      // update + draw obstacles, AI auto-jump, collisions
      for (const o of obstacles) {
        o.x -= speed;
        const oLeft = o.x;
        const oRight = o.x + o.w * PX;
        const oTop = baseline - o.h * PX;

        drawSpike(oLeft, baseline, o.w, o.h);

        // Auto-jump: trigger early enough that the apex lines up with the spike.
        // Time to apex ≈ |JUMP_V| / GRAVITY frames; in that time the spike closes
        // `speed` px/frame, so jump when it's roughly that far away (with margin).
        const framesToApex = Math.abs(JUMP_V) / GRAVITY;
        const triggerDist = framesToApex * speed * 0.55;
        if (
          runner.onGround &&
          oRight > runnerRight &&
          oLeft - runnerRight < triggerDist
        ) {
          runner.vy = JUMP_V;
          runner.onGround = false;
        }

        // Collision against the spike's actual triangular profile: at the
        // runner's overlapping x, the spike only reaches a partial height.
        if (dead === 0 && runnerRight > oLeft && runnerLeft < oRight) {
          // distance from spike center, normalized → spike height there
          const center = oLeft + (o.w * PX) / 2;
          const nearestX = Math.max(
            runnerLeft,
            Math.min(runnerRight, center),
          );
          const dx = Math.abs(nearestX - center) / ((o.w * PX) / 2);
          const spikeTopHere = baseline - (1 - dx) * o.h * PX;
          if (runnerBottom > spikeTopHere + 1) {
            dead = 18;
          }
        }
        void oTop;
      }
      obstacles = obstacles.filter((o) => o.x + o.w * PX > -4);

      // draw runner (flash on death)
      const legPhase = runner.onGround && frame % 12 < 6;
      const color = dead > 0 && dead % 6 < 3 ? "rgba(255,255,255,0.25)" : accent;
      drawRunner(runnerLeft, runnerBottom, legPhase, color);
      void runnerTop;

      if (dead > 0) {
        dead--;
        if (dead === 0) reset();
      }

      raf = requestAnimationFrame(loop);
    }

    resize();
    reset();
    loop();

    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 select-none"
    />
  );
}

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
  ["LinkedIn", "https://www.linkedin.com/in/talalmajeed/"],
  ["Upwork", "https://www.upwork.com/freelancers/muhammadtalalm"],
  ["Email", "mailto:m.talal.majeed@gmail.com"],
  ["Resume PDF", "/Talal%20Majeed%20-%20Resume.pdf"],
];

export function Footer() {
  const lineRef = useRef<HTMLDivElement>(null);

  return (
    <div className="footer-wrap mt-10 border-t border-[var(--line)] bg-[var(--ink-2)]">
      <footer className="footer relative mx-auto max-w-[var(--maxw)] px-[var(--gutter)] pb-[30px] pt-20 max-[540px]:pb-6 max-[540px]:pt-[60px]">
        <PixelRunner lineRef={lineRef} />
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
                download={href.endsWith(".pdf") ? true : undefined}
                className="flex items-center gap-1.5 py-[7px] text-sm text-[var(--muted)] transition hover:translate-x-1 hover:text-[var(--accent)]"
                data-link
              >
                {label} <span className="ext text-[11px] opacity-50">↗</span>
              </a>
            ))}
          </div>

          <Newsletter />
        </div>

        <div
          ref={lineRef}
          className="footer-bottom relative z-10 flex flex-wrap justify-between gap-5 border-t border-[var(--line)] pt-[30px] [font-family:var(--mono)] text-[11px] tracking-[0.04em] text-[var(--muted)]"
        >
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
