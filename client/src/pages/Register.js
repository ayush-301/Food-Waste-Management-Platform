import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff, ArrowRight, Utensils, Users, Building2 } from "lucide-react";

const ROLES = [
  {
    id: "community",
    label: "Community",
    icon: <Users size={18} />,
    title: "Be Part of the Change",
    desc: "Access available food listings, reduce waste, and support your local community network.",
    points: ["Browse and claim food listings", "Support local sustainability", "Join a meaningful network"],
  },
  {
    id: "charity",
    label: "Charity",
    icon: <Utensils size={18} />,
    title: "Empower Your Mission",
    desc: "Get priority access to surplus food and distribute it where it's needed most.",
    points: ["Priority access to listings", "Efficient food distribution", "Amplify your social impact"],
  },
  {
    id: "business",
    label: "Business",
    icon: <Building2 size={18} />,
    title: "Reduce Waste. Build Impact.",
    desc: "Share surplus food from your operations and contribute directly to your community.",
    points: ["Reduce operational waste", "Strengthen your brand", "Help your community directly"],
  },
];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "community" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [animating, setAnimating] = useState(false);

  const currentRole = ROLES.find((r) => r.id === form.role);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const selectRole = (roleId) => {
    if (roleId === form.role) return;
    setAnimating(true);
    setTimeout(() => {
      setForm((f) => ({ ...f, role: roleId }));
      setAnimating(false);
    }, 200);
  };

  const isValidEmail = (e) => /\S+@\S+\.\S+/.test(e);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email) e.email = "Email is required";
    else if (!isValidEmail(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      navigate("/login");
    } catch (err) {
      setErrors({ general: err?.response?.data?.message || "Registration failed. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-page {
          min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr;
          font-family: 'DM Sans', sans-serif;
        }

        .auth-left {
          background: #1a1a18; display: flex; flex-direction: column;
          justify-content: space-between; padding: 48px;
          position: relative; overflow: hidden;
        }
        .auth-left-noise {
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
        }
        .auth-glow {
          position: absolute; width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(79,110,247,0.12) 0%, transparent 70%);
          top: -120px; left: -120px; pointer-events: none;
        }
        .auth-logo { display: flex; align-items: center; gap: 10px; position: relative; z-index: 1; }
        .auth-logo-mark {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, #4f6ef7, #22c08b);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-weight: 700; font-size: 16px; font-family: 'DM Serif Display', serif;
        }
        .auth-logo span { font-size: 17px; font-weight: 600; color: #fafaf8; letter-spacing: -0.3px; }

        .left-body { position: relative; z-index: 1; }
        .role-eyebrow {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
          padding: 5px 12px; border-radius: 100px; margin-bottom: 24px;
          background: rgba(79,110,247,0.15); color: #7a9af7;
          border: 1px solid rgba(79,110,247,0.25);
          transition: all 0.2s;
        }
        .left-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(32px, 3.5vw, 46px); line-height: 1.1; color: #fafaf8;
          letter-spacing: -0.4px; margin-bottom: 16px;
          transition: opacity 0.2s, transform 0.2s;
        }
        .left-title.fade-out { opacity: 0; transform: translateY(8px); }
        .left-desc {
          font-size: 14px; color: #6a6a62; font-weight: 300; line-height: 1.7;
          max-width: 320px; margin-bottom: 32px;
          transition: opacity 0.2s;
        }
        .left-desc.fade-out { opacity: 0; }
        .left-points { display: flex; flex-direction: column; gap: 12px; }
        .left-point { display: flex; align-items: center; gap: 12px; font-size: 14px; color: #8a8a82; font-weight: 300; transition: opacity 0.2s; }
        .left-point.fade-out { opacity: 0; }
        .point-check {
          width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0;
          background: rgba(34,192,139,0.12); border: 1px solid rgba(34,192,139,0.25);
          display: flex; align-items: center; justify-content: center;
        }
        .left-footer { font-size: 12px; color: #3a3a34; position: relative; z-index: 1; }

        .auth-right {
          background: #fafaf8; display: flex; align-items: center; justify-content: center;
          padding: 48px; overflow-y: auto;
        }
        .form-wrap { width: 100%; max-width: 420px; }
        .form-title {
          font-family: 'DM Serif Display', serif; font-size: 30px;
          color: #1a1a18; letter-spacing: -0.3px; margin-bottom: 6px;
        }
        .form-sub { font-size: 14px; color: #7a7a72; font-weight: 300; margin-bottom: 28px; }
        .form-sub a { color: #4f6ef7; font-weight: 500; text-decoration: none; cursor: pointer; }
        .form-sub a:hover { text-decoration: underline; }

        .role-tabs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 24px; }
        .role-tab {
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          padding: 12px 8px; border-radius: 12px; cursor: pointer;
          border: 1.5px solid #e0e0d8; background: #fff;
          font-size: 13px; font-weight: 500; color: #6a6a62;
          transition: all 0.18s; text-align: center;
        }
        .role-tab:hover { border-color: #c0c0b8; color: #1a1a18; }
        .role-tab.active {
          border-color: #4f6ef7; background: #f0f3ff; color: #4f6ef7;
        }
        .role-tab-icon { opacity: 0.6; transition: opacity 0.15s; }
        .role-tab.active .role-tab-icon { opacity: 1; }

        .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
        .field label { font-size: 13px; font-weight: 500; color: #4a4a42; }
        .field input {
          padding: 11px 14px; border-radius: 10px;
          border: 1.5px solid #e0e0d8; background: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 14px; color: #1a1a18;
          transition: border-color 0.15s, box-shadow 0.15s; outline: none; width: 100%;
        }
        .field input::placeholder { color: #b0b0a4; }
        .field input:focus { border-color: #4f6ef7; box-shadow: 0 0 0 3px rgba(79,110,247,0.1); }
        .field input.err { border-color: #ef4444; box-shadow: 0 0 0 3px rgba(239,68,68,0.08); }
        .field-err { font-size: 12px; color: #ef4444; margin-top: 4px; }

        .pw-wrap { position: relative; }
        .pw-wrap input { padding-right: 46px; }
        .eye-btn {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: #8a8a82;
          display: flex; align-items: center; padding: 0;
          transition: color 0.15s;
        }
        .eye-btn:hover { color: #4f6ef7; }

        .general-err {
          display: flex; align-items: center; gap: 8px;
          background: #fef2f2; border: 1px solid #fecaca;
          border-radius: 8px; padding: 10px 14px;
          font-size: 13px; color: #dc2626; margin-bottom: 14px;
        }

        .submit-btn {
          width: 100%; margin-top: 8px; padding: 13px;
          border-radius: 10px; border: none; cursor: pointer;
          background: linear-gradient(135deg, #4f6ef7, #3a58e0);
          color: #fff; font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 600;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 4px 16px rgba(79,110,247,0.3);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(79,110,247,0.4); }
        .submit-btn:active:not(:disabled) { transform: none; }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .spinner {
          width: 18px; height: 18px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .login-prompt { text-align: center; font-size: 14px; color: #7a7a72; margin-top: 20px; }
        .login-prompt a { color: #4f6ef7; font-weight: 600; cursor: pointer; text-decoration: none; }
        .login-prompt a:hover { text-decoration: underline; }

        @media (max-width: 768px) {
          .auth-page { grid-template-columns: 1fr; }
          .auth-left { display: none; }
          .auth-right { padding: 32px 24px; }
        }
      `}</style>

      <div className="auth-page">

        {/* LEFT */}
        <div className="auth-left">
          <div className="auth-left-noise" />
          <div className="auth-glow" />

          <div className="auth-logo">
            <div className="auth-logo-mark">F</div>
            <span>FoodShare</span>
          </div>

          <div className="left-body">
            <div className="role-eyebrow">
              {currentRole.icon} &nbsp;{currentRole.label} account
            </div>
            <h2 className={`left-title${animating ? " fade-out" : ""}`}>
              {currentRole.title}
            </h2>
            <p className={`left-desc${animating ? " fade-out" : ""}`}>
              {currentRole.desc}
            </p>
            <div className="left-points">
              {currentRole.points.map((p, i) => (
                <div className={`left-point${animating ? " fade-out" : ""}`} key={i}>
                  <div className="point-check">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="#22c08b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {p}
                </div>
              ))}
            </div>
          </div>

          <div className="left-footer">© 2026 FoodShare</div>
        </div>

        {/* RIGHT */}
        <div className="auth-right">
          <div className="form-wrap">
            <h2 className="form-title">Create account</h2>
            <p className="form-sub">
              Already registered?{" "}
              <a onClick={() => navigate("/login")}>Sign in instead</a>
            </p>

            {/* ROLE TABS */}
            <div className="role-tabs">
              {ROLES.map((r) => (
                <div
                  key={r.id}
                  className={`role-tab${form.role === r.id ? " active" : ""}`}
                  onClick={() => selectRole(r.id)}
                >
                  <span className="role-tab-icon">{r.icon}</span>
                  {r.label}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label>Full name</label>
                <input
                  type="text" name="name" placeholder="Jane Doe"
                  value={form.name} onChange={handleChange}
                  className={errors.name ? "err" : ""}
                />
                {errors.name && <span className="field-err">{errors.name}</span>}
              </div>

              <div className="field">
                <label>Email address</label>
                <input
                  type="email" name="email" placeholder="you@example.com"
                  value={form.email} onChange={handleChange}
                  className={errors.email ? "err" : ""}
                />
                {errors.email && <span className="field-err">{errors.email}</span>}
              </div>

              <div className="field">
                <label>Password</label>
                <div className="pw-wrap">
                  <input
                    type={showPassword ? "text" : "password"} name="password"
                    placeholder="Min. 6 characters"
                    value={form.password} onChange={handleChange}
                    className={errors.password ? "err" : ""}
                  />
                  <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <span className="field-err">{errors.password}</span>}
              </div>

              {errors.general && (
                <div className="general-err">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="6.5" stroke="#dc2626"/>
                    <path d="M7 4v3M7 9.5v.5" stroke="#dc2626" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  {errors.general}
                </div>
              )}

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? <div className="spinner" /> : <>Create account <ArrowRight size={16} /></>}
              </button>
            </form>

            <p className="login-prompt">
              Have an account? <a onClick={() => navigate("/login")}>Sign in</a>
            </p>
          </div>
        </div>

      </div>
    </>
  );
}