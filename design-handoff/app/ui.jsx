/* Break'Distrib — Shared UI primitives */

const { useState, useEffect, useRef, useMemo } = React;

// ── Icons: minimal outline set, 1.5 stroke, 20px grid ──
const Icon = ({ name, size = 18, color = "currentColor", strokeWidth = 1.6 }) => {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "dashboard": return <svg {...p}><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>;
    case "pipeline": return <svg {...p}><rect x="3" y="4" width="5" height="16" rx="1"/><rect x="10" y="4" width="5" height="10" rx="1"/><rect x="17" y="4" width="4" height="14" rx="1"/></svg>;
    case "machine":  return <svg {...p}><rect x="5" y="3" width="14" height="18" rx="1.5"/><line x1="5" y1="10" x2="19" y2="10"/><line x1="5" y1="15" x2="19" y2="15"/><circle cx="9" cy="18" r="0.5" fill={color}/></svg>;
    case "truck":    return <svg {...p}><rect x="2" y="7" width="12" height="9" rx="1"/><path d="M14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/></svg>;
    case "route":    return <svg {...p}><circle cx="6" cy="5" r="2"/><circle cx="18" cy="19" r="2"/><path d="M6 7v4a4 4 0 0 0 4 4h4a4 4 0 0 1 4 4"/></svg>;
    case "chart":    return <svg {...p}><path d="M3 20V4"/><path d="M3 20h18"/><path d="M7 16l4-4 4 3 5-7"/></svg>;
    case "users":    return <svg {...p}><circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0"/><path d="M16 4a3.5 3.5 0 0 1 0 7"/><path d="M22 20a5.5 5.5 0 0 0-4-5.3"/></svg>;
    case "settings": return <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>;
    case "search":   return <svg {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
    case "bell":     return <svg {...p}><path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9Z"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>;
    case "plus":     return <svg {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
    case "arrow-up":   return <svg {...p}><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>;
    case "arrow-down": return <svg {...p}><line x1="12" y1="5" x2="12" y2="19"/><polyline points="5 12 12 19 19 12"/></svg>;
    case "arrow-right":return <svg {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
    case "chevron":  return <svg {...p}><polyline points="9 6 15 12 9 18"/></svg>;
    case "chevron-down": return <svg {...p}><polyline points="6 9 12 15 18 9"/></svg>;
    case "more":     return <svg {...p}><circle cx="5" cy="12" r="1.2" fill={color}/><circle cx="12" cy="12" r="1.2" fill={color}/><circle cx="19" cy="12" r="1.2" fill={color}/></svg>;
    case "filter":   return <svg {...p}><path d="M3 5h18l-7 9v5l-4 2v-7z"/></svg>;
    case "download": return <svg {...p}><path d="M12 3v12"/><polyline points="7 10 12 15 17 10"/><path d="M4 18h16v3H4z"/></svg>;
    case "calendar": return <svg {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/></svg>;
    case "leaf":     return <svg {...p}><path d="M21 3C11 3 3 9 3 18c0 1 .1 2 .3 3C12 21 21 13 21 3Z"/><path d="M7 17c3-3 7-5 10-6"/></svg>;
    case "bolt":     return <svg {...p}><polygon points="13 2 4 14 11 14 10 22 20 10 13 10 14 2"/></svg>;
    case "wifi":     return <svg {...p}><path d="M5 13a10 10 0 0 1 14 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><circle cx="12" cy="20" r="0.8" fill={color}/></svg>;
    case "wifi-off": return <svg {...p}><line x1="3" y1="3" x2="21" y2="21"/><path d="M16 16.5a5 5 0 0 0-6 0"/><path d="M5 13a10 10 0 0 1 8-3"/><path d="M20 13a9.9 9.9 0 0 0-3-2.3"/></svg>;
    case "alert":    return <svg {...p}><path d="M12 3 1 21h22Z"/><line x1="12" y1="10" x2="12" y2="14"/><circle cx="12" cy="17" r="0.6" fill={color}/></svg>;
    case "check":    return <svg {...p}><polyline points="4 12 10 18 20 6"/></svg>;
    case "x":        return <svg {...p}><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>;
    case "map":      return <svg {...p}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>;
    case "pin":      return <svg {...p}><path d="M12 22s7-8 7-13a7 7 0 0 0-14 0c0 5 7 13 7 13z"/><circle cx="12" cy="9" r="2.5"/></svg>;
    case "phone":    return <svg {...p}><path d="M22 17a3 3 0 0 1-3 3A17 17 0 0 1 2 5a3 3 0 0 1 3-3h2a1.4 1.4 0 0 1 1.4 1l.7 2.8a1.4 1.4 0 0 1-.4 1.4l-1.3 1.2a14 14 0 0 0 6.2 6.2l1.2-1.3a1.4 1.4 0 0 1 1.4-.4l2.8.7A1.4 1.4 0 0 1 22 15z"/></svg>;
    case "mail":     return <svg {...p}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="m2 7 10 7L22 7"/></svg>;
    case "camera":   return <svg {...p}><path d="M4 7h4l2-3h4l2 3h4v12H4z"/><circle cx="12" cy="13" r="3.5"/></svg>;
    case "scan":     return <svg {...p}><path d="M4 8V5a1 1 0 0 1 1-1h3"/><path d="M16 4h3a1 1 0 0 1 1 1v3"/><path d="M20 16v3a1 1 0 0 1-1 1h-3"/><path d="M8 20H5a1 1 0 0 1-1-1v-3"/><line x1="4" y1="12" x2="20" y2="12"/></svg>;
    case "coffee":   return <svg {...p}><path d="M3 8h14v6a5 5 0 0 1-10 0V8Z"/><path d="M17 10h2a2 2 0 0 1 0 4h-2"/><path d="M6 3v2M10 3v2M14 3v2"/></svg>;
    case "snack":    return <svg {...p}><rect x="4" y="3" width="16" height="18" rx="2"/><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/></svg>;
    case "euro":     return <svg {...p}><path d="M18 6a7 7 0 1 0 0 12"/><line x1="4" y1="10" x2="14" y2="10"/><line x1="4" y1="14" x2="14" y2="14"/></svg>;
    case "clock":    return <svg {...p}><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 16 14"/></svg>;
    case "signature":return <svg {...p}><path d="M3 17c4 0 4-8 8-8s3 8 7 8"/><line x1="3" y1="21" x2="21" y2="21"/></svg>;
    case "logout":   return <svg {...p}><path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
    case "sun":      return <svg {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>;
    case "moon":     return <svg {...p}><path d="M21 13a8.5 8.5 0 1 1-10-10 7 7 0 0 0 10 10z"/></svg>;
    case "package":  return <svg {...p}><path d="M3 7 12 3l9 4-9 4z"/><path d="M3 7v10l9 4 9-4V7"/><line x1="12" y1="11" x2="12" y2="21"/></svg>;
    case "trending": return <svg {...p}><polyline points="3 17 10 10 14 14 21 6"/><polyline points="15 6 21 6 21 12"/></svg>;
    default:         return null;
  }
}

// ── Loader SVG — reused from Spinner.html, smaller and tweakable ──
function BDLoader({ size = 28, dur = "2.2s", color = "#F37021", inline = false }) {
  const id = useRef("bd-" + Math.random().toString(36).slice(2, 8)).current;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: inline ? "inline-block" : "block", verticalAlign: "middle" }} aria-label="Chargement">
      <g transform="rotate(0 50 50)">
        <path fill={color} d="M 36 26 L 44 26 L 44 74 L 36 74 Z">
          <animate attributeName="d" dur={dur} repeatCount="indefinite" calcMode="spline"
            keyTimes="0; 0.10; 0.45; 0.65; 1"
            keySplines="0.5 0 0.5 1; 0.65 0 0.35 1; 0.5 0 0.5 1; 0.65 0 0.35 1"
            values="M 36 26 L 44 26 L 44 74 L 36 74 Z;M 36 26 L 44 26 L 44 74 L 36 74 Z;M 32 22 L 74 50 L 74 50 L 32 78 Z;M 32 22 L 74 50 L 74 50 L 32 78 Z;M 36 26 L 44 26 L 44 74 L 36 74 Z"/>
        </path>
        <path fill={color} d="M 56 26 L 64 26 L 64 74 L 56 74 Z">
          <animate attributeName="d" dur={dur} repeatCount="indefinite" calcMode="spline"
            keyTimes="0; 0.10; 0.45; 0.65; 1"
            keySplines="0.5 0 0.5 1; 0.65 0 0.35 1; 0.5 0 0.5 1; 0.65 0 0.35 1"
            values="M 56 26 L 64 26 L 64 74 L 56 74 Z;M 56 26 L 64 26 L 64 74 L 56 74 Z;M 32 22 L 74 50 L 74 50 L 32 78 Z;M 32 22 L 74 50 L 74 50 L 32 78 Z;M 56 26 L 64 26 L 64 74 L 56 74 Z"/>
        </path>
        <animateTransform attributeName="transform" type="rotate" dur={dur} repeatCount="indefinite" calcMode="spline"
          keyTimes="0; 0.10; 0.45; 0.65; 1"
          keySplines="0.5 0 0.5 1; 0.65 0 0.35 1; 0.5 0 0.5 1; 0.65 0 0.35 1"
          values="0 50 50; 0 50 50; 360 50 50; 360 50 50; 720 50 50"/>
      </g>
    </svg>
  );
}

// ── Logo mark (static pause bars) ──
function BDMark({ size = 22, color = "var(--bd-orange)" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <rect x="34" y="22" width="10" height="56" rx="1.5" fill={color}/>
      <rect x="56" y="22" width="10" height="56" rx="1.5" fill={color}/>
    </svg>
  );
}

// ── Status dot with IoT pulse ──
function StatusDot({ status = "ok", size = 8, pulse = true }) {
  const map = {
    ok:   { color: "var(--ok)",   anim: "pulse-ok"   },
    warn: { color: "var(--warn)", anim: "pulse-warn" },
    err:  { color: "var(--err)",  anim: "pulse-err"  },
    idle: { color: "var(--n-400)", anim: null },
  };
  const s = map[status] || map.ok;
  return <span style={{
    display: "inline-block", width: size, height: size, borderRadius: "50%",
    background: s.color, flexShrink: 0,
    animation: pulse && s.anim ? `${s.anim} 1.8s ease-out infinite` : "none",
  }} />;
}

// ── Badge ──
function Badge({ tone = "neutral", children, dot = false, mono = false, size = "md" }) {
  const tones = {
    neutral: { bg: "var(--surface-3)", fg: "var(--text-2)", bd: "var(--border)" },
    ok:      { bg: "var(--ok-bg)",   fg: "var(--ok)",   bd: "transparent" },
    warn:    { bg: "var(--warn-bg)", fg: "var(--warn)", bd: "transparent" },
    err:     { bg: "var(--err-bg)",  fg: "var(--err)",  bd: "transparent" },
    info:    { bg: "var(--info-bg)", fg: "var(--info)", bd: "transparent" },
    brand:   { bg: "var(--bd-orange-50)", fg: "var(--bd-orange-600)", bd: "transparent" },
    ink:     { bg: "var(--text)",    fg: "var(--text-inv)", bd: "transparent" },
  };
  const t = tones[tone] || tones.neutral;
  const sz = size === "sm" ? { pad: "2px 6px", fs: 10.5 } : { pad: "3px 8px", fs: 11.5 };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: sz.pad, borderRadius: 999,
      background: t.bg, color: t.fg, border: `1px solid ${t.bd}`,
      fontSize: sz.fs, fontWeight: 500, whiteSpace: "nowrap",
      fontFamily: mono ? "var(--ff-mono)" : "var(--ff-sans)",
      letterSpacing: mono ? 0.2 : 0,
    }}>
      {dot && <StatusDot status={tone === "neutral" ? "idle" : tone} size={6} pulse={false}/>}
      {children}
    </span>
  );
}

// ── Button ──
function Button({ variant = "secondary", size = "md", icon, iconRight, children, onClick, style = {}, type = "button", active = false }) {
  const sizes = {
    sm: { h: 28, px: 10, fs: 12.5, gap: 6, ic: 14 },
    md: { h: 34, px: 12, fs: 13.5, gap: 7, ic: 16 },
    lg: { h: 40, px: 14, fs: 14, gap: 8, ic: 18 },
  };
  const s = sizes[size];
  const variants = {
    primary: { bg: "var(--bd-orange)",  fg: "#fff",            bd: "transparent", sh: "0 1px 0 rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.15)" },
    secondary:{ bg: "var(--elev)",      fg: "var(--text)",     bd: "var(--border-strong)", sh: "var(--shadow-xs)" },
    ghost:   { bg: "transparent",       fg: "var(--text-2)",   bd: "transparent", sh: "none" },
    ink:     { bg: "var(--text)",       fg: "var(--text-inv)", bd: "transparent", sh: "var(--shadow-xs)" },
    danger:  { bg: "var(--err)",        fg: "#fff",            bd: "transparent", sh: "var(--shadow-xs)" },
  };
  const v = variants[variant];
  return (
    <button type={type} onClick={onClick} style={{
      height: s.h, padding: `0 ${s.px}px`, borderRadius: 8,
      display: "inline-flex", alignItems: "center", gap: s.gap,
      background: active ? "var(--surface-3)" : v.bg, color: v.fg,
      border: `1px solid ${v.bd}`, boxShadow: v.sh,
      fontSize: s.fs, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap",
      transition: "background var(--dur-fast) var(--ease), transform var(--dur-fast) var(--ease)",
      ...style,
    }}>
      {icon && <Icon name={icon} size={s.ic}/>}
      {children}
      {iconRight && <Icon name={iconRight} size={s.ic}/>}
    </button>
  );
}

// ── Card ──
function Card({ children, style = {}, pad = 16, interactive = false }) {
  return (
    <div style={{
      background: "var(--elev)",
      border: "1px solid var(--border)",
      borderRadius: "var(--r-lg)",
      boxShadow: "var(--shadow-sm)",
      padding: pad,
      transition: "border-color var(--dur) var(--ease), transform var(--dur) var(--ease)",
      cursor: interactive ? "pointer" : "default",
      ...style,
    }}>{children}</div>
  );
}

// ── Section header ──
function SectionHead({ title, subtitle, right }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 14 }}>
      <div>
        <div style={{ fontSize: 14.5, fontWeight: 600, letterSpacing: -0.1 }}>{title}</div>
        {subtitle && <div style={{ color: "var(--text-3)", fontSize: 12.5, marginTop: 2 }}>{subtitle}</div>}
      </div>
      {right}
    </div>
  );
}

// ── Sparkline ──
function Sparkline({ data, width = 120, height = 32, color = "var(--bd-orange)", fill = true, strokeWidth = 1.5 }) {
  const w = width, h = height;
  const min = Math.min(...data), max = Math.max(...data);
  const span = Math.max(0.0001, max - min);
  const pad = 2;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / span) * (h - pad * 2);
    return [x, y];
  });
  const d = pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(" ");
  const fillD = `${d} L ${pts[pts.length - 1][0]} ${h} L ${pts[0][0]} ${h} Z`;
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      {fill && <path d={fillD} fill={color} fillOpacity="0.12"/>}
      <path d={d} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={2.5} fill={color}/>
    </svg>
  );
}

// ── Progress bar ──
function Bar({ value, tone = "ok", height = 6 }) {
  const color = tone === "ok" ? "var(--ok)" : tone === "warn" ? "var(--warn)" : tone === "err" ? "var(--err)" : "var(--bd-orange)";
  return (
    <div style={{ height, background: "var(--surface-3)", borderRadius: 999, overflow: "hidden" }}>
      <div style={{ width: `${Math.max(0, Math.min(100, value))}%`, height: "100%", background: color, borderRadius: 999, transition: "width .3s var(--ease)" }}/>
    </div>
  );
}

// ── KPI card ──
function KPI({ label, value, unit, delta, deltaLabel, spark, tone = "neutral" }) {
  const up = (delta ?? 0) >= 0;
  return (
    <Card pad={16} style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 126 }}>
      <div className="label">{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <div className="tabular" style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.8, lineHeight: 1 }}>{value}</div>
        {unit && <div style={{ color: "var(--text-3)", fontSize: 13 }}>{unit}</div>}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: "auto" }}>
        {delta !== undefined && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 5, color: up ? "var(--ok)" : "var(--err)", fontSize: 12, fontWeight: 500 }}>
            <Icon name={up ? "arrow-up" : "arrow-down"} size={12}/>
            <span className="tabular">{Math.abs(delta)}%</span>
            <span style={{ color: "var(--text-3)", fontWeight: 400 }}>{deltaLabel}</span>
          </div>
        )}
        {spark && <Sparkline data={spark} width={96} height={28} color={tone === "brand" ? "var(--bd-orange)" : tone === "ok" ? "var(--ok)" : "var(--text-2)"}/>}
      </div>
    </Card>
  );
}

// ── Page chrome (header + body container) ──
function PageHeader({ title, subtitle, actions, tabs, activeTab, onTab }) {
  return (
    <header style={{ padding: "24px 32px 0" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: tabs ? 18 : 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: -0.4 }}>{title}</h1>
          {subtitle && <div style={{ color: "var(--text-3)", marginTop: 4, fontSize: 13 }}>{subtitle}</div>}
        </div>
        {actions && <div style={{ display: "flex", gap: 8, alignItems: "center" }}>{actions}</div>}
      </div>
      {tabs && (
        <div style={{ display: "flex", gap: 2, borderBottom: "1px solid var(--border)", marginBottom: -1 }}>
          {tabs.map(t => {
            const on = activeTab === t.id;
            return (
              <button key={t.id} onClick={() => onTab?.(t.id)} style={{
                background: "transparent", border: 0, padding: "10px 14px",
                fontSize: 13, fontWeight: 500, cursor: "pointer",
                color: on ? "var(--text)" : "var(--text-3)",
                borderBottom: `2px solid ${on ? "var(--bd-orange)" : "transparent"}`,
                marginBottom: -1,
              }}>
                {t.label}
                {t.count !== undefined && <span className="mono tabular" style={{ marginLeft: 6, fontSize: 11, color: "var(--text-3)" }}>{t.count}</span>}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}

// ── Side nav ──
function SideNav({ current, onNav, collapsed = false }) {
  const items = [
    { id: "dashboard", label: "Dashboard",   icon: "dashboard" },
    { id: "pipeline",  label: "Pipeline",    icon: "pipeline", count: 23 },
    { id: "parc",      label: "Parc",        icon: "machine",  count: 142 },
    { id: "tournees",  label: "Tournées",    icon: "route" },
    { id: "reporting", label: "Reporting",   icon: "chart" },
    { id: "clients",   label: "Clients",     icon: "users" },
  ];
  return (
    <aside style={{
      width: collapsed ? 62 : 232, flexShrink: 0,
      background: "var(--surface)",
      borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column",
      padding: "14px 10px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 8px 16px" }}>
        <BDMark size={22}/>
        {!collapsed && <div style={{ fontWeight: 600, letterSpacing: -0.2 }}>Break<span style={{ color: "var(--bd-orange)" }}>'</span>Distrib</div>}
      </div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {items.map(it => {
          const on = current === it.id;
          return (
            <button key={it.id} onClick={() => onNav?.(it.id)} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "7px 10px", borderRadius: 8,
              background: on ? "var(--surface-3)" : "transparent",
              color: on ? "var(--text)" : "var(--text-2)",
              border: 0, textAlign: "left", cursor: "pointer",
              fontSize: 13.5, fontWeight: on ? 500 : 400,
              position: "relative",
            }}>
              <Icon name={it.icon} size={17} color={on ? "var(--bd-orange)" : "currentColor"}/>
              {!collapsed && <>
                <span style={{ flex: 1 }}>{it.label}</span>
                {it.count !== undefined && <span className="mono tabular" style={{ fontSize: 11, color: "var(--text-3)" }}>{it.count}</span>}
              </>}
            </button>
          );
        })}
      </nav>

      <div style={{ flex: 1 }}/>

      {!collapsed && (
        <div style={{ padding: "10px 10px 6px", borderTop: "1px solid var(--border)", marginTop: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 0" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--bd-orange)", color: "#fff", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 600 }}>CM</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 500 }}>Camille Morel</div>
              <div style={{ fontSize: 11, color: "var(--text-3)" }}>Direction</div>
            </div>
            <Icon name="chevron" size={14} color="var(--text-3)"/>
          </div>
        </div>
      )}
    </aside>
  );
}

// ── Topbar ──
function TopBar({ search, right, onTheme, theme }) {
  return (
    <div style={{
      height: 52, borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center", gap: 12,
      padding: "0 20px", background: "var(--surface)",
      position: "sticky", top: 0, zIndex: 5,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-3)", fontSize: 12.5 }}>
        <span>Break'Distrib</span>
        <Icon name="chevron" size={12}/>
        <span style={{ color: "var(--text)" }}>{search || "Workspace"}</span>
      </div>
      <div style={{ flex: 1 }}/>
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        background: "var(--surface-2)", border: "1px solid var(--border)",
        padding: "5px 10px", borderRadius: 8, width: 260,
      }}>
        <Icon name="search" size={15} color="var(--text-3)"/>
        <span style={{ color: "var(--text-3)", fontSize: 12.5 }}>Rechercher client, machine, contrat…</span>
        <span className="mono" style={{ marginLeft: "auto", fontSize: 10.5, color: "var(--text-3)", border: "1px solid var(--border)", padding: "1px 5px", borderRadius: 4 }}>⌘K</span>
      </div>
      <button onClick={onTheme} title="Thème" style={{ background: "transparent", border: "1px solid var(--border)", width: 32, height: 32, borderRadius: 8, display: "grid", placeItems: "center", cursor: "pointer", color: "var(--text-2)" }}>
        <Icon name={theme === "dark" ? "sun" : "moon"} size={15}/>
      </button>
      <button title="Notifications" style={{ background: "transparent", border: "1px solid var(--border)", width: 32, height: 32, borderRadius: 8, display: "grid", placeItems: "center", cursor: "pointer", color: "var(--text-2)", position: "relative" }}>
        <Icon name="bell" size={15}/>
        <span style={{ position: "absolute", top: 7, right: 7, width: 6, height: 6, borderRadius: "50%", background: "var(--bd-orange)" }}/>
      </button>
      {right}
    </div>
  );
}

Object.assign(window, {
  Icon, BDLoader, BDMark, StatusDot, Badge, Button, Card, SectionHead,
  Sparkline, Bar, KPI, PageHeader, SideNav, TopBar,
});
