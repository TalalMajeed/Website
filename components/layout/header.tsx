"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme";

const navItems = [
  ["About", "#about"],
  ["Skills", "#skills"],
  ["Experience", "#experience"],
  ["Work", "#work"],
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`header fixed inset-x-0 top-0 z-[100] border-b backdrop-blur-[14px] transition-colors duration-300 ${
        scrolled
          ? "border-[var(--line)] bg-[rgb(var(--ink-rgb)_/_80%)]"
          : "border-transparent bg-[rgb(var(--ink-rgb)_/_55%)]"
      }`}
      id="header"
    >
      <div className="mx-auto flex w-full max-w-[var(--maxw)] items-center justify-between px-[var(--gutter)] py-[18px]">
        <a
          href="#top"
          className="brand [font-family:var(--display)] text-[19px] font-semibold tracking-[-0.02em] max-[780px]:text-base"
          data-link
        >
          Talal <span className="text-[var(--accent)]">Majeed</span>
        </a>
        <nav className="nav flex items-center gap-9" aria-label="Primary navigation">
          {navItems.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="relative text-[13px] font-medium tracking-[0.02em] text-[var(--muted)] transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-[var(--accent)] after:transition-all hover:text-[var(--text)] hover:after:w-full max-[780px]:hidden"
              data-link
            >
              {label}
            </a>
          ))}
          <a
            href="/Talal%20Majeed%20-%20Resume.pdf"
            download
            className="relative text-[13px] font-medium tracking-[0.02em] text-[var(--muted)] transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-[var(--accent)] after:transition-all hover:text-[var(--text)] hover:after:w-full max-[780px]:hidden"
            data-link
          >
            Resume
          </a>
          <Button href="#contact" variant="nav">
            Get in touch <span aria-hidden="true">-&gt;</span>
          </Button>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
