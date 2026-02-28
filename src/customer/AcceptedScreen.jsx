import Icon from "../shared/Icon";
import { BUSINESS } from "../data";
import { fmt } from "../shared/helpers";

export default function AcceptedScreen({ estimate, total }) {
  const deposit = total * 0.5;
  const firstName = estimate.customer.split(" ")[0];

  return (
    <div style={{
      maxWidth: 720, margin: "0 auto", padding: "0 16px",
      fontFamily: "var(--font-sans, 'DM Sans', sans-serif)",
      minHeight: "100vh", background: "#F7F5F0",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      textAlign: "center",
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: "50%", background: "#E8F5E9",
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20,
        border: "3px solid #2E7D32",
        animation: "scaleCheck 0.4s ease",
      }}>
        <Icon name="check" size={40} color="#2E7D32" />
      </div>
      <div style={{
        fontSize: 28, fontWeight: 700, color: "#2E7D32", marginBottom: 8,
        fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
      }}>
        Estimate Accepted!
      </div>
      <div style={{ fontSize: 15, color: "#777", lineHeight: 1.6, marginBottom: 24, maxWidth: 380 }}>
        Thank you, {firstName}! Your estimate for {fmt(total)} has been accepted. We'll be in touch within 24 hours to schedule your project.
      </div>
      <div style={{
        background: "#fff", border: "1px solid #E0DCD0", borderRadius: 12, padding: 20,
        width: "100%", maxWidth: 380,
      }}>
        <div style={{
          fontSize: 16, color: "#C8981E", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10,
          fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
        }}>
          Next Steps
        </div>
        <div style={{ fontSize: 14, color: "#777", lineHeight: 1.7, textAlign: "left" }}>
          <div style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="check" size={14} color="#2E7D32" /> Confirmation email sent to {estimate.email}
          </div>
          <div style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="check" size={14} color="#2E7D32" /> Deposit invoice of {fmt(deposit)} will follow
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="check" size={14} color="#2E7D32" /> We'll call to confirm your schedule
          </div>
        </div>
      </div>
      <div style={{ marginTop: 24, fontSize: 13, color: "#AAAAAA" }}>
        Questions? Call us at {BUSINESS.phone}
      </div>
    </div>
  );
}
