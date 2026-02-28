import { useState, useRef, useEffect } from "react";

const MOCK_ESTIMATES = [
  {
    id: "EST-2026-001",
    customer: "Mike Thompson",
    address: "142 Oak Ridge Dr, Conway SC",
    phone: "(843) 555-0147",
    email: "mike.t@email.com",
    status: "draft",
    created: "2026-02-25",
    expires: "2026-03-27",
    items: [
      { id: 1, desc: "Remove existing driveway (approx 600 sqft)", qty: 600, unit: "sqft", rate: 3.5 },
      { id: 2, desc: "New 4\" concrete driveway w/ fiber mesh", qty: 600, unit: "sqft", rate: 12.0 },
      { id: 3, desc: "Broom finish", qty: 600, unit: "sqft", rate: 0.75 },
      { id: 4, desc: "Expansion joints", qty: 8, unit: "ea", rate: 45.0 },
    ],
    notes: "Customer wants driveway replaced before summer. Access from side yard. Existing driveway has significant cracking.",
    images: ["driveway_front.jpg", "crack_detail.jpg"],
  },
  {
    id: "EST-2026-002",
    customer: "Sarah Chen",
    address: "88 Magnolia Ct, Myrtle Beach SC",
    phone: "(843) 555-0293",
    email: "sarah.chen@email.com",
    status: "sent",
    created: "2026-02-20",
    expires: "2026-03-22",
    items: [
      { id: 1, desc: "Patio slab 16x20 - 4\" w/ rebar", qty: 320, unit: "sqft", rate: 14.0 },
      { id: 2, desc: "Stamped concrete finish (ashlar slate)", qty: 320, unit: "sqft", rate: 4.5 },
      { id: 3, desc: "Color hardener - sandstone", qty: 320, unit: "sqft", rate: 1.25 },
      { id: 4, desc: "Sealer (2 coats)", qty: 320, unit: "sqft", rate: 1.0 },
    ],
    notes: "Stamped patio off back door. Customer chose ashlar slate pattern with sandstone color. Need to coordinate with landscaper.",
    images: ["backyard_area.jpg"],
  },
  {
    id: "EST-2026-003",
    customer: "James Rodriguez",
    address: "310 Palmetto Way, Conway SC",
    phone: "(843) 555-0481",
    email: "j.rodriguez@email.com",
    status: "accepted",
    created: "2026-02-10",
    expires: "2026-03-12",
    items: [
      { id: 1, desc: "Sidewalk - 4' wide x 60' long, 4\"", qty: 240, unit: "sqft", rate: 11.0 },
      { id: 2, desc: "Broom finish", qty: 240, unit: "sqft", rate: 0.75 },
    ],
    notes: "Front walkway from driveway to porch. Straight run, minimal grading needed.",
    images: [],
  },
  {
    id: "EST-2026-004",
    customer: "Linda Park",
    address: "55 Cypress Bend, Surfside Beach SC",
    phone: "(843) 555-0612",
    email: "lindap@email.com",
    status: "expired",
    created: "2026-01-15",
    expires: "2026-02-14",
    items: [
      { id: 1, desc: "Garage floor overlay", qty: 440, unit: "sqft", rate: 8.0 },
      { id: 2, desc: "Epoxy coating (flake)", qty: 440, unit: "sqft", rate: 5.5 },
    ],
    notes: "Garage floor resurfacing with epoxy flake finish. Customer hasn't responded.",
    images: ["garage_floor.jpg"],
  },
  {
    id: "EST-2026-005",
    customer: "Tom & Angela Wright",
    address: "201 Live Oak Ln, Conway SC",
    phone: "(843) 555-0734",
    email: "wrights@email.com",
    status: "declined",
    created: "2026-02-01",
    expires: "2026-03-03",
    items: [
      { id: 1, desc: "Pool deck - 800 sqft, 4\" w/ rebar", qty: 800, unit: "sqft", rate: 15.0 },
      { id: 2, desc: "Cool deck coating", qty: 800, unit: "sqft", rate: 6.0 },
      { id: 3, desc: "Coping - bullnose edge", qty: 120, unit: "lnft", rate: 22.0 },
    ],
    notes: "Pool deck replacement. Declined - went with pavers instead.",
    images: ["pool_area.jpg", "existing_deck.jpg"],
  },
];

const STATUS_CONFIG = {
  draft: { label: "Draft", bg: "#2a2a2a", color: "#999", border: "#444" },
  sent: { label: "Sent", bg: "#1a2332", color: "#5b9bd5", border: "#2a4a6b" },
  accepted: { label: "Accepted", bg: "#1a2e1a", color: "#5bb55b", border: "#2a5a2a" },
  declined: { label: "Declined", bg: "#2e1a1a", color: "#d55b5b", border: "#5a2a2a" },
  expired: { label: "Expired", bg: "#2e2a1a", color: "#d5a55b", border: "#5a4a2a" },
};

const fmt = (n) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

function StatusBadge({ status }) {
  const c = STATUS_CONFIG[status];
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: 4, fontSize: 11,
      fontWeight: 700, textTransform: "uppercase", letterSpacing: 1,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
    }}>{c.label}</span>
  );
}

function Icon({ name, size = 20, color = "#888" }) {
  const paths = {
    plus: <path d="M12 5v14M5 12h14" />,
    back: <path d="M15 18l-6-6 6-6" />,
    search: <><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></>,
    camera: <><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></>,
    trash: <><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></>,
    send: <><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></>,
    edit: <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></>,
    note: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>,
    dollar: <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></>,
    check: <polyline points="20 6 9 17 4 12" />,
    x: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
    user: <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
    phone: <><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" /></>,
    mail: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>,
    clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
    home: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>,
    copy: <><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></>,
    list: <><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

// ---- Estimate List Screen ----
function EstimateList({ estimates, onSelect, onNew, filter, setFilter, search, setSearch }) {
  const filtered = estimates.filter(e => {
    if (filter !== "all" && e.status !== filter) return false;
    if (search && !e.customer.toLowerCase().includes(search.toLowerCase()) &&
        !e.id.toLowerCase().includes(search.toLowerCase()) &&
        !e.address.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = { all: estimates.length };
  estimates.forEach(e => { counts[e.status] = (counts[e.status] || 0) + 1; });

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f0f", color: "#e0e0e0" }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        padding: "20px 16px 16px", borderBottom: "1px solid #2a2a3a",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#5b7bb5", textTransform: "uppercase", marginBottom: 2 }}>
              Solid Ground Concrete
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>Estimates</div>
          </div>
          <button onClick={onNew} style={{
            background: "#3b82f6", border: "none", borderRadius: 10, width: 42, height: 42,
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            boxShadow: "0 2px 12px rgba(59,130,246,0.4)",
          }}>
            <Icon name="plus" color="#fff" size={22} />
          </button>
        </div>

        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", background: "#0d0d1a", borderRadius: 10,
          padding: "0 12px", border: "1px solid #2a2a3a", marginBottom: 12,
        }}>
          <Icon name="search" size={16} color="#555" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search estimates..."
            style={{
              flex: 1, background: "none", border: "none", color: "#ccc", padding: "10px 8px",
              fontSize: 14, outline: "none",
            }}
          />
        </div>

        {/* Filter pills */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
          {[
            { key: "all", label: "All" },
            { key: "draft", label: "Drafts" },
            { key: "sent", label: "Sent" },
            { key: "accepted", label: "Accepted" },
            { key: "declined", label: "Declined" },
            { key: "expired", label: "Expired" },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: "5px 12px", borderRadius: 20, border: "1px solid",
              borderColor: filter === f.key ? "#3b82f6" : "#333",
              background: filter === f.key ? "rgba(59,130,246,0.15)" : "transparent",
              color: filter === f.key ? "#6ba3f7" : "#777",
              fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
            }}>
              {f.label} {counts[f.key] > 0 && <span style={{ opacity: 0.6, marginLeft: 2 }}>({counts[f.key] || 0})</span>}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div style={{ padding: "8px 12px" }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: "#555" }}>No estimates found</div>
        )}
        {filtered.map(est => {
          const total = est.items.reduce((s, i) => s + i.qty * i.rate, 0);
          return (
            <button key={est.id} onClick={() => onSelect(est)} style={{
              display: "block", width: "100%", textAlign: "left", background: "#161622",
              border: "1px solid #222233", borderRadius: 12, padding: "14px 14px",
              marginBottom: 8, cursor: "pointer", transition: "border-color 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#3b82f6"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#222233"}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#e8e8e8" }}>{est.customer}</div>
                  <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{est.id}</div>
                </div>
                <StatusBadge status={est.status} />
              </div>
              <div style={{ fontSize: 12, color: "#777", marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
                <Icon name="home" size={12} color="#555" /> {est.address}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#5bb55b" }}>{fmt(total)}</div>
                <div style={{ fontSize: 11, color: "#555" }}>
                  Exp. {new Date(est.expires).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---- Estimate Detail / Editor ----
function EstimateDetail({ estimate, onBack, onUpdate }) {
  const [est, setEst] = useState(JSON.parse(JSON.stringify(estimate)));
  const [activeTab, setActiveTab] = useState("items");
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState({ desc: "", qty: "", unit: "sqft", rate: "" });
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const total = est.items.reduce((s, i) => s + i.qty * i.rate, 0);

  const removeItem = (id) => {
    setEst(prev => ({ ...prev, items: prev.items.filter(i => i.id !== id) }));
  };

  const addItem = () => {
    if (!newItem.desc || !newItem.qty || !newItem.rate) return;
    const item = {
      id: Date.now(), desc: newItem.desc,
      qty: parseFloat(newItem.qty), unit: newItem.unit, rate: parseFloat(newItem.rate),
    };
    setEst(prev => ({ ...prev, items: [...prev.items, item] }));
    setNewItem({ desc: "", qty: "", unit: "sqft", rate: "" });
    setShowAddItem(false);
  };

  const setStatus = (status) => {
    setEst(prev => ({ ...prev, status }));
    showToast(`Status updated to ${STATUS_CONFIG[status].label}`);
  };

  const inputStyle = {
    width: "100%", background: "#0d0d1a", border: "1px solid #2a2a3a", borderRadius: 8,
    color: "#ddd", padding: "10px 12px", fontSize: 14, outline: "none", boxSizing: "border-box",
  };

  const labelStyle = { fontSize: 11, fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, display: "block" };

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f0f", color: "#e0e0e0", paddingBottom: 100 }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 100,
          background: "#1a2e1a", border: "1px solid #2a5a2a", color: "#5bb55b",
          padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600,
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)", animation: "fadeIn 0.2s ease",
        }}>{toast}</div>
      )}

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        padding: "14px 16px 14px", borderBottom: "1px solid #2a2a3a",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <Icon name="back" color="#6ba3f7" />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{est.customer}</div>
            <div style={{ fontSize: 11, color: "#666" }}>{est.id}</div>
          </div>
          <StatusBadge status={est.status} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#5bb55b" }}>{fmt(total)}</div>
          <div style={{ fontSize: 11, color: "#555", display: "flex", alignItems: "center", gap: 4 }}>
            <Icon name="clock" size={12} color="#555" />
            Expires {new Date(est.expires).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #222", background: "#111118" }}>
        {[
          { key: "items", label: "Line Items", icon: "list" },
          { key: "details", label: "Details", icon: "user" },
          { key: "photos", label: "Photos", icon: "image" },
          { key: "notes", label: "Notes", icon: "note" },
        ].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
            flex: 1, padding: "10px 0", background: "none", border: "none",
            borderBottom: activeTab === t.key ? "2px solid #3b82f6" : "2px solid transparent",
            color: activeTab === t.key ? "#6ba3f7" : "#555",
            fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex",
            flexDirection: "column", alignItems: "center", gap: 3,
          }}>
            <Icon name={t.icon} size={16} color={activeTab === t.key ? "#6ba3f7" : "#555"} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ padding: "12px 14px" }}>

        {/* Line Items Tab */}
        {activeTab === "items" && (
          <div>
            {est.items.map(item => (
              <div key={item.id} style={{
                background: "#161622", border: "1px solid #222233", borderRadius: 10,
                padding: "12px 14px", marginBottom: 8,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1, paddingRight: 8 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#ddd", marginBottom: 4 }}>{item.desc}</div>
                    <div style={{ fontSize: 12, color: "#777" }}>
                      {item.qty} {item.unit} × {fmt(item.rate)}/{item.unit}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#e0e0e0" }}>{fmt(item.qty * item.rate)}</div>
                    <button onClick={() => removeItem(item.id)} style={{
                      background: "none", border: "none", cursor: "pointer", marginTop: 4, padding: 2,
                    }}>
                      <Icon name="trash" size={14} color="#d55b5b" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Total */}
            <div style={{
              background: "#1a2e1a", border: "1px solid #2a5a2a", borderRadius: 10,
              padding: "12px 14px", marginBottom: 12,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#5bb55b" }}>TOTAL</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#5bb55b" }}>{fmt(total)}</span>
            </div>

            {/* Add Item */}
            {!showAddItem ? (
              <button onClick={() => setShowAddItem(true)} style={{
                width: "100%", padding: 12, background: "none", border: "2px dashed #2a2a3a",
                borderRadius: 10, color: "#5b7bb5", fontSize: 13, fontWeight: 600,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}>
                <Icon name="plus" size={16} color="#5b7bb5" /> Add Line Item
              </button>
            ) : (
              <div style={{
                background: "#161622", border: "1px solid #3b82f6", borderRadius: 12,
                padding: 14,
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#6ba3f7", marginBottom: 12 }}>New Line Item</div>
                <div style={{ marginBottom: 10 }}>
                  <label style={labelStyle}>Description</label>
                  <input value={newItem.desc} onChange={e => setNewItem(p => ({ ...p, desc: e.target.value }))}
                    placeholder='e.g. "4" concrete slab w/ rebar"' style={inputStyle} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
                  <div>
                    <label style={labelStyle}>Quantity</label>
                    <input type="number" value={newItem.qty} onChange={e => setNewItem(p => ({ ...p, qty: e.target.value }))}
                      placeholder="0" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Unit</label>
                    <select value={newItem.unit} onChange={e => setNewItem(p => ({ ...p, unit: e.target.value }))}
                      style={{ ...inputStyle, appearance: "auto" }}>
                      <option value="sqft">sqft</option>
                      <option value="lnft">lnft</option>
                      <option value="cuyd">cu yd</option>
                      <option value="ea">each</option>
                      <option value="hr">hour</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Rate ($)</label>
                    <input type="number" value={newItem.rate} onChange={e => setNewItem(p => ({ ...p, rate: e.target.value }))}
                      placeholder="0.00" style={inputStyle} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setShowAddItem(false)} style={{
                    flex: 1, padding: 10, background: "#222", border: "1px solid #333",
                    borderRadius: 8, color: "#999", fontWeight: 600, cursor: "pointer", fontSize: 13,
                  }}>Cancel</button>
                  <button onClick={addItem} style={{
                    flex: 1, padding: 10, background: "#3b82f6", border: "none",
                    borderRadius: 8, color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 13,
                  }}>Add Item</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Details Tab */}
        {activeTab === "details" && (
          <div>
            <div style={{
              background: "#161622", border: "1px solid #222233", borderRadius: 12, padding: 14, marginBottom: 10,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#6ba3f7", marginBottom: 14 }}>Customer Information</div>
              {[
                { icon: "user", label: "Name", value: est.customer },
                { icon: "home", label: "Address", value: est.address },
                { icon: "phone", label: "Phone", value: est.phone },
                { icon: "mail", label: "Email", value: est.email },
              ].map(f => (
                <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 8, background: "#1a1a2e",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon name={f.icon} size={16} color="#5b7bb5" />
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{f.label}</div>
                    <div style={{ fontSize: 14, color: "#ccc" }}>{f.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              background: "#161622", border: "1px solid #222233", borderRadius: 12, padding: 14, marginBottom: 10,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#6ba3f7", marginBottom: 14 }}>Estimate Info</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <div style={labelStyle}>Created</div>
                  <div style={{ fontSize: 14, color: "#ccc" }}>{new Date(est.created).toLocaleDateString()}</div>
                </div>
                <div>
                  <div style={labelStyle}>Expires</div>
                  <div style={{ fontSize: 14, color: "#ccc" }}>{new Date(est.expires).toLocaleDateString()}</div>
                </div>
                <div>
                  <div style={labelStyle}>Line Items</div>
                  <div style={{ fontSize: 14, color: "#ccc" }}>{est.items.length}</div>
                </div>
                <div>
                  <div style={labelStyle}>Total</div>
                  <div style={{ fontSize: 14, color: "#5bb55b", fontWeight: 700 }}>{fmt(total)}</div>
                </div>
              </div>
            </div>

            {/* Status Actions */}
            <div style={{
              background: "#161622", border: "1px solid #222233", borderRadius: 12, padding: 14,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#6ba3f7", marginBottom: 14 }}>Actions</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {est.status === "draft" && (
                  <button onClick={() => { setStatus("sent"); showToast("Estimate sent to customer!"); }}
                    style={{
                      padding: 12, background: "#1a2332", border: "1px solid #2a4a6b", borderRadius: 10,
                      color: "#5b9bd5", fontWeight: 700, cursor: "pointer", fontSize: 13,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    }}>
                    <Icon name="send" size={16} color="#5b9bd5" /> Send to Customer
                  </button>
                )}
                {est.status === "sent" && (
                  <>
                    <button onClick={() => { setStatus("sent"); showToast("Reminder sent!"); }}
                      style={{
                        padding: 12, background: "#1a2332", border: "1px solid #2a4a6b", borderRadius: 10,
                        color: "#5b9bd5", fontWeight: 700, cursor: "pointer", fontSize: 13,
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      }}>
                      <Icon name="send" size={16} color="#5b9bd5" /> Send Reminder
                    </button>
                  </>
                )}
                <button onClick={() => { showToast("Estimate duplicated!"); }}
                  style={{
                    padding: 12, background: "#1a1a22", border: "1px solid #333",
                    borderRadius: 10, color: "#999", fontWeight: 600, cursor: "pointer", fontSize: 13,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}>
                  <Icon name="copy" size={16} color="#777" /> Duplicate Estimate
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Photos Tab */}
        {activeTab === "photos" && (
          <div>
            {est.images.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                {est.images.map((img, i) => (
                  <div key={i} style={{
                    background: "#1a1a2e", border: "1px solid #222233", borderRadius: 10,
                    height: 140, display: "flex", flexDirection: "column", alignItems: "center",
                    justifyContent: "center", position: "relative", overflow: "hidden",
                  }}>
                    <Icon name="image" size={32} color="#333" />
                    <div style={{ fontSize: 11, color: "#555", marginTop: 6 }}>{img}</div>
                    <button onClick={() => {
                      setEst(prev => ({ ...prev, images: prev.images.filter((_, j) => j !== i) }));
                    }} style={{
                      position: "absolute", top: 6, right: 6, background: "rgba(200,50,50,0.3)",
                      border: "none", borderRadius: 6, width: 24, height: 24, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon name="x" size={12} color="#d55b5b" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => {
              const name = `photo_${Date.now().toString(36)}.jpg`;
              setEst(prev => ({ ...prev, images: [...prev.images, name] }));
              showToast("Photo added!");
            }} style={{
              width: "100%", padding: 16, background: "none", border: "2px dashed #2a2a3a",
              borderRadius: 12, color: "#5b7bb5", fontSize: 13, fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              flexDirection: "column", gap: 8,
            }}>
              <Icon name="camera" size={28} color="#5b7bb5" />
              <span>Take Photo or Upload</span>
            </button>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === "notes" && (
          <div>
            <textarea
              value={est.notes}
              onChange={e => setEst(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add notes about this project..."
              style={{
                ...inputStyle, minHeight: 200, resize: "vertical", lineHeight: 1.6,
                fontFamily: "inherit",
              }}
            />
            <div style={{ fontSize: 11, color: "#555", marginTop: 6, textAlign: "right" }}>
              {est.notes.length} characters
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- New Estimate Screen ----
function NewEstimate({ onBack, onSave }) {
  const [customer, setCustomer] = useState({ name: "", address: "", phone: "", email: "" });
  const [expDays, setExpDays] = useState(30);

  const inputStyle = {
    width: "100%", background: "#0d0d1a", border: "1px solid #2a2a3a", borderRadius: 8,
    color: "#ddd", padding: "10px 12px", fontSize: 14, outline: "none", boxSizing: "border-box",
  };
  const labelStyle = { fontSize: 11, fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, display: "block" };

  const handleSave = () => {
    if (!customer.name) return;
    const now = new Date();
    const exp = new Date(now);
    exp.setDate(exp.getDate() + expDays);
    onSave({
      id: `EST-2026-${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}`,
      customer: customer.name, address: customer.address, phone: customer.phone, email: customer.email,
      status: "draft",
      created: now.toISOString().split("T")[0],
      expires: exp.toISOString().split("T")[0],
      items: [], notes: "", images: [],
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f0f", color: "#e0e0e0" }}>
      <div style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        padding: "14px 16px", borderBottom: "1px solid #2a2a3a",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <Icon name="back" color="#6ba3f7" />
        </button>
        <span style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>New Estimate</span>
      </div>

      <div style={{ padding: "16px 14px" }}>
        <div style={{
          background: "#161622", border: "1px solid #222233", borderRadius: 12, padding: 14, marginBottom: 12,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#6ba3f7", marginBottom: 14 }}>Customer Information</div>
          {[
            { key: "name", label: "Customer Name", placeholder: "John Smith", icon: "user" },
            { key: "address", label: "Job Site Address", placeholder: "123 Main St, Conway SC", icon: "home" },
            { key: "phone", label: "Phone", placeholder: "(843) 555-0000", icon: "phone" },
            { key: "email", label: "Email", placeholder: "john@email.com", icon: "mail" },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 12 }}>
              <label style={labelStyle}>{f.label}</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8, background: "#1a1a2e",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Icon name={f.icon} size={16} color="#5b7bb5" />
                </div>
                <input value={customer[f.key]}
                  onChange={e => setCustomer(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder} style={inputStyle} />
              </div>
            </div>
          ))}
        </div>

        <div style={{
          background: "#161622", border: "1px solid #222233", borderRadius: 12, padding: 14, marginBottom: 16,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#6ba3f7", marginBottom: 14 }}>Estimate Settings</div>
          <label style={labelStyle}>Expiration (days from today)</label>
          <div style={{ display: "flex", gap: 8 }}>
            {[15, 30, 45, 60].map(d => (
              <button key={d} onClick={() => setExpDays(d)} style={{
                flex: 1, padding: "10px 0", borderRadius: 8, cursor: "pointer",
                background: expDays === d ? "rgba(59,130,246,0.15)" : "#0d0d1a",
                border: `1px solid ${expDays === d ? "#3b82f6" : "#2a2a3a"}`,
                color: expDays === d ? "#6ba3f7" : "#777", fontWeight: 700, fontSize: 13,
              }}>
                {d}d
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleSave} disabled={!customer.name} style={{
          width: "100%", padding: 14, background: customer.name ? "#3b82f6" : "#222",
          border: "none", borderRadius: 10, color: customer.name ? "#fff" : "#555",
          fontWeight: 700, fontSize: 15, cursor: customer.name ? "pointer" : "not-allowed",
          boxShadow: customer.name ? "0 2px 12px rgba(59,130,246,0.3)" : "none",
        }}>
          Create Estimate
        </button>
      </div>
    </div>
  );
}


// ---- Main App ----
export default function ConcreteEstimatorApp() {
  const [screen, setScreen] = useState("list"); // list | detail | new
  const [estimates, setEstimates] = useState(MOCK_ESTIMATES);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  return (
    <div style={{
      maxWidth: 420, margin: "0 auto", fontFamily: "'Segoe UI', -apple-system, sans-serif",
      minHeight: "100vh", background: "#0f0f0f", position: "relative",
      boxShadow: "0 0 60px rgba(0,0,0,0.5)",
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px) translateX(-50%); } to { opacity: 1; transform: translateY(0) translateX(-50%); } }
        * { box-sizing: border-box; }
        input:focus, textarea:focus, select:focus { border-color: #3b82f6 !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
      `}</style>

      {screen === "list" && (
        <EstimateList
          estimates={estimates}
          onSelect={est => { setSelected(est); setScreen("detail"); }}
          onNew={() => setScreen("new")}
          filter={filter} setFilter={setFilter}
          search={search} setSearch={setSearch}
        />
      )}

      {screen === "detail" && selected && (
        <EstimateDetail
          estimate={selected}
          onBack={() => setScreen("list")}
          onUpdate={(updated) => {
            setEstimates(prev => prev.map(e => e.id === updated.id ? updated : e));
            setSelected(updated);
          }}
        />
      )}

      {screen === "new" && (
        <NewEstimate
          onBack={() => setScreen("list")}
          onSave={(est) => {
            setEstimates(prev => [est, ...prev]);
            setSelected(est);
            setScreen("detail");
          }}
        />
      )}
    </div>
  );
}
