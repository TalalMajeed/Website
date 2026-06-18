import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "ghost" | "nav" | "newsletter";

type CommonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

type AnchorButtonProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type NativeButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type ButtonProps = AnchorButtonProps | NativeButtonProps;

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "btn group inline-flex items-center gap-3 overflow-hidden rounded-full border border-[var(--accent)] bg-[var(--accent)] px-6 py-4 [font-family:var(--mono)] text-[13px] font-medium tracking-[0.04em] text-[var(--ink)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent-soft)] hover:bg-[var(--accent-soft)]",
  ghost:
    "btn group inline-flex items-center gap-3 overflow-hidden rounded-full border border-[var(--line)] bg-transparent px-6 py-4 [font-family:var(--mono)] text-[13px] tracking-[0.04em] text-[var(--text)] transition-all duration-300 hover:border-[var(--text)] hover:bg-[rgb(240_237_230_/_5%)]",
  nav:
    "nav-cta rounded-full border border-[var(--line)] bg-transparent px-4 py-[9px] [font-family:var(--mono)] text-xs text-[var(--text)] transition-all duration-200 hover:border-[var(--accent)] hover:bg-[rgb(255_84_54_/_8%)] max-[780px]:px-3.5 max-[780px]:py-2 max-[780px]:text-[11px]",
  newsletter:
    "newsletter-button border-0 bg-[var(--accent)] px-[22px] py-[13px] [font-family:var(--mono)] text-xs font-semibold tracking-[0.04em] text-[var(--ink)] transition-colors duration-200 hover:bg-[var(--accent-soft)]",
};

export function Button({
  children,
  variant = "ghost",
  className = "",
  ...props
}: ButtonProps) {
  const classes = `${variantClass[variant]} ${className}`.trim();

  if ("href" in props) {
    const anchorProps = props as AnchorButtonProps;

    return (
      <a className={classes} data-link {...anchorProps}>
        {children}
      </a>
    );
  }

  const buttonProps = props as NativeButtonProps;

  return (
    <button className={classes} data-link {...buttonProps}>
      {children}
    </button>
  );
}
