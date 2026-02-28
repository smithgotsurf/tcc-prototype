import Icon from "../shared/Icon";
import StatusBadge from "../shared/StatusBadge";
import { BUSINESS } from "../data";
import { fmt, shortDate, estimateTotal } from "../shared/helpers";

export default function EstimateList({ estimates, onSelect, onNew, onReset, filter, setFilter, search, setSearch }) {
  const filtered = estimates.filter(e => {
    if (filter !== "all" && e.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!e.customer.toLowerCase().includes(q) &&
          !e.id.toLowerCase().includes(q) &&
          !e.address.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const counts = { all: estimates.length };
  estimates.forEach(e => { counts[e.status] = (counts[e.status] || 0) + 1; });

  return (
    <div style={{ minHeight: "100vh", color: "#4A4A4A" }}>
      {/* Admin Header Bar */}
      <div style={{
        background: "#EDEBE5", padding: "14px 0 12px",
        borderBottom: "2px solid #C8981E",
        margin: "0 -16px", paddingLeft: 16, paddingRight: 16,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 8, background: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid #E0DCD0",
              fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700,
            }}>
              <span style={{ color: "#C8981E" }}>T</span>
              <span style={{ color: "#B0B0B0" }}>C</span>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, color: "#999", textTransform: "uppercase" }}>
                {BUSINESS.name}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#4A4A4A", letterSpacing: -0.3 }}>Estimates</div>
            </div>
          </div>
          <button onClick={onNew} style={{
            background: "#C8981E", border: "none", borderRadius: 10, width: 42, height: 42,
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            boxShadow: "0 2px 8px rgba(200,152,30,0.3)",
          }}>
            <Icon name="plus" color="#fff" size={22} />
          </button>
        </div>

        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", background: "#fff", borderRadius: 10,
          padding: "0 12px", border: "1px solid #E0DCD0", marginBottom: 12,
        }}>
          <Icon name="search" size={16} color="#AAAAAA" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search estimates..."
            style={{
              flex: 1, background: "none", border: "none", color: "#4A4A4A", padding: "10px 8px",
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
              borderColor: filter === f.key ? "#C8981E" : "#E0DCD0",
              background: filter === f.key ? "rgba(200,152,30,0.1)" : "#fff",
              color: filter === f.key ? "#C8981E" : "#999",
              fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
            }}>
              {f.label} {counts[f.key] > 0 && <span style={{ opacity: 0.6, marginLeft: 2 }}>({counts[f.key] || 0})</span>}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div style={{ padding: "10px 0" }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: "#AAAAAA" }}>No estimates found</div>
        )}
        {filtered.map(est => {
          const total = estimateTotal(est.items);
          return (
            <button key={est.id} onClick={() => onSelect(est)} style={{
              display: "block", width: "100%", textAlign: "left", background: "#fff",
              border: "1px solid #E0DCD0", borderRadius: 12, padding: "14px 14px",
              marginBottom: 8, cursor: "pointer", transition: "border-color 0.15s, box-shadow 0.15s",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#C8981E"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(200,152,30,0.12)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#E0DCD0"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#4A4A4A" }}>{est.customer}</div>
                  <div style={{ fontSize: 12, color: "#AAAAAA", marginTop: 2 }}>{est.id}</div>
                </div>
                <StatusBadge status={est.status} />
              </div>
              <div style={{ fontSize: 12, color: "#999", marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
                <Icon name="home" size={12} color="#AAAAAA" /> {est.address}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#C8981E" }}>{fmt(total)}</div>
                <div style={{ fontSize: 11, color: "#AAAAAA" }}>
                  Exp. {shortDate(est.expires)}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Reset Demo Data */}
      <div style={{ textAlign: "center", padding: "12px 0 24px" }}>
        <button onClick={onReset} style={{
          background: "none", border: "none", color: "#AAAAAA", fontSize: 11,
          cursor: "pointer", textDecoration: "underline",
        }}>
          <Icon name="refresh" size={10} color="#AAAAAA" /> Reset Demo Data
        </button>
      </div>
    </div>
  );
}
