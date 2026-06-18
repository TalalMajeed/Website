"use client";

import { useEffect } from "react";

export function Cursor() {
  useEffect(() => {
    const prefersCoarse = window.matchMedia("(pointer: coarse)").matches;
    const dot = document.getElementById("cursorDot");
    const ring = document.getElementById("cursorRing");

    const onMouseMove = (event: MouseEvent) => {
      if (!dot || !ring) return;

      const left = `${event.clientX}px`;
      const top = `${event.clientY}px`;
      dot.style.left = left;
      dot.style.top = top;
      ring.style.left = left;
      ring.style.top = top;
    };

    const onLinkEnter = () => document.body.classList.add("hover-link");
    const onLinkLeave = () => document.body.classList.remove("hover-link");

    if (!prefersCoarse) {
      window.addEventListener("mousemove", onMouseMove);
      document.querySelectorAll("a, button, [data-link]").forEach((element) => {
        element.addEventListener("mouseenter", onLinkEnter);
        element.addEventListener("mouseleave", onLinkLeave);
      });
    }

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );
    document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

    const flow = document.getElementById("expFlow");
    const flowObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            flow?.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 },
    );

    if (flow) {
      flowObserver.observe(flow);
    }

    const cardObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" },
    );
    document.querySelectorAll(".exp-card").forEach((card) => cardObserver.observe(card));

    const graph = document.getElementById("contribGraph");
    const contributionCells: HTMLDivElement[] = [];

    if (graph && !graph.hasChildNodes()) {
      for (let week = 0; week < 53; week += 1) {
        const col = document.createElement("div");
        col.className = "contrib-col";

        for (let day = 0; day < 7; day += 1) {
          const cell = document.createElement("div");
          const isWeekend = day === 0 || day === 6;
          const seed = (week * 17 + day * 29 + 13) % 100;
          let level = 0;

          if (seed >= (isWeekend ? 45 : 18) && seed < (isWeekend ? 70 : 40)) {
            level = 1;
          } else if (seed >= (isWeekend ? 70 : 40) && seed < (isWeekend ? 88 : 70)) {
            level = 2;
          } else if (seed >= (isWeekend ? 88 : 70) && seed < 92) {
            level = 3;
          } else if (seed >= 92) {
            level = 4;
          }

          cell.className = `contrib-cell level-${level}`;
          cell.style.transitionDelay = `${week * 18 + day * 4}ms`;
          col.appendChild(cell);
          contributionCells.push(cell);
        }

        graph.appendChild(col);
      }
    }

    const graphObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            contributionCells.forEach((cell) => cell.classList.add("in"));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    if (graph) {
      graphObserver.observe(graph);
    }

    const rows = Array.from(document.querySelectorAll(".commit-row"));
    const commitObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            rows.forEach((row, index) => {
              window.setTimeout(() => row.classList.add("in"), index * 90);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 },
    );

    if (rows[0]?.parentElement) {
      commitObserver.observe(rows[0].parentElement);
    }

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.body.classList.remove("hover-link");
      document.querySelectorAll("a, button, [data-link]").forEach((element) => {
        element.removeEventListener("mouseenter", onLinkEnter);
        element.removeEventListener("mouseleave", onLinkLeave);
      });
      revealObserver.disconnect();
      flowObserver.disconnect();
      cardObserver.disconnect();
      graphObserver.disconnect();
      commitObserver.disconnect();
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" id="cursorDot" />
      <div className="cursor-ring" id="cursorRing" />
    </>
  );
}
