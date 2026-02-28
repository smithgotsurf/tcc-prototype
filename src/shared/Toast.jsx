import Icon from "./Icon";

export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div style={{
      position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 100,
      background: "#FFFFFF", border: "1px solid #E0DCD0", borderLeft: "4px solid #C8981E",
      color: "#4A4A4A", padding: "10px 16px 10px 14px", borderRadius: 10, fontSize: 13,
      fontWeight: 600, display: "flex", alignItems: "center", gap: 8,
      boxShadow: "0 4px 20px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
      animation: "slideUp 0.25s ease",
    }}>
      <Icon name="check" size={16} color="#2E7D32" />
      {message}
    </div>
  );
}
