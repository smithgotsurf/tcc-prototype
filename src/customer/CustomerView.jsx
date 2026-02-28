import { useState } from "react";
import { useParams } from "react-router-dom";
import useEstimates from "../useEstimates";
import Icon from "../shared/Icon";
import { BUSINESS, DEFAULT_TERMS } from "../data";
import { fmt, fullDate, daysUntil, estimateTotal } from "../shared/helpers";
import AcceptedScreen from "./AcceptedScreen";
import DeclinedScreen from "./DeclinedScreen";
import DeclineFlow from "./DeclineFlow";
import SignaturePad from "./SignaturePad";

export default function CustomerView() {
  const { id } = useParams();
  const { getEstimate, updateEstimate } = useEstimates();
  const estimate = getEstimate(id);

  const [viewStatus, setViewStatus] = useState(null);
  const [termsOpen, setTermsOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  if (!estimate) {
    return (
      <div style={{
        maxWidth: 720, margin: "0 auto", padding: "0 16px",
        fontFamily: "var(--font-sans, 'DM Sans', sans-serif)",
        minHeight: "100vh", background: "#F7F5F0",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        textAlign: "center",
      }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#4A4A4A", marginBottom: 8, fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)" }}>
          Estimate Not Found
        </div>
        <div style={{ fontSize: 15, color: "#999", lineHeight: 1.6, maxWidth: 340 }}>
          This estimate link may have expired or is invalid. Please contact us if you need assistance.
        </div>
        <div style={{ marginTop: 24, fontSize: 14, color: "#777" }}>
          {BUSINESS.phone} &middot; {BUSINESS.email}
        </div>
      </div>
    );
  }

  const total = estimateTotal(estimate.items);
  const deposit = total * 0.5;
  const days = daysUntil(estimate.expires);

  const effectiveStatus = viewStatus || estimate.status;

  if (effectiveStatus === "accepted") {
    return <AcceptedScreen estimate={estimate} total={total} />;
  }
  if (effectiveStatus === "declined") {
    return <DeclinedScreen estimate={estimate} />;
  }

  const handleAccept = () => {
    const updated = {
      ...estimate,
      status: "accepted",
      acceptedAt: new Date().toISOString(),
    };
    updateEstimate(updated);
    setViewStatus("accepted");
  };

  const handleDecline = (reason) => {
    const updated = {
      ...estimate,
      status: "declined",
      declinedAt: new Date().toISOString(),
      declineReason: reason,
    };
    updateEstimate(updated);
    setViewStatus("declined");
  };

  const showActions = estimate.status === "sent";

  return (
    <div style={{
      maxWidth: 720, margin: "0 auto", padding: "0 16px",
      fontFamily: "var(--font-sans, 'DM Sans', sans-serif)",
      minHeight: "100vh", background: "#F7F5F0",
    }}>
      {/* Company Header */}
      <div style={{
        background: "#4A4A4A", padding: "28px 20px 24px", textAlign: "center",
        margin: "0 -16px",
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 12, background: "rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 12px", border: "1px solid rgba(255,255,255,0.15)",
          fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
          fontSize: 24, fontWeight: 700,
        }}>
          <span style={{ color: "#E8C44A" }}>T</span>
          <span style={{ color: "#D0D0D0" }}>C</span>
        </div>
        <div style={{
          fontSize: 18, fontWeight: 600, color: "#E8C44A", letterSpacing: 3, marginBottom: 4,
          fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
          textTransform: "uppercase",
        }}>
          {BUSINESS.name}
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", letterSpacing: 0.5 }}>
          {BUSINESS.tagline}
        </div>
        <div style={{ width: 40, height: 2, background: "#C8981E", margin: "12px auto 0" }} />
      </div>

      {/* Estimate Info Bar */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #E0DCD0",
        padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center",
        margin: "0 -16px",
      }}>
        <div>
          <div style={{ fontSize: 11, color: "#AAAAAA", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Estimate</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#4A4A4A", fontFamily: "monospace" }}>{estimate.id}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: 1,
            color: days < 7 ? "#C62828" : "#999",
            textTransform: "uppercase",
            animation: days < 7 ? "pulse 2s ease-in-out infinite" : "none",
          }}>
            {days} days remaining
          </div>
          <div style={{ fontSize: 12, color: "#AAAAAA" }}>Valid until {fullDate(estimate.expires)}</div>
        </div>
      </div>

      {/* Customer & Job Info */}
      <div style={{ padding: "16px 4px 0" }}>
        <div style={{
          background: "#fff", borderRadius: 12, border: "1px solid #E0DCD0",
          padding: 16, marginBottom: 12,
        }}>
          <div style={{
            fontSize: 15, fontWeight: 700, color: "#C8981E", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12,
            fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
          }}>
            Prepared For
          </div>
          {[
            { icon: "user", value: estimate.customer },
            { icon: "home", value: estimate.address },
            { icon: "phone", value: estimate.phone },
            { icon: "mail", value: estimate.email },
          ].map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < 3 ? 10 : 0 }}>
              <Icon name={f.icon} size={15} color="#C8981E" />
              <span style={{ fontSize: 14, color: "#4A4A4A" }}>{f.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Line Items */}
      <div style={{ padding: "0 4px" }}>
        <div style={{
          background: "#fff", borderRadius: 12, border: "1px solid #E0DCD0",
          overflow: "hidden", marginBottom: 12,
        }}>
          <div style={{
            padding: "12px 16px", borderBottom: "1px solid #E0DCD0",
            fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
            fontSize: 15, fontWeight: 700, color: "#C8981E", textTransform: "uppercase", letterSpacing: 1.5,
          }}>
            Scope of Work
          </div>
          {estimate.items.map((item, i) => (
            <div key={item.id} style={{
              padding: "14px 16px",
              borderBottom: i < estimate.items.length - 1 ? "1px solid #F0EFE8" : "none",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1, paddingRight: 12 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#4A4A4A", marginBottom: 3 }}>{item.desc}</div>
                  <div style={{ fontSize: 12, color: "#AAAAAA" }}>
                    {item.qty} {item.unit} × {fmt(item.rate)}/{item.unit}
                  </div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#4A4A4A", whiteSpace: "nowrap" }}>
                  {fmt(item.qty * item.rate)}
                </div>
              </div>
            </div>
          ))}

          {/* Total */}
          <div style={{
            padding: "14px 16px", background: "#FAFAF5", borderTop: "2px solid #E0DCD0",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: "#AAAAAA" }}>Subtotal</span>
              <span style={{ fontSize: 14, color: "#777" }}>{fmt(total)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#4A4A4A" }}>TOTAL</span>
              <span style={{ fontSize: 22, fontWeight: 800, color: "#C8981E" }}>{fmt(total)}</span>
            </div>
            <div style={{
              marginTop: 8, padding: "8px 10px", background: "#E8F5E9", borderRadius: 6,
              fontSize: 12, color: "#2E7D32", textAlign: "center", fontWeight: 600,
            }}>
              50% deposit of {fmt(deposit)} required to schedule
            </div>
          </div>
        </div>
      </div>

      {/* Project Notes */}
      {estimate.notes && (
        <div style={{ padding: "0 4px" }}>
          <div style={{
            background: "#fff", borderRadius: 12, border: "1px solid #E0DCD0",
            padding: 16, marginBottom: 12,
          }}>
            <div style={{
              fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
              fontSize: 15, fontWeight: 700, color: "#C8981E", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10,
            }}>
              Project Notes
            </div>
            <div style={{ fontSize: 14, color: "#777", lineHeight: 1.7 }}>{estimate.notes}</div>
          </div>
        </div>
      )}

      {/* Terms & Conditions */}
      <div style={{ padding: "0 4px" }}>
        <div style={{
          background: "#fff", borderRadius: 12, border: "1px solid #E0DCD0",
          overflow: "hidden", marginBottom: 16,
        }}>
          <button onClick={() => setTermsOpen(!termsOpen)} style={{
            width: "100%", padding: "14px 16px", background: "none", border: "none",
            display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer",
          }}>
            <span style={{
              fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
              fontSize: 15, fontWeight: 700, color: "#C8981E", textTransform: "uppercase", letterSpacing: 1.5,
            }}>
              Terms & Conditions
            </span>
            <Icon name={termsOpen ? "chevUp" : "chevDown"} size={16} color="#AAAAAA" />
          </button>
          {termsOpen && (
            <div style={{ padding: "0 16px 14px" }}>
              {DEFAULT_TERMS.map((t, i) => (
                <div key={i} style={{
                  fontSize: 13, color: "#777", lineHeight: 1.6,
                  padding: "6px 0", borderBottom: i < DEFAULT_TERMS.length - 1 ? "1px solid #F5F4F0" : "none",
                  display: "flex", gap: 8,
                }}>
                  <span style={{ color: "#AAAAAA", fontSize: 11, marginTop: 2 }}>{i + 1}.</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Accept/Decline actions */}
      {showActions && viewStatus !== "declining" && (
        <div style={{ padding: "0 4px 30px" }}>
          <label style={{
            display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 16,
            cursor: "pointer", padding: "12px 14px", background: termsAccepted ? "#E8F5E9" : "#fff",
            border: `1px solid ${termsAccepted ? "#A5D6A7" : "#E0DCD0"}`, borderRadius: 10,
            transition: "all 0.2s ease",
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 1,
              background: termsAccepted ? "#2E7D32" : "#fff",
              border: `2px solid ${termsAccepted ? "#2E7D32" : "#ccc"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s ease",
            }}>
              {termsAccepted && <Icon name="check" size={14} color="#fff" />}
            </div>
            <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)}
              style={{ display: "none" }} />
            <span style={{ fontSize: 13, color: "#777", lineHeight: 1.5 }}>
              I have read and agree to the terms & conditions listed above. I authorize {BUSINESS.name} to proceed with the described scope of work.
            </span>
          </label>

          {/* Signature Pad */}
          {termsAccepted && (
            <div style={{
              background: "#fff", borderRadius: 12, border: "1px solid #E0DCD0",
              padding: 16, marginBottom: 16,
              animation: "fadeInUp 0.3s ease both",
            }}>
              <div style={{
                fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
                fontSize: 15, fontWeight: 700, color: "#C8981E", textTransform: "uppercase",
                letterSpacing: 1.5, marginBottom: 12,
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <Icon name="pen" size={15} color="#C8981E" />
                Signature
              </div>
              <SignaturePad onChange={(hasSig) => setHasSignature(hasSig)} />
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setViewStatus("declining")} style={{
              flex: 1, padding: 14, background: "#fff", border: "1px solid #EF9A9A",
              borderRadius: 10, color: "#C62828", fontWeight: 700, cursor: "pointer", fontSize: 14,
            }}>
              Decline
            </button>
            <button onClick={() => termsAccepted && hasSignature && handleAccept()} disabled={!termsAccepted || !hasSignature} style={{
              flex: 2, padding: 14,
              background: termsAccepted && hasSignature ? "linear-gradient(135deg, #2E7D32 0%, #388E3C 100%)" : "#E0DCD0",
              border: "none", borderRadius: 10, color: termsAccepted && hasSignature ? "#fff" : "#AAAAAA",
              fontWeight: 700, cursor: termsAccepted && hasSignature ? "pointer" : "not-allowed",
              fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: termsAccepted && hasSignature ? "0 2px 12px rgba(46,125,50,0.3)" : "none",
            }}>
              <Icon name="check" size={16} color={termsAccepted && hasSignature ? "#fff" : "#AAAAAA"} /> Accept Estimate
            </button>
          </div>
        </div>
      )}

      {/* Decline Flow */}
      {viewStatus === "declining" && (
        <DeclineFlow
          onDecline={handleDecline}
          onCancel={() => setViewStatus(null)}
        />
      )}

      {/* Non-actionable status message */}
      {!showActions && !viewStatus && (
        <div style={{ padding: "0 4px 30px", textAlign: "center" }}>
          <div style={{
            padding: "12px 16px", background: "#fff", border: "1px solid #E0DCD0",
            borderRadius: 10, fontSize: 13, color: "#999",
          }}>
            {estimate.status === "draft" && "This estimate is still being prepared."}
            {estimate.status === "expired" && "This estimate has expired. Please contact us for an updated quote."}
            {estimate.status === "accepted" && "This estimate has been accepted."}
            {estimate.status === "declined" && "This estimate was declined."}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        textAlign: "center", padding: "20px 4px 30px", borderTop: "1px solid #E0DCD0",
        marginTop: 8,
      }}>
        <div style={{ fontSize: 12, color: "#AAAAAA", marginBottom: 4 }}>
          {BUSINESS.name} &middot; {BUSINESS.phone}
        </div>
        <div style={{ fontSize: 11, color: "#ccc" }}>
          {BUSINESS.email}
        </div>
      </div>
    </div>
  );
}
