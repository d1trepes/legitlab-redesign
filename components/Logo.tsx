// Selected C2 Compact sign (D-029). Polygons copied verbatim from
// assets/logo/selected/C2-compact-selected.svg — do not edit the geometry.
export function LogoMark({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="64 58 408 408"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="currentColor">
        <polygon points="178,76 289,76 219,344 427,344 390,442 100,442" />
        <polygon points="324,76 430,76 390,203 268,258" />
      </g>
    </svg>
  );
}

export function Logo({ size = 24 }: { size?: number }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <LogoMark size={size} />
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 860,
          fontSize: size * 0.95,
          letterSpacing: "0.04em",
          lineHeight: 1,
          textTransform: "uppercase",
        }}
      >
        Legit Lab
      </span>
    </span>
  );
}
