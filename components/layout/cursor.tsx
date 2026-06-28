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

    const terminal = document.querySelector<HTMLElement>("[data-terminal]");
    const terminalTimeouts: number[] = [];
    const typeTerminal = () => {
      if (!terminal || terminal.dataset.typed === "true") return;

      terminal.dataset.typed = "true";
      terminal.classList.add("typing");

      const lines = Array.from(terminal.querySelectorAll<HTMLElement>("[data-line]"));
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let offset = 0;

      if (prefersReducedMotion) {
        lines.forEach((line) => {
          line.parentElement?.classList.add("active");
          line.textContent = line.dataset.line ?? "";
        });
        terminal.classList.remove("typing");
        return;
      }

      lines.forEach((line) => {
        const text = line.dataset.line ?? "";
        line.textContent = "";

        const startTimeout = window.setTimeout(() => {
          let index = 0;
          line.parentElement?.classList.add("active");
          line.classList.add("typing");

          const tick = () => {
            line.textContent = text.slice(0, index);
            index += 1;

            if (index <= text.length) {
              terminalTimeouts.push(window.setTimeout(tick, 18 + Math.random() * 26));
              return;
            }

            line.classList.remove("typing");

            if (line === lines[lines.length - 1]) {
              terminal.classList.remove("typing");
            }
          };

          tick();
        }, offset);

        terminalTimeouts.push(startTimeout);
        offset += text.length * 22 + 180;
      });
    };

    const terminalObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            typeTerminal();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 },
    );

    if (terminal) {
      terminalObserver.observe(terminal);
    }

    const graph = document.getElementById("contribGraph");
    const contributionCells: HTMLDivElement[] = [];

    if (graph && !graph.hasChildNodes()) {
      const year = 2025;
      const start = new Date(year, 0, 1);
      const end = new Date(year, 11, 31);
      const gridStart = new Date(start);
      gridStart.setDate(start.getDate() - start.getDay());
      const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const randomForDate = (date: Date) => {
        const value = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
        const hashed = Math.sin(value * 12.9898 + 78.233) * 43758.5453;

        return hashed - Math.floor(hashed);
      };
      const monthPositions = monthLabels.map((label, month) => {
        const date = new Date(year, month, 1);
        const week = Math.floor((date.getTime() - gridStart.getTime()) / (7 * 24 * 60 * 60 * 1000));

        return { label, week };
      });
      const monthRow = document.createElement("div");
      monthRow.className = "contrib-months";
      const weekdayColumn = document.createElement("div");
      weekdayColumn.className = "contrib-month-spacer";
      monthRow.appendChild(weekdayColumn);

      monthPositions.forEach(({ label, week }) => {
        const month = document.createElement("span");
        month.className = "contrib-month";
        month.style.gridColumn = `${week + 2} / span 4`;
        month.textContent = label;
        monthRow.appendChild(month);
      });

      const body = document.createElement("div");
      body.className = "contrib-body";
      const weekdays = document.createElement("div");
      weekdays.className = "contrib-weekdays";
      ["", "Mon", "", "Wed", "", "Fri", ""].forEach((label) => {
        const weekday = document.createElement("span");
        weekday.textContent = label;
        weekdays.appendChild(weekday);
      });
      body.appendChild(weekdays);

      const weeks = document.createElement("div");
      weeks.className = "contrib-weeks";

      for (let week = 0; week < 53; week += 1) {
        const col = document.createElement("div");
        col.className = "contrib-col";

        for (let day = 0; day < 7; day += 1) {
          const cell = document.createElement("div");
          const date = new Date(gridStart);
          date.setDate(gridStart.getDate() + week * 7 + day);
          const isInYear = date >= start && date <= end;
          const isWeekend = day === 0 || day === 6;
          const seed = randomForDate(date);
          let level = 0;

          if (!isInYear) {
            cell.className = "contrib-cell contrib-cell-empty";
            col.appendChild(cell);
            continue;
          }

          if (seed >= (isWeekend ? 0.38 : 0.16) && seed < (isWeekend ? 0.58 : 0.38)) {
            level = 1;
          } else if (seed >= (isWeekend ? 0.58 : 0.38) && seed < (isWeekend ? 0.78 : 0.66)) {
            level = 2;
          } else if (seed >= (isWeekend ? 0.78 : 0.66) && seed < 0.9) {
            level = 3;
          } else if (seed >= 0.9) {
            level = 4;
          }

          cell.className = `contrib-cell level-${level}`;
          cell.style.transitionDelay = `${week * 18 + day * 4}ms`;
          col.appendChild(cell);
          contributionCells.push(cell);
        }

        weeks.appendChild(col);
      }

      body.appendChild(weeks);
      graph.appendChild(monthRow);
      graph.appendChild(body);
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
      terminalObserver.disconnect();
      terminalTimeouts.forEach((timeout) => window.clearTimeout(timeout));
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
