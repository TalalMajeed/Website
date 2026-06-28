"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";

export function Newsletter() {
  const [note, setNote] = useState("Unsubscribe anytime.");
  const [isSuccess, setIsSuccess] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();

    if (!email) {
      return;
    }

    setNote(`Got it! you are on the list.`);
    setIsSuccess(true);
    form.reset();
  }

  return (
    <div className="footer-col footer-newsletter">
      <div className="footer-col-head mb-[22px] flex items-center gap-2 [font-family:var(--mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--accent)]">
        Get occasional notes
      </div>
      <p className="mb-5 max-w-80 text-sm leading-relaxed text-[var(--muted)]">
        A quiet newsletter — one or two emails a year about what I&apos;ve
        shipped, learned, or broken. No marketing.
      </p>
      <form
        className="newsletter-form flex max-w-[380px] overflow-hidden border border-[var(--line)] bg-[var(--ink)] transition-colors focus-within:border-[var(--accent)]"
        onSubmit={handleSubmit}
      >
        <input
          type="email"
          name="email"
          placeholder="you@somewhere.com"
          required
          className="min-w-0 flex-1 border-0 bg-transparent px-5 py-[13px] text-[13px] text-[var(--text)] outline-none placeholder:text-[var(--muted-2)]"
        />
        <Button type="submit" variant="newsletter">
          Subscribe <span className="newsletter-arrow">-&gt;</span>
        </Button>
      </form>
      <div
        className={`newsletter-note mt-3.5 [font-family:var(--mono)] text-sm leading-relaxed tracking-[0.05em] ${
          isSuccess ? "text-[var(--green)]" : "text-[var(--muted-2)]"
        }`}
      >
        {note}
      </div>
    </div>
  );
}
