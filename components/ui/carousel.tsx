"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type WorkCase = {
  glyph: string;
  num: string;
  title: string[];
  desc: string;
  stack: string[];
  status: string;
};

type Wire = {
  id: string;
  from: number;
  to: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export function WorkCarousel({ cases }: { cases: WorkCase[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [wires, setWires] = useState<Wire[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  // Stable random vertical anchor (0..1) per gap/wire, generated client-side
  // after mount so wire heights stay put while scrolling/resizing (and avoid
  // SSR hydration mismatch from Math.random). One per connection so each wire
  // is horizontal, but different wires sit at different heights.
  const anchorsRef = useRef<number[]>([]);

  // Recompute wire endpoints (card-to-card) relative to the track box.
  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const trackBox = track.getBoundingClientRect();
    const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
    const anchors = anchorsRef.current;
    const next: Wire[] = [];

    for (let i = 0; i < cards.length - 1; i += 1) {
      const a = cards[i].getBoundingClientRect();
      const b = cards[i + 1].getBoundingClientRect();
      // Shared height for both endpoints -> a flat horizontal wire. Anchor the
      // line to the taller card's body so it always lands inside both.
      const top = Math.max(a.top, b.top) - trackBox.top;
      const height = Math.min(a.height, b.height);
      const y = top + height * (anchors[i] ?? 0.5);

      next.push({
        id: `${i}-${i + 1}`,
        from: i,
        to: i + 1,
        x1: a.right - trackBox.left,
        y1: y,
        x2: b.left - trackBox.left,
        y2: y,
      });
    }

    setWires(next);
    setCanPrev(track.scrollLeft > 4);
    setCanNext(track.scrollLeft < track.scrollWidth - track.clientWidth - 4);
  }, []);

  useEffect(() => {
    // One height per connection (cards.length - 1). Keep within the card body
    // (0.2..0.8) so horizontal wires read cleanly.
    anchorsRef.current = cases
      .slice(1)
      .map(() => 0.2 + Math.random() * 0.6);
    measure();
    const track = trackRef.current;
    if (!track) return;

    track.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      track.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure, cases]);

  const scrollByCard = useCallback((direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;

    const card = cardRefs.current.find(Boolean);
    const step = card ? card.getBoundingClientRect().width + 48 : track.clientWidth * 0.8;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  }, []);

  // Click-and-drag to scroll (pointer based, works for mouse + touch).
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    drag.current = {
      active: true,
      startX: event.clientX,
      startScroll: track.scrollLeft,
      moved: false,
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track || !drag.current.active) return;
    const delta = event.clientX - drag.current.startX;
    if (Math.abs(delta) > 4) drag.current.moved = true;
    track.scrollLeft = drag.current.startScroll - delta;
  };

  const endDrag = () => {
    drag.current.active = false;
  };

  // Swallow click after a drag so cards don't navigate accidentally.
  const onClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (drag.current.moved) {
      event.preventDefault();
      event.stopPropagation();
      drag.current.moved = false;
    }
  };

  return (
    <div className="work-carousel reveal delay-1 relative">
      <div
        ref={trackRef}
        className="work-track flex gap-12 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={onClickCapture}
      >
        <svg
          className="work-wires pointer-events-none absolute inset-0 z-[1] h-full w-full"
          aria-hidden="true"
        >
          {wires.map((wire) => {
            const active = hovered !== null && (wire.from === hovered || wire.to === hovered);

            return (
              <g
                key={wire.id}
                className={`work-wire-group transition-opacity duration-300 ${
                  active ? "opacity-100" : "opacity-0"
                }`}
              >
                <line x1={wire.x1} y1={wire.y1} x2={wire.x2} y2={wire.y2} className="work-wire" />
                <circle cx={wire.x1} cy={wire.y1} r={3} className="work-wire-node" />
                <circle cx={wire.x2} cy={wire.y2} r={3} className="work-wire-node" />
              </g>
            );
          })}
        </svg>

        {cases.map((item, index) => (
          <article
            ref={(node) => {
              cardRefs.current[index] = node;
            }}
            className="work-card relative flex min-h-[420px] w-[min(560px,82vw)] flex-none flex-col overflow-hidden border border-[var(--line)] bg-[var(--ink-2)] p-9 transition-all duration-500 hover:border-[var(--accent)] max-[880px]:min-h-80 max-[880px]:p-7"
            data-link
            key={item.num}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered((current) => (current === index ? null : current))}
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
                <div className="case-status shipped border border-[rgb(255_84_54_/_30%)] bg-[rgb(255_84_54_/_10%)] px-2.5 py-1 [font-family:var(--mono)] text-[10px] uppercase tracking-[0.1em] text-[var(--accent)]">
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

      <div className="work-controls mt-8 flex items-center gap-3">
        <button
          type="button"
          className="work-arrow flex h-11 w-11 items-center justify-center border border-[var(--line)] text-[var(--text)] transition-colors duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-default disabled:opacity-30 disabled:hover:border-[var(--line)] disabled:hover:text-[var(--text)]"
          onClick={() => scrollByCard(-1)}
          disabled={!canPrev}
          data-link
          aria-label="Previous case study"
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          className="work-arrow flex h-11 w-11 items-center justify-center border border-[var(--line)] text-[var(--text)] transition-colors duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-default disabled:opacity-30 disabled:hover:border-[var(--line)] disabled:hover:text-[var(--text)]"
          onClick={() => scrollByCard(1)}
          disabled={!canNext}
          data-link
          aria-label="Next case study"
        >
          <span aria-hidden="true">→</span>
        </button>
        <span className="work-hint ml-2 [font-family:var(--mono)] text-[11px] tracking-[0.08em] text-[var(--muted-2)]">
          drag · hover to trace
        </span>
      </div>
    </div>
  );
}
