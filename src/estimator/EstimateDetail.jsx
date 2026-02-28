import { useState } from "react";
import Icon from "../shared/Icon";
import StatusBadge from "../shared/StatusBadge";
import Toast from "../shared/Toast";
import { STATUS_CONFIG, LINE_ITEM_PRESETS } from "../data";
import { fmt, estimateTotal } from "../shared/helpers";

const inputStyle = {
  width: "100%", background: "#fff", border: "1px solid #E0DCD0", borderRadius: 8,
  color: "#4A4A4A", padding: "10px 12px", fontSize: 14, outline: "none", boxSizing: "border-box",
};

const labelStyle = {
  fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase",
  letterSpacing: 1, marginBottom: 4, display: "block",
};

export default function EstimateDetail({ estimate, onBack, onUpdate }) {
  const [est, setEst] = useState(JSON.parse(JSON.stringify(estimate)));
  const [activeTab, setActiveTab] = useState("items");
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState({ desc: "", qty: "", unit: "sqft", rate: "" });
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const total = estimateTotal(est.items);

  const save = (updated) => {
    setEst(updated);
    onUpdate(updated);
  };

  const removeItem = (id) => {
    save({ ...est, items: est.items.filter(i => i.id !== id) });
  };

  const addItem = () => {
    if (!newItem.desc || !newItem.qty || !newItem.rate) return;
    const item = {
      id: Date.now(), desc: newItem.desc,
      qty: parseFloat(newItem.qty), unit: newItem.unit, rate: parseFloat(newItem.rate),
    };
    save({ ...est, items: [...est.items, item] });
    setNewItem({ desc: "", qty: "", unit: "sqft", rate: "" });
    setShowAddItem(false);
  };

  const applyPreset = (preset) => {
    setNewItem({ desc: preset.desc, qty: "", unit: preset.unit, rate: String(preset.rate) });
  };

  const setStatus = (status) => {
    save({ ...est, status });
    showToast(`Status updated to ${STATUS_CONFIG[status].label}`);
  };

  const handleSend = () => {
    const updated = { ...est, status: "sent" };
    save(updated);
    const url = `${window.location.origin}${window.location.pathname}#/view/${est.id}`;
    navigator.clipboard.writeText(url).then(() => {
      showToast("Link copied! Estimate sent.");
    }).catch(() => {
      showToast("Estimate sent! (Copy link manually)");
    });
  };

  const handleDuplicate = () => {
    showToast("Duplicate from detail not yet wired");
  };

  return (
    <div style={{ minHeight: "100vh", color: "#4A4A4A", paddingBottom: 100 }}>
      <Toast message={toast} />

      {/* Header */}
      <div style={{
        background: "#EDEBE5", padding: "14px 0 14px",
        borderBottom: "2px solid #C8981E",
        position: "sticky", top: 0, zIndex: 50,
        margin: "0 -16px", paddingLeft: 16, paddingRight: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <Icon name="back" color="#C8981E" />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#4A4A4A" }}>{est.customer}</div>
            <div style={{ fontSize: 11, color: "#AAAAAA" }}>{est.id}</div>
          </div>
          <StatusBadge status={est.status} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#C8981E" }}>{fmt(total)}</div>
          <div style={{ fontSize: 11, color: "#AAAAAA", display: "flex", alignItems: "center", gap: 4 }}>
            <Icon name="clock" size={12} color="#AAAAAA" />
            Expires {new Date(est.expires).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex", borderBottom: "1px solid #E0DCD0", background: "#fff",
        margin: "0 -16px", paddingLeft: 0, paddingRight: 0,
      }}>
        {[
          { key: "items", label: "Line Items", icon: "list" },
          { key: "details", label: "Details", icon: "user" },
          { key: "photos", label: "Photos", icon: "image" },
          { key: "notes", label: "Notes", icon: "note" },
        ].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
            flex: 1, padding: "10px 0", background: "none", border: "none",
            borderBottom: activeTab === t.key ? "2px solid #C8981E" : "2px solid transparent",
            color: activeTab === t.key ? "#C8981E" : "#AAAAAA",
            fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex",
            flexDirection: "column", alignItems: "center", gap: 3,
          }}>
            <Icon name={t.icon} size={16} color={activeTab === t.key ? "#C8981E" : "#AAAAAA"} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ padding: "12px 0" }}>

        {/* Line Items Tab */}
        {activeTab === "items" && (
          <div>
            {est.items.map(item => (
              <div key={item.id} style={{
                background: "#fff", border: "1px solid #E0DCD0", borderRadius: 10,
                padding: "12px 14px", marginBottom: 8,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1, paddingRight: 8 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#4A4A4A", marginBottom: 4 }}>{item.desc}</div>
                    <div style={{ fontSize: 12, color: "#999" }}>
                      {item.qty} {item.unit} × {fmt(item.rate)}/{item.unit}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#4A4A4A" }}>{fmt(item.qty * item.rate)}</div>
                    <button onClick={() => removeItem(item.id)} style={{
                      background: "none", border: "none", cursor: "pointer", marginTop: 4, padding: 2,
                    }}>
                      <Icon name="trash" size={14} color="#C62828" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Total */}
            <div style={{
              background: "#E8F5E9", border: "1px solid #A5D6A7", borderRadius: 10,
              padding: "12px 14px", marginBottom: 12,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#2E7D32" }}>TOTAL</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#2E7D32" }}>{fmt(total)}</span>
            </div>

            {/* Add Item */}
            {!showAddItem ? (
              <button onClick={() => setShowAddItem(true)} style={{
                width: "100%", padding: 12, background: "none", border: "2px dashed #E0DCD0",
                borderRadius: 10, color: "#C8981E", fontSize: 13, fontWeight: 600,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}>
                <Icon name="plus" size={16} color="#C8981E" /> Add Line Item
              </button>
            ) : (
              <div style={{
                background: "#fff", border: "1px solid #C8981E", borderRadius: 12, padding: 14,
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#C8981E", marginBottom: 12 }}>New Line Item</div>

                {/* Preset dropdown */}
                <div style={{ marginBottom: 10 }}>
                  <label style={labelStyle}>Quick Preset</label>
                  <select
                    value=""
                    onChange={e => {
                      const preset = LINE_ITEM_PRESETS[e.target.value];
                      if (preset) applyPreset(preset);
                    }}
                    style={{ ...inputStyle, appearance: "auto" }}
                  >
                    <option value="">— Select a preset —</option>
                    {LINE_ITEM_PRESETS.map((p, i) => (
                      <option key={i} value={i}>{p.desc} ({fmt(p.rate)}/{p.unit})</option>
                    ))}
                  </select>
                </div>

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
                  <button onClick={() => { setShowAddItem(false); setNewItem({ desc: "", qty: "", unit: "sqft", rate: "" }); }} style={{
                    flex: 1, padding: 10, background: "#F7F5F0", border: "1px solid #E0DCD0",
                    borderRadius: 8, color: "#999", fontWeight: 600, cursor: "pointer", fontSize: 13,
                  }}>Cancel</button>
                  <button onClick={addItem} style={{
                    flex: 1, padding: 10, background: "#C8981E", border: "none",
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
              background: "#fff", border: "1px solid #E0DCD0", borderRadius: 12, padding: 14, marginBottom: 10,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#C8981E", marginBottom: 14 }}>Customer Information</div>
              {[
                { icon: "user", label: "Name", value: est.customer },
                { icon: "home", label: "Address", value: est.address },
                { icon: "phone", label: "Phone", value: est.phone },
                { icon: "mail", label: "Email", value: est.email },
              ].map(f => (
                <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 8, background: "#FBF3D5",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon name={f.icon} size={16} color="#C8981E" />
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "#AAAAAA", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{f.label}</div>
                    <div style={{ fontSize: 14, color: "#4A4A4A" }}>{f.value || "—"}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              background: "#fff", border: "1px solid #E0DCD0", borderRadius: 12, padding: 14, marginBottom: 10,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#C8981E", marginBottom: 14 }}>Estimate Info</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <div style={labelStyle}>Created</div>
                  <div style={{ fontSize: 14, color: "#4A4A4A" }}>{new Date(est.created).toLocaleDateString()}</div>
                </div>
                <div>
                  <div style={labelStyle}>Expires</div>
                  <div style={{ fontSize: 14, color: "#4A4A4A" }}>{new Date(est.expires).toLocaleDateString()}</div>
                </div>
                <div>
                  <div style={labelStyle}>Line Items</div>
                  <div style={{ fontSize: 14, color: "#4A4A4A" }}>{est.items.length}</div>
                </div>
                <div>
                  <div style={labelStyle}>Total</div>
                  <div style={{ fontSize: 14, color: "#C8981E", fontWeight: 700 }}>{fmt(total)}</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{
              background: "#fff", border: "1px solid #E0DCD0", borderRadius: 12, padding: 14,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#C8981E", marginBottom: 14 }}>Actions</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {est.status === "draft" && (
                  <button onClick={handleSend} style={{
                    padding: 12, background: "#FBF3D5", border: "1px solid #E8C44A", borderRadius: 10,
                    color: "#C8981E", fontWeight: 700, cursor: "pointer", fontSize: 13,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}>
                    <Icon name="send" size={16} color="#C8981E" /> Send to Customer
                  </button>
                )}
                {est.status === "sent" && (
                  <button onClick={() => { handleSend(); showToast("Reminder sent! Link copied."); }} style={{
                    padding: 12, background: "#FBF3D5", border: "1px solid #E8C44A", borderRadius: 10,
                    color: "#C8981E", fontWeight: 700, cursor: "pointer", fontSize: 13,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}>
                    <Icon name="send" size={16} color="#C8981E" /> Resend / Copy Link
                  </button>
                )}
                <button onClick={handleDuplicate} style={{
                  padding: 12, background: "#F7F5F0", border: "1px solid #E0DCD0",
                  borderRadius: 10, color: "#999", fontWeight: 600, cursor: "pointer", fontSize: 13,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}>
                  <Icon name="copy" size={16} color="#999" /> Duplicate Estimate
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
                    background: "#fff", border: "1px solid #E0DCD0", borderRadius: 10,
                    height: 140, display: "flex", flexDirection: "column", alignItems: "center",
                    justifyContent: "center", position: "relative", overflow: "hidden",
                  }}>
                    <Icon name="image" size={32} color="#E0DCD0" />
                    <div style={{ fontSize: 11, color: "#AAAAAA", marginTop: 6 }}>{img}</div>
                    <button onClick={() => {
                      save({ ...est, images: est.images.filter((_, j) => j !== i) });
                    }} style={{
                      position: "absolute", top: 6, right: 6, background: "rgba(198,40,40,0.1)",
                      border: "none", borderRadius: 6, width: 24, height: 24, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon name="x" size={12} color="#C62828" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => {
              const name = `photo_${Date.now().toString(36)}.jpg`;
              save({ ...est, images: [...est.images, name] });
              showToast("Photo added!");
            }} style={{
              width: "100%", padding: 16, background: "none", border: "2px dashed #E0DCD0",
              borderRadius: 12, color: "#C8981E", fontSize: 13, fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              flexDirection: "column", gap: 8,
            }}>
              <Icon name="camera" size={28} color="#C8981E" />
              <span>Take Photo or Upload</span>
            </button>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === "notes" && (
          <div>
            <textarea
              value={est.notes}
              onChange={e => {
                const updated = { ...est, notes: e.target.value };
                setEst(updated);
                onUpdate(updated);
              }}
              placeholder="Add notes about this project..."
              style={{
                ...inputStyle, minHeight: 200, resize: "vertical", lineHeight: 1.6,
                fontFamily: "inherit",
              }}
            />
            <div style={{ fontSize: 11, color: "#AAAAAA", marginTop: 6, textAlign: "right" }}>
              {est.notes.length} characters
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
