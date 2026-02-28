import { useState, useRef, useEffect, useCallback } from "react";

const ESTIMATE = {
  id: "EST-2026-002",
  businessName: "Solid Ground Concrete",
  businessPhone: "(843) 555-1200",
  businessEmail: "info@solidgroundconcrete.com",
  businessTagline: "Residential Concrete Specialists — Conway, SC",
  customerName: "Sarah Chen",
  address: "88 Magnolia Ct, Myrtle Beach SC 29572",
  phone: "(843) 555-0293",
  email: "sarah.chen@email.com",
  created: "2026-02-20",
  expires: "2026-03-22",
  items: [
    { id: 1, desc: "Patio slab 16×20 — 4\" reinforced with rebar", qty: 320, unit: "sqft", rate: 14.0 },
    { id: 2, desc: "Stamped concrete finish (ashlar slate pattern)", qty: 320, unit: "sqft", rate: 4.5 },
    { id: 3, desc: "Color hardener — sandstone", qty: 320, unit: "sqft", rate: 1.25 },
    { id: 4, desc: "Sealer application (2 coats)", qty: 320, unit: "sqft", rate: 1.0 },
  ],
  notes: "Stamped patio installation off back door. Ashlar slate pattern with sandstone color selected. Work area accessible from side gate. Estimated completion: 2–3 days weather permitting. All materials and labor included. Site cleanup included upon completion.",
  terms: [
    "This estimate is valid for 30 days from the date issued.",
    "A 50% deposit is required to schedule the project.",
    "Remaining balance is due upon completion of work.",
    "Price includes all materials, labor, and standard cleanup.",
    "Any changes to scope after acceptance may result in additional charges.",
    "Solid Ground Concrete is fully licensed and insured.",
    "Work is guaranteed for 2 years against structural defects.",
    "Customer is responsible for obtaining any required permits.",
  ],
};

const fmt = (n) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

function Icon({ name, size = 20, color = "#888" }) {
  const paths = {
    check: <polyline points="20 6 9 17 4 12" />,
    x: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
    phone: <><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" /></>,
    mail: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>,
    clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></>,
    file: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></>,
    pen: <><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></>,
    download: <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>,
    chevDown: <polyline points="6 9 12 15 18 9" />,
    chevUp: <polyline points="18 15 12 9 6 15" />,
    home: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>,
    user: <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

// ---- Signature Pad ----
function SignaturePad({ onSave, onCancel }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.strokeStyle = "#1a3a5c";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return { x: t.clientX - rect.left, y: t.clientY - rect.top };
  };

  const startDraw = useCallback((e) => {
    e.preventDefault();
    const pos = getPos(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
    setHasDrawn(true);
  }, []);

  const draw = useCallback((e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPos(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }, [isDrawing]);

  const endDraw = useCallback(() => setIsDrawing(false), []);

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    setHasDrawn(false);
  };

  return (
    <div style={{ padding: "0 16px 16px" }}>
      <div style={{
        background: "#fafaf8", borderRadius: 12, border: "2px solid #d0cfc8",
        overflow: "hidden", marginBottom: 12,
      }}>
        <div style={{
          fontSize: 10, color: "#999", textTransform: "uppercase", letterSpacing: 1.5,
          fontWeight: 700, padding: "8px 12px", borderBottom: "1px dashed #ddd",
        }}>
          Sign below
        </div>
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: 160, cursor: "crosshair", touchAction: "none", display: "block" }}
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
          onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
        />
        <div style={{
          height: 1, background: "#bbb", margin: "0 20px",
          position: "relative", top: -30,
        }} />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <button onClick={clear} style={{
          flex: 1, padding: 10, background: "#f5f5f0", border: "1px solid #ddd",
          borderRadius: 8, color: "#777", fontWeight: 600, cursor: "pointer", fontSize: 13,
        }}>Clear</button>
        <button onClick={onCancel} style={{
          flex: 1, padding: 10, background: "#f5f5f0", border: "1px solid #ddd",
          borderRadius: 8, color: "#777", fontWeight: 600, cursor: "pointer", fontSize: 13,
        }}>Cancel</button>
        <button onClick={() => hasDrawn && onSave()} disabled={!hasDrawn} style={{
          flex: 2, padding: 10,
          background: hasDrawn ? "#1a5c3a" : "#ccc",
          border: "none", borderRadius: 8, color: "#fff", fontWeight: 700,
          cursor: hasDrawn ? "pointer" : "not-allowed", fontSize: 13,
        }}>Accept & Sign</button>
      </div>
    </div>
  );
}

// ---- Decline Flow ----
function DeclineFlow({ onDecline, onCancel }) {
  const [reason, setReason] = useState("");
  const reasons = ["Price too high", "Went with another company", "Project postponed", "Changed scope", "Other"];
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ padding: "0 16px 16px" }}>
      <div style={{
        background: "#fff8f8", border: "1px solid #e8d0d0", borderRadius: 12, padding: 16, marginBottom: 12,
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#8a3a3a", marginBottom: 12 }}>
          We're sorry to hear that. Would you let us know why?
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
          {reasons.map(r => (
            <button key={r} onClick={() => setSelected(r)} style={{
              padding: "10px 12px", borderRadius: 8, textAlign: "left",
              background: selected === r ? "#fce8e8" : "#fff",
              border: `1px solid ${selected === r ? "#d88" : "#e0d0d0"}`,
              color: selected === r ? "#8a3a3a" : "#666", fontWeight: selected === r ? 600 : 400,
              fontSize: 13, cursor: "pointer",
            }}>{r}</button>
          ))}
        </div>
        {selected === "Other" && (
          <textarea value={reason} onChange={e => setReason(e.target.value)}
            placeholder="Please tell us more..."
            style={{
              width: "100%", padding: 10, border: "1px solid #e0d0d0", borderRadius: 8,
              fontSize: 13, minHeight: 80, resize: "vertical", outline: "none",
              fontFamily: "inherit", boxSizing: "border-box",
            }} />
        )}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onCancel} style={{
          flex: 1, padding: 12, background: "#f5f5f0", border: "1px solid #ddd",
          borderRadius: 8, color: "#777", fontWeight: 600, cursor: "pointer", fontSize: 13,
        }}>Go Back</button>
        <button onClick={() => onDecline(selected || reason)} disabled={!selected} style={{
          flex: 1, padding: 12,
          background: selected ? "#c44" : "#ccc",
          border: "none", borderRadius: 8, color: "#fff",
          fontWeight: 700, cursor: selected ? "pointer" : "not-allowed", fontSize: 13,
        }}>Decline Estimate</button>
      </div>
    </div>
  );
}


// ---- Main Customer View ----
export default function CustomerEstimateView() {
  const [status, setStatus] = useState("pending"); // pending | signing | declining | accepted | declined
  const [termsOpen, setTermsOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const est = ESTIMATE;
  const total = est.items.reduce((s, i) => s + i.qty * i.rate, 0);
  const deposit = total * 0.5;
  const daysLeft = Math.max(0, Math.ceil((new Date(est.expires) - new Date()) / 86400000));

  if (status === "accepted") {
    return (
      <div style={{
        maxWidth: 480, margin: "0 auto", fontFamily: "'Georgia', 'Times New Roman', serif",
        minHeight: "100vh", background: "#f5f4f0",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: 30, textAlign: "center",
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%", background: "#e8f5e8",
          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20,
          border: "3px solid #5bb55b",
        }}>
          <Icon name="check" size={40} color="#3a8a3a" />
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, color: "#1a3a1a", marginBottom: 8, fontFamily: "'Georgia', serif" }}>
          Estimate Accepted!
        </div>
        <div style={{ fontSize: 15, color: "#666", lineHeight: 1.6, marginBottom: 24, maxWidth: 340 }}>
          Thank you, {est.customerName.split(" ")[0]}! Your signed estimate for {fmt(total)} has been submitted. We'll be in touch within 24 hours to schedule your project.
        </div>
        <div style={{
          background: "#fff", border: "1px solid #ddd", borderRadius: 12, padding: 20,
          width: "100%", maxWidth: 340,
        }}>
          <div style={{ fontSize: 12, color: "#999", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
            Next Steps
          </div>
          <div style={{ fontSize: 14, color: "#555", lineHeight: 1.7, textAlign: "left" }}>
            <div style={{ marginBottom: 8 }}>✓ Confirmation email sent to {est.email}</div>
            <div style={{ marginBottom: 8 }}>✓ Deposit invoice of {fmt(deposit)} will follow</div>
            <div>✓ We'll call to confirm your schedule</div>
          </div>
        </div>
        <div style={{ marginTop: 24, fontSize: 13, color: "#888" }}>
          Questions? Call us at {est.businessPhone}
        </div>
      </div>
    );
  }

  if (status === "declined") {
    return (
      <div style={{
        maxWidth: 480, margin: "0 auto", fontFamily: "'Georgia', 'Times New Roman', serif",
        minHeight: "100vh", background: "#f5f4f0",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: 30, textAlign: "center",
      }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#555", marginBottom: 8 }}>
          Estimate Declined
        </div>
        <div style={{ fontSize: 15, color: "#888", lineHeight: 1.6, marginBottom: 24, maxWidth: 340 }}>
          We understand, {est.customerName.split(" ")[0]}. If anything changes or you'd like to discuss adjustments, we're always here to help.
        </div>
        <div style={{ fontSize: 14, color: "#666" }}>
          {est.businessPhone} · {est.businessEmail}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: 480, margin: "0 auto", fontFamily: "'Georgia', 'Times New Roman', serif",
      minHeight: "100vh", background: "#f5f4f0",
    }}>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
      `}</style>

      {/* Company Header */}
      <div style={{
        background: "linear-gradient(135deg, #1a3a5c 0%, #0d2137 100%)",
        padding: "28px 20px 24px", textAlign: "center",
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 12, background: "rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 12px", border: "1px solid rgba(255,255,255,0.15)",
          fontSize: 24, fontWeight: 800, color: "#fff",
        }}>
          SG
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: 0.5, marginBottom: 4 }}>
          {est.businessName}
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", letterSpacing: 0.5 }}>
          {est.businessTagline}
        </div>
      </div>

      {/* Estimate Info Bar */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #e8e6e0",
        padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: 11, color: "#999", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Estimate</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#333", fontFamily: "monospace" }}>{est.id}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: 1,
            color: daysLeft < 7 ? "#c44" : "#888",
            textTransform: "uppercase",
            animation: daysLeft < 7 ? "pulse 2s ease-in-out infinite" : "none",
          }}>
            {daysLeft} days remaining
          </div>
          <div style={{ fontSize: 12, color: "#aaa" }}>Valid until {new Date(est.expires).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
        </div>
      </div>

      {/* Customer & Job Info */}
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{
          background: "#fff", borderRadius: 12, border: "1px solid #e8e6e0",
          padding: 16, marginBottom: 12,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#1a3a5c", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>
            Prepared For
          </div>
          {[
            { icon: "user", value: est.customerName },
            { icon: "home", value: est.address },
            { icon: "phone", value: est.phone },
            { icon: "mail", value: est.email },
          ].map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < 3 ? 10 : 0 }}>
              <Icon name={f.icon} size={15} color="#8aa" />
              <span style={{ fontSize: 14, color: "#444" }}>{f.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Line Items */}
      <div style={{ padding: "0 20px" }}>
        <div style={{
          background: "#fff", borderRadius: 12, border: "1px solid #e8e6e0",
          overflow: "hidden", marginBottom: 12,
        }}>
          <div style={{
            padding: "12px 16px", borderBottom: "1px solid #e8e6e0",
            fontSize: 11, fontWeight: 700, color: "#1a3a5c", textTransform: "uppercase", letterSpacing: 1.5,
          }}>
            Scope of Work
          </div>
          {est.items.map((item, i) => (
            <div key={item.id} style={{
              padding: "14px 16px",
              borderBottom: i < est.items.length - 1 ? "1px solid #f0efe8" : "none",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1, paddingRight: 12 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#333", marginBottom: 3 }}>{item.desc}</div>
                  <div style={{ fontSize: 12, color: "#999" }}>
                    {item.qty} {item.unit} × {fmt(item.rate)}/{item.unit}
                  </div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#333", whiteSpace: "nowrap" }}>
                  {fmt(item.qty * item.rate)}
                </div>
              </div>
            </div>
          ))}

          {/* Total */}
          <div style={{
            padding: "14px 16px", background: "#fafaf5", borderTop: "2px solid #e0ddd5",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: "#888" }}>Subtotal</span>
              <span style={{ fontSize: 14, color: "#555" }}>{fmt(total)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#1a3a5c" }}>TOTAL</span>
              <span style={{ fontSize: 22, fontWeight: 800, color: "#1a5c3a" }}>{fmt(total)}</span>
            </div>
            <div style={{
              marginTop: 8, padding: "8px 10px", background: "#e8f0e8", borderRadius: 6,
              fontSize: 12, color: "#3a6a3a", textAlign: "center", fontWeight: 600,
            }}>
              50% deposit of {fmt(deposit)} required to schedule
            </div>
          </div>
        </div>
      </div>

      {/* Project Notes */}
      {est.notes && (
        <div style={{ padding: "0 20px" }}>
          <div style={{
            background: "#fff", borderRadius: 12, border: "1px solid #e8e6e0",
            padding: 16, marginBottom: 12,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#1a3a5c", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>
              Project Notes
            </div>
            <div style={{ fontSize: 14, color: "#555", lineHeight: 1.7 }}>{est.notes}</div>
          </div>
        </div>
      )}

      {/* Terms & Conditions */}
      <div style={{ padding: "0 20px" }}>
        <div style={{
          background: "#fff", borderRadius: 12, border: "1px solid #e8e6e0",
          overflow: "hidden", marginBottom: 16,
        }}>
          <button onClick={() => setTermsOpen(!termsOpen)} style={{
            width: "100%", padding: "14px 16px", background: "none", border: "none",
            display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer",
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#1a3a5c", textTransform: "uppercase", letterSpacing: 1.5 }}>
              Terms & Conditions
            </span>
            <Icon name={termsOpen ? "chevUp" : "chevDown"} size={16} color="#999" />
          </button>
          {termsOpen && (
            <div style={{ padding: "0 16px 14px" }}>
              {est.terms.map((t, i) => (
                <div key={i} style={{
                  fontSize: 13, color: "#666", lineHeight: 1.6,
                  padding: "6px 0", borderBottom: i < est.terms.length - 1 ? "1px solid #f5f4f0" : "none",
                  display: "flex", gap: 8,
                }}>
                  <span style={{ color: "#bbb", fontSize: 11, marginTop: 2 }}>{i + 1}.</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Terms Acceptance + Action Buttons */}
      {status === "pending" && (
        <div style={{ padding: "0 20px 30px" }}>
          {/* Terms checkbox */}
          <label style={{
            display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 16,
            cursor: "pointer", padding: "12px 14px", background: termsAccepted ? "#e8f5e8" : "#fff",
            border: `1px solid ${termsAccepted ? "#a5d6a5" : "#e8e6e0"}`, borderRadius: 10,
            transition: "all 0.2s ease",
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 1,
              background: termsAccepted ? "#1a5c3a" : "#fff",
              border: `2px solid ${termsAccepted ? "#1a5c3a" : "#ccc"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s ease",
            }}>
              {termsAccepted && <Icon name="check" size={14} color="#fff" />}
            </div>
            <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)}
              style={{ display: "none" }} />
            <span style={{ fontSize: 13, color: "#555", lineHeight: 1.5 }}>
              I have read and agree to the terms & conditions listed above. I authorize Solid Ground Concrete to proceed with the described scope of work.
            </span>
          </label>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setStatus("declining")} style={{
              flex: 1, padding: 14, background: "#fff", border: "1px solid #dcc",
              borderRadius: 10, color: "#a55", fontWeight: 700, cursor: "pointer", fontSize: 14,
            }}>
              Decline
            </button>
            <button onClick={() => termsAccepted && setStatus("signing")} disabled={!termsAccepted} style={{
              flex: 2, padding: 14,
              background: termsAccepted ? "linear-gradient(135deg, #1a5c3a 0%, #2a7a4a 100%)" : "#ccc",
              border: "none", borderRadius: 10, color: "#fff",
              fontWeight: 700, cursor: termsAccepted ? "pointer" : "not-allowed",
              fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: termsAccepted ? "0 2px 12px rgba(26,92,58,0.3)" : "none",
            }}>
              <Icon name="pen" size={16} color="#fff" /> Accept & Sign
            </button>
          </div>
        </div>
      )}

      {/* Signature Pad */}
      {status === "signing" && (
        <SignaturePad
          onSave={() => setStatus("accepted")}
          onCancel={() => setStatus("pending")}
        />
      )}

      {/* Decline Flow */}
      {status === "declining" && (
        <DeclineFlow
          onDecline={() => setStatus("declined")}
          onCancel={() => setStatus("pending")}
        />
      )}

      {/* Footer */}
      <div style={{
        textAlign: "center", padding: "20px 20px 30px", borderTop: "1px solid #e8e6e0",
        marginTop: 8,
      }}>
        <div style={{ fontSize: 12, color: "#aaa", marginBottom: 4 }}>
          {est.businessName} · {est.businessPhone}
        </div>
        <div style={{ fontSize: 11, color: "#ccc" }}>
          {est.businessEmail}
        </div>
      </div>
    </div>
  );
}
