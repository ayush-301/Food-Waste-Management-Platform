import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Utensils, Users, Package, Search, LogOut, Plus, X,
  ChevronDown, Clock, MapPin, CheckCircle, AlertCircle, Leaf
} from "lucide-react";

/* ─── helpers ────────────────────────────────────────────────── */
const getRole = (token) => {
  if (!token) return null;
  try { return JSON.parse(atob(token.split(".")[1])).role; } catch { return null; }
};

const getUserName = (token) => {
  if (!token) return "there";
  try { return JSON.parse(atob(token.split(".")[1])).name || "there"; } catch { return "there"; }
};

const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const ACTIVITIES = [
  "🍱 Restaurant added 10 meals",
  "🤝 Charity claimed 5 meals",
  "👤 User reserved 2 items",
  "🏪 Business shared surplus food",
  "❤️ Meals distributed to community",
];

/* ─── component ──────────────────────────────────────────────── */
export default function Dashboard() {
  const token = localStorage.getItem("token");
  const role = getRole(token);
  const name = getUserName(token);

  const [listings, setListings] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", quantity: "" });
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [activityIdx, setActivityIdx] = useState(0);
  const [claimingId, setClaimingId] = useState(null);
  const [filter, setFilter] = useState("all"); // all | available | claimed
  const formRef = useRef(null);

  const fetchListings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/listings", {
        headers: { Authorization: "Bearer " + token },
      });
      setListings(res.data);
    } catch { /* silent */ }
  };

  const createListing = async () => {
    setFormError("");
    const { title, description, quantity } = form;
    if (!title.trim() || !description.trim() || !quantity) { setFormError("All fields are required."); return; }
    if (Number(quantity) <= 0) { setFormError("Quantity must be greater than 0."); return; }
    try {
      await axios.post("http://localhost:5000/api/listings", form, {
        headers: { Authorization: "Bearer " + token },
      });
      setForm({ title: "", description: "", quantity: "" });
      setShowForm(false);
      fetchListings();
    } catch { setFormError("Only business users can create listings."); }
  };

  const claimListing = async (id) => {
    setClaimingId(id);
    try {
      await axios.post(`http://localhost:5000/api/listings/claim/${id}`, {}, {
        headers: { Authorization: "Bearer " + token },
      });
      fetchListings();
    } catch { alert("Cannot claim this listing."); }
    finally { setClaimingId(null); }
  };

  useEffect(() => {
    fetchListings();
    const iv = setInterval(() => setActivityIdx((i) => (i + 1) % ACTIVITIES.length), 2800);
    return () => clearInterval(iv);
  }, []);

  // click outside to close form
  useEffect(() => {
    const handler = (e) => { if (formRef.current && !formRef.current.contains(e.target)) setShowForm(false); };
    if (showForm) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showForm]);

  const filtered = listings.filter((item) => {
    const q = search.toLowerCase();
    const matchSearch = item.title?.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q);
    const matchFilter = filter === "all" || (filter === "available" && item.quantity > 0) || (filter === "claimed" && item.quantity === 0);
    return matchSearch && matchFilter;
  });

  const totalCount = listings.length;
  const availableCount = listings.filter((l) => l.quantity > 0).length;
  const claimedCount = listings.filter((l) => l.quantity === 0).length;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .db-page {
          min-height: 100vh; background: #f4f4f0;
          font-family: 'DM Sans', sans-serif; color: #1a1a18;
        }

        /* TOPBAR */
        .topbar {
          background: #1a1a18; padding: 0 40px; height: 60px;
          display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; z-index: 50;
        }
        .topbar-logo { display: flex; align-items: center; gap: 10px; }
        .topbar-mark {
          width: 30px; height: 30px; border-radius: 8px;
          background: linear-gradient(135deg, #4f6ef7, #22c08b);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-weight: 700; font-size: 14px; font-family: 'DM Serif Display', serif;
        }
        .topbar-brand { font-size: 15px; font-weight: 600; color: #fafaf8; }
        .topbar-right { display: flex; align-items: center; gap: 16px; }
        .activity-pill {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 100px; padding: 5px 14px;
          font-size: 12px; color: #8a8a82;
          max-width: 280px; overflow: hidden; white-space: nowrap;
          transition: all 0.4s ease;
        }
        .activity-dot { width: 6px; height: 6px; border-radius: 50%; background: #22c08b; flex-shrink: 0; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .role-badge {
          padding: 4px 10px; border-radius: 100px; font-size: 11px; font-weight: 600;
          text-transform: capitalize; letter-spacing: 0.04em;
          background: rgba(79,110,247,0.2); color: #7a9af7;
          border: 1px solid rgba(79,110,247,0.3);
        }
        .logout-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 14px; border-radius: 8px; font-size: 13px; font-weight: 500;
          color: #7a7a72; cursor: pointer; border: 1px solid rgba(255,255,255,0.08);
          background: transparent; font-family: 'DM Sans', sans-serif;
          transition: background 0.15s, color 0.15s;
        }
        .logout-btn:hover { background: rgba(239,68,68,0.1); color: #ef4444; border-color: rgba(239,68,68,0.2); }

        /* MAIN */
        .db-main { max-width: 1120px; margin: 0 auto; padding: 40px 40px 80px; }

        /* HEADER */
        .db-header { margin-bottom: 32px; }
        .db-greeting { font-size: 13px; color: #8a8a82; font-weight: 300; margin-bottom: 4px; }
        .db-title {
          font-family: 'DM Serif Display', serif; font-size: 32px;
          color: #1a1a18; letter-spacing: -0.3px;
        }
        .db-title em { font-style: italic; color: #4f6ef7; }

        /* STATS */
        .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; }
        .stat-card {
          background: #fff; border-radius: 16px; padding: 24px;
          border: 1px solid #e8e8e2; display: flex; align-items: center; gap: 16px;
          cursor: pointer; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
        }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
        .stat-card.active-filter { border-color: #4f6ef7; box-shadow: 0 0 0 3px rgba(79,110,247,0.1); }
        .stat-icon {
          width: 46px; height: 46px; border-radius: 12px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .stat-value { font-size: 28px; font-weight: 700; line-height: 1; letter-spacing: -0.5px; }
        .stat-label { font-size: 13px; color: #8a8a82; margin-top: 3px; }
        .stat-hint { font-size: 11px; color: #b0b0a4; margin-top: 4px; }

        /* TOOLBAR */
        .toolbar { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
        .search-wrap { position: relative; flex: 1; min-width: 220px; }
        .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #aaa; pointer-events: none; }
        .search-wrap input {
          width: 100%; padding: 11px 14px 11px 42px;
          border-radius: 10px; border: 1.5px solid #e0e0d8;
          background: #fff; font-family: 'DM Sans', sans-serif; font-size: 14px;
          color: #1a1a18; outline: none; transition: border-color 0.15s, box-shadow 0.15s;
        }
        .search-wrap input::placeholder { color: #b0b0a4; }
        .search-wrap input:focus { border-color: #4f6ef7; box-shadow: 0 0 0 3px rgba(79,110,247,0.1); }

        .add-btn {
          display: flex; align-items: center; gap: 7px;
          padding: 11px 20px; border-radius: 10px; border: none; cursor: pointer;
          background: linear-gradient(135deg, #4f6ef7, #3a58e0);
          color: #fff; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
          box-shadow: 0 4px 14px rgba(79,110,247,0.3);
          transition: transform 0.15s, box-shadow 0.15s;
          white-space: nowrap;
        }
        .add-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(79,110,247,0.4); }

        /* CREATE FORM */
        .form-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.4);
          display: flex; align-items: center; justify-content: center;
          z-index: 100; padding: 24px;
          animation: fadeIn 0.15s ease;
        }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .form-panel {
          background: #fff; border-radius: 20px; padding: 32px;
          width: 100%; max-width: 460px; box-shadow: 0 24px 64px rgba(0,0,0,0.14);
          animation: slideUp 0.2s ease;
        }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        .form-panel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .form-panel-title { font-family: 'DM Serif Display', serif; font-size: 22px; color: #1a1a18; }
        .close-btn { background: none; border: none; cursor: pointer; color: #8a8a82; padding: 4px; display: flex; transition: color 0.15s; }
        .close-btn:hover { color: #1a1a18; }
        .fp-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
        .fp-field label { font-size: 13px; font-weight: 500; color: #4a4a42; }
        .fp-field input, .fp-field textarea {
          padding: 10px 14px; border-radius: 9px; border: 1.5px solid #e0e0d8;
          background: #fafaf8; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #1a1a18;
          outline: none; transition: border-color 0.15s, box-shadow 0.15s; width: 100%;
          resize: none;
        }
        .fp-field input::placeholder, .fp-field textarea::placeholder { color: #b0b0a4; }
        .fp-field input:focus, .fp-field textarea:focus { border-color: #4f6ef7; box-shadow: 0 0 0 3px rgba(79,110,247,0.08); background: #fff; }
        .fp-err { font-size: 12px; color: #ef4444; display: flex; align-items: center; gap: 6px; margin-bottom: 12px; }
        .fp-actions { display: flex; gap: 10px; margin-top: 4px; }
        .fp-cancel {
          flex: 1; padding: 11px; border-radius: 9px; border: 1.5px solid #e0e0d8;
          background: #fff; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
          color: #6a6a62; cursor: pointer; transition: background 0.15s;
        }
        .fp-cancel:hover { background: #f4f4f0; }
        .fp-submit {
          flex: 2; padding: 11px; border-radius: 9px; border: none;
          background: linear-gradient(135deg, #4f6ef7, #3a58e0);
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
          color: #fff; cursor: pointer; box-shadow: 0 4px 14px rgba(79,110,247,0.3);
          transition: transform 0.15s;
        }
        .fp-submit:hover { transform: translateY(-1px); }

        /* LISTINGS */
        .listings-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .listing-card {
          background: #fff; border-radius: 16px; padding: 24px;
          border: 1px solid #e8e8e2; display: flex; flex-direction: column; gap: 16px;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
        }
        .listing-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.07); border-color: #d8d8d0; }
        .listing-card.claimed-card { opacity: 0.7; }
        .lc-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
        .lc-title { font-size: 17px; font-weight: 600; color: #1a1a18; margin-bottom: 4px; line-height: 1.3; }
        .lc-desc { font-size: 13px; color: #7a7a72; font-weight: 300; line-height: 1.6; }
        .status-badge {
          padding: 4px 10px; border-radius: 100px; font-size: 11px; font-weight: 600;
          letter-spacing: 0.04em; white-space: nowrap; flex-shrink: 0;
        }
        .badge-open { background: #eaf6f0; color: #16a06e; }
        .badge-claimed { background: #f0f0e8; color: #6a6a62; }
        .badge-priority { background: #fef9ec; color: #b45309; }
        .lc-meta { display: flex; align-items: center; gap: 16px; }
        .lc-meta-item { display: flex; align-items: center; gap: 5px; font-size: 13px; color: #8a8a82; font-weight: 300; }
        .lc-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 14px; border-top: 1px solid #f0f0e8; }
        .lc-posted { font-size: 12px; color: #b0b0a4; display: flex; align-items: center; gap: 5px; }
        .claim-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 18px; border-radius: 8px; border: none; cursor: pointer;
          background: #22c08b; color: #fff; font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600; transition: background 0.15s, transform 0.15s;
          box-shadow: 0 3px 10px rgba(34,192,139,0.3);
        }
        .claim-btn:hover { background: #1aaa7a; transform: translateY(-1px); }
        .claim-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .spinner-sm {
          width: 14px; height: 14px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff;
          animation: spin 0.7s linear infinite; display: inline-block;
        }
        @keyframes spin { to{transform:rotate(360deg)} }

        .empty-state {
          grid-column: 1 / -1; padding: 64px 32px; text-align: center;
          background: #fff; border-radius: 16px; border: 1px solid #e8e8e2;
        }
        .empty-icon { width: 56px; height: 56px; border-radius: 16px; background: #f0f0e8; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #8a8a82; }
        .empty-title { font-size: 17px; font-weight: 600; color: #1a1a18; margin-bottom: 6px; }
        .empty-sub { font-size: 14px; color: #8a8a82; font-weight: 300; }

        @media (max-width: 900px) {
          .topbar { padding: 0 20px; }
          .activity-pill { display: none; }
          .db-main { padding: 28px 20px 60px; }
          .stats-row { grid-template-columns: repeat(3, 1fr); gap: 10px; }
          .listings-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .stats-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="db-page">

        {/* TOPBAR */}
        <header className="topbar">
          <div className="topbar-logo">
            <div className="topbar-mark">F</div>
            <span className="topbar-brand">FoodShare</span>
          </div>
          <div className="topbar-right">
            <div className="activity-pill">
              <div className="activity-dot" />
              {ACTIVITIES[activityIdx]}
            </div>
            <span className="role-badge">{role}</span>
            <button
              className="logout-btn"
              onClick={() => { localStorage.removeItem("token"); window.location.href = "/"; }}
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </header>

        <main className="db-main">

          {/* HEADER */}
          <div className="db-header">
            <p className="db-greeting">{greeting()}, <strong>{name}</strong></p>
            <h1 className="db-title">Your <em>dashboard</em></h1>
          </div>

          {/* STATS */}
          <div className="stats-row">
            {[
              { label: "Total listings", value: totalCount, icon: <Package size={20} />, bg: "#eef1fe", color: "#4f6ef7", hint: "Click to see all", key: "all" },
              { label: "Available now", value: availableCount, icon: <CheckCircle size={20} />, bg: "#eaf6f0", color: "#22c08b", hint: "Click to filter", key: "available" },
              { label: "Fully claimed", value: claimedCount, icon: <Leaf size={20} />, bg: "#f0f0e8", color: "#6a6a62", hint: "Click to filter", key: "claimed" },
            ].map((s) => (
              <div
                key={s.key}
                className={`stat-card${filter === s.key ? " active-filter" : ""}`}
                onClick={() => setFilter(filter === s.key ? "all" : s.key)}
              >
                <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                <div>
                  <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-hint">{s.hint}</div>
                </div>
              </div>
            ))}
          </div>

          {/* TOOLBAR */}
          <div className="toolbar">
            <div className="search-wrap">
              <Search size={16} className="search-icon" />
              <input
                type="text" placeholder="Search listings by title or description…"
                value={search} onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {role === "business" && (
              <button className="add-btn" onClick={() => setShowForm(true)}>
                <Plus size={16} /> New listing
              </button>
            )}
          </div>

          {/* LISTINGS */}
          <div className="listings-grid">
            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><Package size={24} /></div>
                <div className="empty-title">No listings found</div>
                <div className="empty-sub">
                  {search ? "Try a different search term." : "No listings match this filter yet."}
                </div>
              </div>
            ) : filtered.map((item) => {
              const isAvailable = item.quantity > 0;
              const isCharityOnly = item.status === "charity-only";
              return (
                <div key={item._id} className={`listing-card${!isAvailable ? " claimed-card" : ""}`}>
                  <div className="lc-top">
                    <div>
                      <div className="lc-title">{item.title}</div>
                      <div className="lc-desc">{item.description}</div>
                    </div>
                    <span className={`status-badge ${!isAvailable ? "badge-claimed" : isCharityOnly ? "badge-priority" : "badge-open"}`}>
                      {!isAvailable ? "Claimed" : isCharityOnly ? "Charity priority" : "Open"}
                    </span>
                  </div>

                  <div className="lc-meta">
                    <div className="lc-meta-item">
                      <Package size={13} />
                      {item.quantity} left
                    </div>
                    {item.location && (
                      <div className="lc-meta-item">
                        <MapPin size={13} /> {item.location}
                      </div>
                    )}
                    {isCharityOnly && isAvailable && (
                      <div className="lc-meta-item" style={{ color: "#b45309" }}>
                        <AlertCircle size={13} /> Charities only
                      </div>
                    )}
                  </div>

                  <div className="lc-footer">
                    <div className="lc-posted">
                      <Clock size={12} />
                      {timeAgo(item.createdAt)}
                    </div>
                    {isAvailable && role !== "business" && (
                      <button
                        className="claim-btn"
                        onClick={() => claimListing(item._id)}
                        disabled={claimingId === item._id}
                      >
                        {claimingId === item._id ? <span className="spinner-sm" /> : <CheckCircle size={14} />}
                        {claimingId === item._id ? "Claiming…" : "Claim"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </main>

      </div>

      {/* CREATE FORM MODAL */}
      {showForm && (
        <div className="form-overlay">
          <div className="form-panel" ref={formRef}>
            <div className="form-panel-header">
              <span className="form-panel-title">New listing</span>
              <button className="close-btn" onClick={() => { setShowForm(false); setFormError(""); }}>
                <X size={20} />
              </button>
            </div>

            <div className="fp-field">
              <label>Food title</label>
              <input
                placeholder="e.g. Biryani, Sandwiches, Bread…"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="fp-field">
              <label>Description</label>
              <textarea
                rows={3}
                placeholder="Describe the food, packaging, dietary info…"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="fp-field">
              <label>Quantity (servings / units)</label>
              <input
                type="number" min="1" placeholder="e.g. 20"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              />
            </div>

            {formError && (
              <div className="fp-err">
                <AlertCircle size={13} /> {formError}
              </div>
            )}

            <div className="fp-actions">
              <button className="fp-cancel" onClick={() => { setShowForm(false); setFormError(""); }}>Cancel</button>
              <button className="fp-submit" onClick={createListing}>Post listing</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}