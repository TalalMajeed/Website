"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type Vec = { x: number; y: number };

type Bullet = Vec & { vx: number; vy: number; life: number };
type Crater = Vec & {
  vx: number;
  vy: number;
  r: number;
  spin: number;
  angle: number;
  hp: number;
  color: string;
  glow: string;
};

const SHIP_R = 16;
const BULLET_SPEED = 6.2;
const FIRE_INTERVAL = 150; // ms between shots
const ROTATE_SPEED = 0.06; // radians per frame while held
const SPAWN_INTERVAL = 1100; // ms between crater spawns
const SPAWN_RAMP = 0.985; // spawn gets faster over time

type CraterKind = {
  color: string;
  glow: string;
  rMin: number;
  rMax: number;
  speedMul: number; // multiplies base inward speed
  spin: number; // |spin| per frame, 0 = none
  hp: number;
  weight: number; // base spawn probability weight
};

// Four crater classes, in roughly ascending danger.
const CRATER_KINDS: CraterKind[] = [
  // 1. Yellow — small, fast, spinning
  { color: "#e8c77a", glow: "rgba(232,199,122,0.55)", rMin: 8, rMax: 12, speedMul: 1.55, spin: 0.09, hp: 1, weight: 4 },
  // 2. Orange — the baseline
  { color: "#ff5436", glow: "rgba(255,84,54,0.5)", rMin: 13, rMax: 18, speedMul: 1, spin: 0.015, hp: 1, weight: 5 },
  // 3. Purple — huge and a bit slow
  { color: "#a877ff", glow: "rgba(168,119,255,0.5)", rMin: 28, rMax: 38, speedMul: 0.62, spin: 0.02, hp: 3, weight: 2 },
  // 4. Red — huge, fast and spinning
  { color: "#ff3b3b", glow: "rgba(255,59,59,0.6)", rMin: 26, rMax: 34, speedMul: 1.55, spin: 0.09, hp: 4, weight: 1.5 },
];

export function OrbitGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const [running, setRunning] = useState(false);
  const [over, setOver] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  // mutable game state kept in refs so the rAF loop is stable
  const state = useRef({
    angle: -Math.PI / 2, // ship nose direction
    turn: 0, // -1 = rotate left, +1 = rotate right, 0 = hold
    bullets: [] as Bullet[],
    craters: [] as Crater[],
    lastShot: 0,
    lastSpawn: 0,
    spawnInterval: SPAWN_INTERVAL,
    score: 0,
    w: 0,
    h: 0,
    dpr: 1,
    // pock dots need more opacity to read on the light playfield
    pockAlpha: 0.3,
  });

  const rafRef = useRef<number | null>(null);

  // track the active theme so the crater pocks stay visible on both palettes
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => {
      state.current.pockAlpha = root.dataset.theme === "light" ? 0.6 : 0.3;
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = wrap.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    state.current.w = rect.width;
    state.current.h = rect.height;
    state.current.dpr = dpr;
  }, []);

  const reset = useCallback(() => {
    const s = state.current;
    s.angle = -Math.PI / 2;
    s.turn = 0;
    s.bullets = [];
    s.craters = [];
    s.lastShot = 0;
    s.lastSpawn = 0;
    s.spawnInterval = SPAWN_INTERVAL;
    s.score = 0;
    setScore(0);
    setOver(false);
  }, []);

  const start = useCallback(() => {
    reset();
    setRunning(true);
  }, [reset]);

  // main loop
  useEffect(() => {
    if (!running) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let last = performance.now();

    const spawnCrater = () => {
      const s = state.current;
      const cx = s.w / 2;
      const cy = s.h / 2;
      // spawn just outside a circle around the center, head inward
      const edge = Math.max(s.w, s.h) * 0.62;
      const a = Math.random() * Math.PI * 2;
      const x = cx + Math.cos(a) * edge;
      const y = cy + Math.sin(a) * edge;
      // pick a crater kind — harder kinds get more likely as the score climbs
      const ramp = Math.min(s.score * 0.02, 1.4);
      const weights = CRATER_KINDS.map((k, i) => k.weight * (1 + i * ramp));
      const total = weights.reduce((acc, w) => acc + w, 0);
      let roll = Math.random() * total;
      let kind = CRATER_KINDS[0];
      for (let i = 0; i < CRATER_KINDS.length; i++) {
        roll -= weights[i];
        if (roll <= 0) {
          kind = CRATER_KINDS[i];
          break;
        }
      }

      const base = 0.85 + Math.random() * 0.6 + s.score * 0.01;
      const speed = base * kind.speedMul;
      const r = kind.rMin + Math.random() * (kind.rMax - kind.rMin);
      const dx = cx - x;
      const dy = cy - y;
      const len = Math.hypot(dx, dy) || 1;
      // slight angular jitter so they don't all aim dead-center
      const jitter = (Math.random() - 0.5) * 0.25;
      const cos = Math.cos(jitter);
      const sin = Math.sin(jitter);
      const nx = (dx / len) * cos - (dy / len) * sin;
      const ny = (dx / len) * sin + (dy / len) * cos;
      s.craters.push({
        x,
        y,
        vx: nx * speed,
        vy: ny * speed,
        r,
        spin: kind.spin ? (Math.random() < 0.5 ? -kind.spin : kind.spin) : 0,
        angle: Math.random() * Math.PI,
        hp: kind.hp,
        color: kind.color,
        glow: kind.glow,
      });
    };

    const drawShip = (s: typeof state.current) => {
      const cx = s.w / 2;
      const cy = s.h / 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(s.angle + Math.PI / 2);

      ctx.beginPath();
      ctx.moveTo(0, -SHIP_R * 1.3);
      ctx.lineTo(SHIP_R, SHIP_R);
      ctx.lineTo(0, SHIP_R * 0.55);
      ctx.lineTo(-SHIP_R, SHIP_R);
      ctx.closePath();
      ctx.fillStyle = "#ff5436";
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "#ff8567";
      ctx.stroke();

      // thrust flicker when rotating
      if (s.turn !== 0) {
        ctx.beginPath();
        ctx.moveTo(-SHIP_R * 0.5, SHIP_R);
        ctx.lineTo(0, SHIP_R + 8 + Math.random() * 8);
        ctx.lineTo(SHIP_R * 0.5, SHIP_R);
        ctx.fillStyle = "rgba(232,199,122,0.85)";
        ctx.fill();
      }
      ctx.restore();
    };

    const frame = (now: number) => {
      const s = state.current;
      const dt = Math.min(now - last, 50);
      last = now;
      const cx = s.w / 2;
      const cy = s.h / 2;

      // rotation
      if (s.turn !== 0) s.angle += ROTATE_SPEED * s.turn;

      // firing
      if (now - s.lastShot >= FIRE_INTERVAL) {
        s.lastShot = now;
        const nx = Math.cos(s.angle);
        const ny = Math.sin(s.angle);
        s.bullets.push({
          x: cx + nx * SHIP_R * 1.3,
          y: cy + ny * SHIP_R * 1.3,
          vx: nx * BULLET_SPEED,
          vy: ny * BULLET_SPEED,
          life: 0,
        });
      }

      // spawning
      if (now - s.lastSpawn >= s.spawnInterval) {
        s.lastSpawn = now;
        s.spawnInterval = Math.max(360, s.spawnInterval * SPAWN_RAMP);
        spawnCrater();
      }

      const step = dt / 16.6667;

      // update bullets
      for (const b of s.bullets) {
        b.x += b.vx * step;
        b.y += b.vy * step;
        b.life += dt;
      }
      s.bullets = s.bullets.filter(
        (b) => b.x > -20 && b.x < s.w + 20 && b.y > -20 && b.y < s.h + 20
      );

      // update craters
      for (const c of s.craters) {
        c.x += c.vx * step;
        c.y += c.vy * step;
        c.angle += c.spin;
      }

      // bullet vs crater collisions
      const deadCraters = new Set<Crater>();
      const deadBullets = new Set<Bullet>();
      for (const b of s.bullets) {
        for (const c of s.craters) {
          if (deadCraters.has(c)) continue;
          const d = Math.hypot(b.x - c.x, b.y - c.y);
          if (d < c.r + 2) {
            deadBullets.add(b);
            c.hp -= 1;
            if (c.hp <= 0) {
              deadCraters.add(c);
              s.score += 1;
              setScore(s.score);
            } else {
              // chip the crater down a touch on each surviving hit
              c.r = Math.max(6, c.r * 0.85);
            }
            break;
          }
        }
      }
      if (deadBullets.size) s.bullets = s.bullets.filter((b) => !deadBullets.has(b));
      if (deadCraters.size) s.craters = s.craters.filter((c) => !deadCraters.has(c));

      // crater vs ship -> game over
      let hit = false;
      for (const c of s.craters) {
        if (Math.hypot(c.x - cx, c.y - cy) < c.r + SHIP_R * 0.7) {
          hit = true;
          break;
        }
      }

      // ---- render ----
      ctx.save();
      ctx.scale(s.dpr, s.dpr);
      ctx.clearRect(0, 0, s.w, s.h);

      // bullets
      for (const b of s.bullets) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = "#e8c77a";
        ctx.fill();
      }

      // craters
      for (const c of s.craters) {
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.angle);
        ctx.beginPath();
        ctx.arc(0, 0, c.r, 0, Math.PI * 2);
        ctx.lineWidth = 1.75;
        ctx.strokeStyle = c.color;
        ctx.stroke();
        // crater pocks tinted to the kind's color
        ctx.fillStyle = c.color;
        ctx.globalAlpha = s.pockAlpha;
        ctx.beginPath();
        ctx.arc(c.r * 0.3, -c.r * 0.2, c.r * 0.28, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(-c.r * 0.35, c.r * 0.25, c.r * 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.restore();
      }

      drawShip(s);
      ctx.restore();

      if (hit) {
        setOver(true);
        setBest((prev) => {
          const next = Math.max(prev, s.score);
          return next;
        });
        setRunning(false);
        return;
      }

      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [running]);

  // sizing
  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  // input — hold space / arrow keys to rotate
  useEffect(() => {
    const isLeft = (e: KeyboardEvent) => e.code === "ArrowLeft" || e.key === "ArrowLeft";
    const isRight = (e: KeyboardEvent) => e.code === "ArrowRight" || e.key === "ArrowRight";
    const isSpace = (e: KeyboardEvent) => e.code === "Space" || e.key === " ";

    const down = (e: KeyboardEvent) => {
      if (!running && (e.code === "Enter" || e.key === "Enter")) {
        e.preventDefault();
        start();
        return;
      }
      if (isLeft(e)) {
        if (running) e.preventDefault();
        state.current.turn = -1;
      } else if (isRight(e)) {
        if (running) e.preventDefault();
        state.current.turn = 1;
      } else if (isSpace(e)) {
        if (running) e.preventDefault();
        // space keeps spinning in the current (or default rightward) direction
        if (state.current.turn === 0) state.current.turn = 1;
      }
    };
    const up = (e: KeyboardEvent) => {
      if (isLeft(e) && state.current.turn === -1) state.current.turn = 0;
      else if (isRight(e) && state.current.turn === 1) state.current.turn = 0;
      else if (isSpace(e)) state.current.turn = 0;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [running, start]);

  // pointer support — left half rotates left, right half rotates right
  const pointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    state.current.turn = e.clientX - rect.left < rect.width / 2 ? -1 : 1;
  }, []);
  const pointerUp = useCallback(() => {
    state.current.turn = 0;
  }, []);

  return (
    <div className="orbit-game border border-[var(--line)] bg-[var(--ink-2)]">
      <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-3 [font-family:var(--mono)] text-[11px] uppercase tracking-[0.1em] text-[var(--muted)]">
        <span>
          <span className="text-[var(--accent)]">orbit</span>.defense
        </span>
        <span className="flex gap-5">
          <span>
            SCORE <span className="text-[var(--text)]">{String(score).padStart(3, "0")}</span>
          </span>
          <span>
            BEST <span className="text-[var(--accent)]">{String(best).padStart(3, "0")}</span>
          </span>
        </span>
      </div>

      <div
        ref={wrapRef}
        className="relative aspect-[16/10] w-full touch-none select-none"
        onPointerDown={running ? pointerDown : undefined}
        onPointerUp={pointerUp}
        onPointerLeave={pointerUp}
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {!running && (
          <div className="absolute inset-0 grid place-items-center bg-[rgb(var(--ink-rgb)_/_82%)] px-6 text-center">
            <div>
              {over ? (
                <>
                  <div className="mb-2 [font-family:var(--display)] text-[clamp(28px,4vw,44px)] font-medium tracking-[-0.03em] text-[var(--accent)]">
                    Ship down.
                  </div>
                  <div className="mb-6 [font-family:var(--mono)] text-[13px] tracking-[0.04em] text-[var(--muted)]">
                    You cleared{" "}
                    <span className="text-[var(--text)]">{score}</span> craters.
                    Press{" "}
                    <kbd className="border border-[var(--line)] bg-[var(--surface)] px-2 py-0.5 text-[var(--accent)]">
                      ENTER
                    </kbd>{" "}
                    to retry.
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-2 [font-family:var(--display)] text-[clamp(24px,3.4vw,38px)] font-medium tracking-[-0.03em] text-[var(--text)]">
                    Hold the line.
                  </div>
                  <div className="mb-6 [font-family:var(--mono)] text-[13px] tracking-[0.03em] text-[var(--muted)]">
                    Press{" "}
                    <kbd className="border border-[var(--line)] bg-[var(--surface)] px-2 py-0.5 text-[var(--accent)]">
                      ENTER
                    </kbd>{" "}
                    to play.
                  </div>
                </>
              )}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/"
                  data-link
                  className="btn group inline-flex items-center gap-3 border border-[var(--line)] bg-transparent px-6 py-3.5 [font-family:var(--mono)] text-[13px] tracking-[0.04em] text-[var(--text)] transition-all duration-300 hover:border-[var(--text)] hover:bg-[rgb(var(--text-rgb)_/_5%)]"
                >
                  Back home
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-[var(--line)] px-4 py-2.5 [font-family:var(--mono)] text-[10px] uppercase tracking-[0.12em] text-[var(--muted-2)]">
        ← → / TAP SIDES — ROTATE · AUTO-FIRE ENGAGED
      </div>
    </div>
  );
}
