import { STATUS_CONFIG } from "../data";

export default function StatusBadge({ status }) {
  const c = STATUS_CONFIG[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 20, fontSize: 11,
      fontWeight: 700, textTransform: "uppercase", letterSpacing: 1,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: "50%", background: c.dot,
      }} />
      {c.label}
    </span>
  );
}
