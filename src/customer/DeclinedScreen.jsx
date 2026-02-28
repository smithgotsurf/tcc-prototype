import { BUSINESS } from "../data";

export default function DeclinedScreen({ estimate }) {
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
        fontSize: 26, fontWeight: 700, color: "#4A4A4A", marginBottom: 8,
        fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
      }}>
        Estimate Declined
      </div>
      <div style={{ fontSize: 15, color: "#999", lineHeight: 1.6, marginBottom: 24, maxWidth: 380 }}>
        We understand, {firstName}. If anything changes or you'd like to discuss adjustments, we're always here to help.
      </div>
      <div style={{
        width: 40, height: 2, background: "#C8981E", marginBottom: 24,
      }} />
      <div style={{ fontSize: 14, color: "#777" }}>
        {BUSINESS.phone} &middot; {BUSINESS.email}
      </div>
    </div>
  );
}
