import { useState } from "react";

const REASONS = ["Price too high", "Went with another company", "Project postponed", "Changed scope", "Other"];

export default function DeclineFlow({ onDecline, onCancel }) {
  const [selected, setSelected] = useState(null);
  const [reason, setReason] = useState("");

  return (
    <div style={{ padding: "0 4px 16px" }}>
      <div style={{
        background: "#FFEBEE", border: "1px solid #EF9A9A", borderRadius: 12, padding: 16, marginBottom: 12,
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#C62828", marginBottom: 12 }}>
          We're sorry to hear that. Would you let us know why?
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
          {REASONS.map(r => (
            <button key={r} onClick={() => setSelected(r)} style={{
              padding: "10px 12px", borderRadius: 8, textAlign: "left",
              background: selected === r ? "#FFCDD2" : "#fff",
              border: `1px solid ${selected === r ? "#EF9A9A" : "#E0DCD0"}`,
              color: selected === r ? "#C62828" : "#777", fontWeight: selected === r ? 600 : 400,
              fontSize: 13, cursor: "pointer",
            }}>{r}</button>
          ))}
        </div>
        {selected === "Other" && (
          <textarea value={reason} onChange={e => setReason(e.target.value)}
            placeholder="Please tell us more..."
            style={{
              width: "100%", padding: 10, border: "1px solid #E0DCD0", borderRadius: 8,
              fontSize: 13, minHeight: 80, resize: "vertical", outline: "none",
              fontFamily: "inherit", boxSizing: "border-box",
              background: "#fff", color: "#4A4A4A",
            }} />
        )}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onCancel} style={{
          flex: 1, padding: 12, background: "#F7F5F0", border: "1px solid #E0DCD0",
          borderRadius: 8, color: "#999", fontWeight: 600, cursor: "pointer", fontSize: 13,
        }}>Go Back</button>
        <button onClick={() => onDecline(selected === "Other" ? reason || "Other" : selected)} disabled={!selected} style={{
          flex: 1, padding: 12,
          background: selected ? "#C62828" : "#E0DCD0",
          border: "none", borderRadius: 8, color: selected ? "#fff" : "#AAAAAA",
          fontWeight: 700, cursor: selected ? "pointer" : "not-allowed", fontSize: 13,
        }}>Decline Estimate</button>
      </div>
    </div>
  );
}
