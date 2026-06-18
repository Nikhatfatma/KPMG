"use client";

/**
 * KPMG logo — renders the transparent vector SVG at /public/kpmg-logo.svg.
 *
 * The SVG should have a transparent background. Because it's transparent it
 * displays correctly on both light and dark backgrounds without needing
 * recoloring, so the `variant` prop is accepted for API compatibility but
 * has no visual effect.
 *
 * Props:
 *   size:    height in px (default 28). Width auto-scales to the image's natural aspect.
 *   badge:   optional pill text rendered to the right ("DEMO", "CONSOLE", etc.).
 *   variant: accepted for API compat — light / dark.
 *   className / style: forwarded to the wrapper.
 */
export default function Logo({ size = 28, badge, variant, className = "", style = {} }) {
  return (
    <span className={`kpmg-logo ${className}`} style={{ display: "inline-flex", alignItems: "center", gap: 10, ...style }}>
      <img
        src="/kpmg-logo.svg"
        alt="KPMG"
        height={size}
        style={{ height: size, width: "auto", display: "block", flexShrink: 0 }}
      />
      {badge ? <span className="kpmg-logo-badge">{badge}</span> : null}
    </span>
  );
}
