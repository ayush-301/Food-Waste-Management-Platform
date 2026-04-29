import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import img1 from "../assets/hunger1.webp";
import img2 from "../assets/hunger2.webp";
import img3 from "../assets/hunger3.webp";
import { ArrowRight, Utensils, Users, Package, Leaf, Clock, ShieldCheck, MapPin, Star } from "lucide-react";

/* ─── Scroll-reveal hook ──────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("revealed")),
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ─── Data ────────────────────────────────────────────────────── */
const STEPS = [
  {
    num: "01",
    icon: <Package size={22} />,
    title: "List surplus food",
    desc: "Restaurants, households, or events post available food with pickup time and location.",
  },
  {
    num: "02",
    icon: <MapPin size={22} />,
    title: "Find a listing near you",
    desc: "Browse real-time listings on the map and claim what you need in seconds.",
  },
  {
    num: "03",
    icon: <Utensils size={22} />,
    title: "Pick up & share",
    desc: "Coordinate directly with the donor. No middlemen, no fees, just food.",
  },
];

const FEATURES = [
  {
    icon: <Clock size={20} />,
    color: "blue",
    title: "Real-time listings",
    desc: "Food availability updates live so nothing goes stale before it's claimed.",
  },
  {
    icon: <MapPin size={20} />,
    color: "green",
    title: "Location-based search",
    desc: "Find food or recipients within your neighborhood — no long commutes.",
  },
  {
    icon: <ShieldCheck size={20} />,
    color: "purple",
    title: "Verified donors",
    desc: "Every donor goes through a basic verification to keep the community safe.",
  },
  {
    icon: <Leaf size={20} />,
    color: "emerald",
    title: "Carbon impact tracker",
    desc: "See how much CO₂ you've prevented by diverting food from landfills.",
  },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Restaurant Owner, Delhi",
    quote:
      "We used to throw away 20 kg of food every weekend. Now it reaches families the same evening. FoodShare changed how we close out our kitchen.",
    stars: 5,
    initials: "PS",
    color: "#4f6ef7",
  },
  {
    name: "Arjun Mehra",
    role: "NGO Volunteer, Mumbai",
    quote:
      "Coordinating pickups used to take hours of phone calls. Now our volunteers claim listings on the app and we're done in minutes.",
    stars: 5,
    initials: "AM",
    color: "#22c08b",
  },
  {
    name: "Fatima Qureshi",
    role: "Community Kitchen, Jaipur",
    quote:
      "The platform is simple enough that our older volunteers can use it without any training. That alone is worth everything.",
    stars: 5,
    initials: "FQ",
    color: "#f97316",
  },
];

const STATS = [
  { value: "10K+", label: "Meals shared", icon: <Utensils size={18} />, accent: "#4f6ef7" },
  { value: "500+", label: "People helped", icon: <Users size={18} />, accent: "#22c08b" },
  { value: "50+", label: "Active listings", icon: <Package size={18} />, accent: "#a855f7" },
  { value: "2.4T", label: "kg CO₂ saved", icon: <Leaf size={18} />, accent: "#f97316" },
];

/* ─── Component ───────────────────────────────────────────────── */
export default function Home() {
  const navigate = useNavigate();
  useReveal();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { font-family: 'DM Sans', sans-serif; }

        .fs-page {
          min-height: 100vh;
          background: #fafaf8;
          color: #1a1a18;
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
        }

        /* REVEAL ANIMATIONS */
        .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.65s ease, transform 0.65s ease; }
        .reveal.revealed { opacity: 1; transform: none; }
        .reveal-d1 { transition-delay: 0.1s; }
        .reveal-d2 { transition-delay: 0.2s; }
        .reveal-d3 { transition-delay: 0.3s; }
        .reveal-d4 { transition-delay: 0.4s; }

        /* HERO ANIMATE */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: none; }
        }
        .hero-1 { animation: fadeUp 0.7s ease both; }
        .hero-2 { animation: fadeUp 0.7s 0.15s ease both; }
        .hero-3 { animation: fadeUp 0.7s 0.3s ease both; }
        .hero-4 { animation: fadeUp 0.7s 0.45s ease both; }

        /* NAV */
        .nav {
          position: sticky; top: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 48px;
          height: 64px;
          background: rgba(250,250,248,0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #e8e8e2;
        }
        .nav-logo { display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .nav-logo-mark {
          width: 34px; height: 34px; border-radius: 10px;
          background: linear-gradient(135deg, #4f6ef7, #22c08b);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-weight: 700; font-size: 16px;
          font-family: 'DM Serif Display', serif;
        }
        .nav-brand { font-size: 17px; font-weight: 600; letter-spacing: -0.3px; }
        .nav-actions { display: flex; align-items: center; gap: 8px; }
        .btn-ghost {
          padding: 8px 18px; border-radius: 8px; font-size: 14px; font-weight: 500;
          color: #4a4a46; cursor: pointer; border: none; background: transparent;
          transition: background 0.15s, color 0.15s;
        }
        .btn-ghost:hover { background: #eeeee8; color: #1a1a18; }
        .btn-primary {
          padding: 9px 20px; border-radius: 9px; font-size: 14px; font-weight: 600;
          color: #fff; cursor: pointer; border: none;
          background: linear-gradient(135deg, #4f6ef7, #3a58e0);
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 2px 10px rgba(79,110,247,0.3);
        }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(79,110,247,0.4); }
        .btn-primary:active { transform: none; }

        /* HERO */
        .hero {
          max-width: 1100px; margin: 0 auto;
          padding: 96px 48px 80px;
          display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;
        }
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 6px;
          background: #eef1fe; color: #4f6ef7;
          font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
          padding: 5px 12px; border-radius: 100px; margin-bottom: 20px;
        }
        .hero-dot { width: 6px; height: 6px; border-radius: 50%; background: #4f6ef7; }
        .hero-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(40px, 5vw, 58px);
          line-height: 1.1; letter-spacing: -0.5px;
          color: #1a1a18;
          margin-bottom: 20px;
        }
        .hero-title em { font-style: italic; color: #22c08b; }
        .hero-sub {
          font-size: 17px; line-height: 1.65; color: #5a5a54; margin-bottom: 36px; font-weight: 300;
        }
        .hero-ctas { display: flex; align-items: center; gap: 12px; }
        .cta-main {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 26px; border-radius: 10px; font-size: 15px; font-weight: 600;
          color: #fff; cursor: pointer; border: none;
          background: linear-gradient(135deg, #4f6ef7, #3a58e0);
          box-shadow: 0 4px 18px rgba(79,110,247,0.35);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .cta-main:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(79,110,247,0.45); }
        .cta-main:active { transform: none; }
        .cta-secondary {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 13px 22px; border-radius: 10px; font-size: 15px; font-weight: 500;
          color: #3a3a34; cursor: pointer; border: 1.5px solid #d8d8d0; background: #fff;
          transition: border-color 0.15s, background 0.15s;
        }
        .cta-secondary:hover { border-color: #b0b0a4; background: #f5f5f0; }

        /* HERO IMAGES */
        .hero-images { position: relative; height: 420px; }
        .hero-img {
          position: absolute; border-radius: 18px; overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.12);
          transition: transform 0.3s ease;
        }
        .hero-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .hero-img:hover { transform: scale(1.02); }
        .hi-1 { width: 62%; height: 260px; top: 0; right: 0; }
        .hi-2 { width: 55%; height: 220px; bottom: 0; left: 0; }
        .hi-badge {
          position: absolute; bottom: -14px; right: -12px;
          background: #fff; border-radius: 14px; padding: 12px 16px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.1);
          display: flex; align-items: center; gap: 10px; white-space: nowrap;
        }
        .hi-badge-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, #22c08b, #16a06e);
          display: flex; align-items: center; justify-content: center; color: #fff;
        }
        .hi-badge-text { font-size: 13px; }
        .hi-badge-text strong { display: block; font-size: 16px; font-weight: 700; color: #1a1a18; }

        /* STATS BAR */
        .stats-bar {
          background: #fff; border-top: 1px solid #e8e8e2; border-bottom: 1px solid #e8e8e2;
          padding: 40px 48px;
        }
        .stats-inner {
          max-width: 1100px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
        }
        .stat-card {
          display: flex; align-items: center; gap: 16px;
          padding: 20px 24px; border-radius: 14px;
          border: 1px solid #eeeeea; background: #fafaf8;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
        .stat-icon {
          width: 42px; height: 42px; border-radius: 11px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .stat-value { font-size: 24px; font-weight: 700; line-height: 1; letter-spacing: -0.5px; }
        .stat-label { font-size: 13px; color: #7a7a72; margin-top: 2px; }

        /* SECTION COMMON */
        .section { max-width: 1100px; margin: 0 auto; padding: 96px 48px; }
        .section-label {
          display: inline-block; font-size: 12px; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase; color: #4f6ef7;
          margin-bottom: 12px;
        }
        .section-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(30px, 4vw, 42px); line-height: 1.15;
          letter-spacing: -0.3px; color: #1a1a18; margin-bottom: 16px;
        }
        .section-sub { font-size: 16px; color: #6a6a62; font-weight: 300; line-height: 1.7; max-width: 540px; }

        /* HOW IT WORKS */
        .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; margin-top: 56px; }
        .step-card {
          padding: 32px 28px; border-radius: 18px;
          border: 1px solid #e8e8e2; background: #fff;
          position: relative; overflow: hidden;
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .step-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.07); }
        .step-num {
          font-family: 'DM Serif Display', serif; font-size: 64px; font-weight: 400;
          color: #f0f0e8; position: absolute; top: 16px; right: 20px; line-height: 1;
          pointer-events: none; user-select: none;
        }
        .step-icon-wrap {
          width: 46px; height: 46px; border-radius: 12px;
          background: linear-gradient(135deg, #eef1fe, #dde3fd);
          display: flex; align-items: center; justify-content: center;
          color: #4f6ef7; margin-bottom: 20px;
        }
        .step-title { font-size: 17px; font-weight: 600; color: #1a1a18; margin-bottom: 10px; }
        .step-desc { font-size: 14px; color: #6a6a62; line-height: 1.65; font-weight: 300; }

        /* PROBLEM SECTION */
        .problem-section {
          background: #1a1a18; color: #fafaf8;
          padding: 96px 48px;
        }
        .problem-inner { max-width: 1100px; margin: 0 auto; }
        .problem-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; margin-top: 56px; }
        .problem-stats { display: flex; flex-direction: column; gap: 24px; }
        .pstat {
          padding: 28px 32px; border-radius: 16px;
          border: 1px solid #2e2e2a; background: #222220;
          transition: border-color 0.2s;
        }
        .pstat:hover { border-color: #4a4a44; }
        .pstat-value { font-family: 'DM Serif Display', serif; font-size: 44px; font-weight: 400; line-height: 1; }
        .pstat-label { font-size: 14px; color: #888880; margin-top: 6px; font-weight: 300; }
        .problem-copy { }
        .problem-copy .section-label { color: #22c08b; }
        .problem-copy .section-title { color: #fafaf8; }
        .problem-copy .section-sub { color: #9a9a90; max-width: 100%; }
        .problem-copy p { font-size: 15px; line-height: 1.75; color: #9a9a90; font-weight: 300; margin-top: 20px; }

        /* FEATURES */
        .features-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 56px; }
        .feature-card {
          padding: 28px; border-radius: 16px;
          border: 1px solid #e8e8e2; background: #fff;
          display: flex; gap: 20px; align-items: flex-start;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .feature-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.06); }
        .feature-icon {
          width: 42px; height: 42px; border-radius: 11px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .feature-title { font-size: 15px; font-weight: 600; color: #1a1a18; margin-bottom: 6px; }
        .feature-desc { font-size: 13px; color: #6a6a62; line-height: 1.6; font-weight: 300; }

                /* CTA SECTION */
        .cta-section {
          padding: 96px 48px;
          text-align: center;
        }
        .cta-box {
          max-width: 680px; margin: 0 auto;
          background: linear-gradient(135deg, #4f6ef7 0%, #22c08b 100%);
          border-radius: 28px; padding: 72px 56px;
          position: relative; overflow: hidden;
        }
        .cta-box::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 60%);
          pointer-events: none;
        }
        .cta-box-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(28px, 4vw, 40px); color: #fff; line-height: 1.2; margin-bottom: 16px;
        }
        .cta-box-sub { font-size: 16px; color: rgba(255,255,255,0.8); font-weight: 300; line-height: 1.65; margin-bottom: 36px; }
        .cta-box-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 30px; border-radius: 11px;
          background: #fff; color: #1a1a18; font-size: 15px; font-weight: 600;
          cursor: pointer; border: none;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        .cta-box-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.2); }
        .cta-box-btn:active { transform: none; }


      `}</style>

      <div className="fs-page">

        {/* ── NAV ─────────────────────────────────────────────── */}
        <nav className="nav">
          <div className="nav-logo">
            <div className="nav-logo-mark">F</div>
            <span className="nav-brand">FoodShare</span>
          </div>
          <div className="nav-actions">
            <button className="btn-ghost" onClick={() => navigate("/login")}>Log in</button>
            <button className="btn-primary" onClick={() => navigate("/register")}>Get started</button>
          </div>
        </nav>

        {/* ── HERO ─────────────────────────────────────────────── */}
        <div className="hero">
          <div>
            <div className="hero-eyebrow hero-1">
              <span className="hero-dot" />
              Live in your city
            </div>
            <h1 className="hero-title hero-2">
              Good food<br />shouldn't go to <em>waste.</em>
            </h1>
            <p className="hero-sub hero-3">
              FoodShare connects people with surplus food to those who need it most — in real time, right in your neighborhood.
            </p>
            <div className="hero-ctas hero-4">
              <button className="cta-main" onClick={() => navigate("/register")}>
                Start sharing <ArrowRight size={16} />
              </button>
              <button className="cta-secondary" onClick={() => navigate("/login")}>
                Browse listings
              </button>
            </div>
          </div>

          <div className="hero-images hero-4">
            <div className="hero-img hi-1">
              <img src={img2} alt="Sharing food" />
            </div>
            <div className="hero-img hi-2">
              <img src={img3} alt="Community kitchen" />
            </div>
            <div className="hi-badge">
              <div className="hi-badge-icon">
                <Utensils size={18} />
              </div>
              <div className="hi-badge-text">
                <strong>10,000+</strong>
                meals shared this year
              </div>
            </div>
          </div>
        </div>

        {/* ── STATS BAR ─────────────────────────────────────────── */}
        <div className="stats-bar">
          <div className="stats-inner">
            {STATS.map((s, i) => (
              <div className="stat-card reveal" key={i} style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="stat-icon" style={{ background: `${s.accent}18`, color: s.accent }}>
                  {s.icon}
                </div>
                <div>
                  <div className="stat-value" style={{ color: s.accent }}>{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── HOW IT WORKS ─────────────────────────────────────── */}
        <div className="section">
          <div className="reveal">
            <span className="section-label">How it works</span>
            <h2 className="section-title">Three steps to zero waste</h2>
            <p className="section-sub">No complicated process. Just list, find, and share — anyone can do it in minutes.</p>
          </div>
          <div className="steps">
            {STEPS.map((s, i) => (
              <div className={`step-card reveal reveal-d${i + 1}`} key={i}>
                <span className="step-num">{s.num}</span>
                <div className="step-icon-wrap">{s.icon}</div>
                <div className="step-title">{s.title}</div>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── PROBLEM ──────────────────────────────────────────── */}
        <div className="problem-section">
          <div className="problem-inner">
            <div className="problem-grid">
              <div className="problem-stats">
                {[
                  { val: "1.3B", label: "tonnes of food wasted globally every year", color: "#ef4444" },
                  { val: "828M", label: "people go to sleep hungry every night", color: "#f97316" },
                  { val: "8–10%", label: "of global greenhouse emissions from food waste", color: "#22c08b" },
                ].map((p, i) => (
                  <div className={`pstat reveal reveal-d${i + 1}`} key={i}>
                    <div className="pstat-value" style={{ color: p.color }}>{p.val}</div>
                    <div className="pstat-label">{p.label}</div>
                  </div>
                ))}
              </div>
              <div className="problem-copy reveal">
                <span className="section-label">The problem</span>
                <h2 className="section-title">A crisis hiding in plain sight</h2>
                <p className="section-sub">While millions go hungry, we produce more food than the world needs — and throw most of the excess away.</p>
                <p>
                  Food waste isn't just a moral failure — it's a climate emergency. Every kilogram of food in a landfill releases methane, one of the most potent greenhouse gases. FoodShare is one small but direct way to fight back.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── FEATURES ─────────────────────────────────────────── */}
        <div className="section">
          <div className="reveal">
            <span className="section-label">Why FoodShare</span>
            <h2 className="section-title">Built for real communities</h2>
            <p className="section-sub">Every feature is designed around what donors and recipients actually need — not what looks good in a demo.</p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div className={`feature-card reveal reveal-d${(i % 2) + 1}`} key={i}>
                <div
                  className="feature-icon"
                  style={{
                    background: f.color === "blue" ? "#eef1fe"
                      : f.color === "green" ? "#eaf6f0"
                      : f.color === "purple" ? "#f3eefe"
                      : "#fef3e8",
                    color: f.color === "blue" ? "#4f6ef7"
                      : f.color === "green" ? "#22c08b"
                      : f.color === "purple" ? "#a855f7"
                      : "#f97316",
                  }}
                >
                  {f.icon}
                </div>
                <div>
                  <div className="feature-title">{f.title}</div>
                  <p className="feature-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}