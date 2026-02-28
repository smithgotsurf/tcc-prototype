import { useState } from "react";
import Icon from "../shared/Icon";

const inputStyle = {
  width: "100%", background: "#fff", border: "1px solid #E0DCD0", borderRadius: 8,
  color: "#4A4A4A", padding: "10px 12px", fontSize: 14, outline: "none", boxSizing: "border-box",
};

const labelStyle = {
  fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase",
  letterSpacing: 1, marginBottom: 4, display: "block",
};

export default function NewEstimate({ onBack, onSave, nextId }) {
  const [customer, setCustomer] = useState({ name: "", address: "", phone: "", email: "" });
  const [expDays, setExpDays] = useState(30);

  const handleSave = () => {
    if (!customer.name) return;
    const now = new Date();
    const exp = new Date(now);
    exp.setDate(exp.getDate() + expDays);
    onSave({
      id: nextId(),
      customer: customer.name,
      address: customer.address,
      phone: customer.phone,
      email: customer.email,
      status: "draft",
      created: now.toISOString().split("T")[0],
      expires: exp.toISOString().split("T")[0],
      items: [],
      notes: "",
      images: [],
      acceptedAt: null,
      declinedAt: null,
      declineReason: null,
    });
  };

  return (
    <div style={{ minHeight: "100vh", color: "#4A4A4A" }}>
      <div style={{
        background: "#EDEBE5", padding: "14px 0",
        borderBottom: "2px solid #C8981E",
        display: "flex", alignItems: "center", gap: 10,
        margin: "0 -16px", paddingLeft: 16, paddingRight: 16,
      }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <Icon name="back" color="#C8981E" />
        </button>
        <span style={{ fontSize: 16, fontWeight: 700, color: "#4A4A4A" }}>New Estimate</span>
      </div>

      <div style={{ padding: "16px 0" }}>
        <div style={{
          background: "#fff", border: "1px solid #E0DCD0", borderRadius: 12, padding: 14, marginBottom: 12,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#C8981E", marginBottom: 14 }}>Customer Information</div>
          {[
            { key: "name", label: "Customer Name", placeholder: "John Smith", icon: "user" },
            { key: "address", label: "Job Site Address", placeholder: "123 Main St, Benson NC", icon: "home" },
            { key: "phone", label: "Phone", placeholder: "(919) 555-0000", icon: "phone" },
            { key: "email", label: "Email", placeholder: "john@email.com", icon: "mail" },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 12 }}>
              <label style={labelStyle}>{f.label}</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8, background: "#FBF3D5",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Icon name={f.icon} size={16} color="#C8981E" />
                </div>
                <input value={customer[f.key]}
                  onChange={e => setCustomer(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder} style={inputStyle} />
              </div>
            </div>
          ))}
        </div>

        <div style={{
          background: "#fff", border: "1px solid #E0DCD0", borderRadius: 12, padding: 14, marginBottom: 16,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#C8981E", marginBottom: 14 }}>Estimate Settings</div>
          <label style={labelStyle}>Expiration (days from today)</label>
          <div style={{ display: "flex", gap: 8 }}>
            {[15, 30, 45, 60].map(d => (
              <button key={d} onClick={() => setExpDays(d)} style={{
                flex: 1, padding: "10px 0", borderRadius: 8, cursor: "pointer",
                background: expDays === d ? "rgba(200,152,30,0.1)" : "#fff",
                border: `1px solid ${expDays === d ? "#C8981E" : "#E0DCD0"}`,
                color: expDays === d ? "#C8981E" : "#999", fontWeight: 700, fontSize: 13,
              }}>
                {d}d
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleSave} disabled={!customer.name} style={{
          width: "100%", padding: 14, background: customer.name ? "#C8981E" : "#E0DCD0",
          border: "none", borderRadius: 10, color: customer.name ? "#fff" : "#AAAAAA",
          fontWeight: 700, fontSize: 15, cursor: customer.name ? "pointer" : "not-allowed",
          boxShadow: customer.name ? "0 2px 8px rgba(200,152,30,0.3)" : "none",
        }}>
          Create Estimate
        </button>
      </div>
    </div>
  );
}
