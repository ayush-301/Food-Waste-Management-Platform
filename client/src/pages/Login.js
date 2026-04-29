import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, ArrowRight, Leaf } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'DM Sans', sans-serif;
        }

        /* LEFT PANEL */
        .auth-left {
          background: #1a1a18;
          display: flex; flex-direction: column;
          justify-content: space-between;
          padding: 48px;
          position: relative;
          overflow: hidden;
        }
        .auth-left-noise {
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
        }
        .auth-left-glow {
          position: absolute;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(34,192,139,0.15) 0%, transparent 70%);
          bottom: -100px; right: -100px;
          pointer-events: none;
        }
        .auth-logo {
          display: flex; align-items: center; gap: 10px; position: relative; z-index: 1;
        }
        .auth-logo-mark {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, #4f6ef7, #22c08b);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-weight: 700; font-size: 16px;
          font-family: 'DM Serif Display', serif;
        }
        .auth-logo span {
          font-size: 17px; font-weight: 600; color: #fafaf8; letter-spacing: -0.3px;
        }
        .auth-left-body { position: relative; z-index: 1; }
        .auth-left-tag {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(34,192,139,0.15); color: #22c08b;
          font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
          padding: 5px 12px; border-radius: 100px; margin-bottom: 24px;
          border: 1px solid rgba(34,192,139,0.25);
        }
        .auth-left-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(36px, 4vw, 52px);
          line-height: 1.1; color: #fafaf8; letter-spacing: -0.5px;
          margin-bottom: 20px;
        }
        .auth-left-title em { font-style: italic; color: #22c08b; }
        .auth-left-sub {
          font-size: 15px; color: #7a7a72; font-weight: 300; line-height: 1.7;
          margin-bottom: 40px; max-width: 340px;
        }
        .auth-points { display: flex; flex-direction: column; gap: 14px; }
        .auth-point {
          display: flex; align-items: center; gap: 12px;
          font-size: 14px; color: #9a9a90; font-weight: 300;
        }
        .auth-point-dot {
          width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
          background: rgba(34,192,139,0.15); border: 1px solid rgba(34,192,139,0.3);
          display: flex; align-items: center; justify-content: center;
        }
        .auth-point-dot svg { color: #22c08b; }
        .auth-left-footer {
          font-size: 12px; color: #3a3a34; position: relative; z-index: 1;
        }

        /* RIGHT PANEL */
        .auth-right {
          background: #fafaf8;
          display: flex; align-items: center; justify-content: center;
          padding: 48px;
        }
        .auth-form-wrap { width: 100%; max-width: 400px; }
        .auth-form-title {
          font-family: 'DM Serif Display', serif;
          font-size: 32px; color: #1a1a18; letter-spacing: -0.3px; margin-bottom: 6px;
        }
        .auth-form-sub { font-size: 14px; color: #7a7a72; font-weight: 300; margin-bottom: 36px; }
        .auth-form-sub a {
          color: #4f6ef7; font-weight: 500; text-decoration: none; cursor: pointer;
        }
        .auth-form-sub a:hover { text-decoration: underline; }

        .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
        .field label { font-size: 13px; font-weight: 500; color: #4a4a42; }
        .field input {
          padding: 11px 14px; border-radius: 10px;
          border: 1.5px solid #e0e0d8; background: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 14px; color: #1a1a18;
          transition: border-color 0.15s, box-shadow 0.15s; outline: none;
          width: 100%;
        }
        .field input::placeholder { color: #b0b0a4; }
        .field input:focus {
          border-color: #4f6ef7;
          box-shadow: 0 0 0 3px rgba(79,110,247,0.1);
        }
        .field input.error-input {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239,68,68,0.08);
        }
        .field-relative { position: relative; }
        .field-relative input { padding-right: 48px; }
        .eye-btn {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: #8a8a82;
          display: flex; align-items: center; justify-content: center;
          transition: color 0.15s;
          padding: 0;
        }
        .eye-btn:hover { color: #4f6ef7; }

        .error-msg {
          display: flex; align-items: center; gap: 8px;
          background: #fef2f2; border: 1px solid #fecaca;
          border-radius: 8px; padding: 10px 14px;
          font-size: 13px; color: #dc2626; margin-bottom: 16px;
        }

        .forgot-row {
          display: flex; justify-content: flex-end; margin-bottom: 24px;
        }
        .forgot-link {
          font-size: 13px; color: #4f6ef7; cursor: pointer; font-weight: 500;
          text-decoration: none;
        }
        .forgot-link:hover { text-decoration: underline; }

        .submit-btn {
          width: 100%; padding: 13px;
          border-radius: 10px; border: none; cursor: pointer;
          background: linear-gradient(135deg, #4f6ef7, #3a58e0);
          color: #fff; font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 600;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 4px 16px rgba(79,110,247,0.3);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px); box-shadow: 0 6px 22px rgba(79,110,247,0.4);
        }
        .submit-btn:active:not(:disabled) { transform: none; }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .spinner {
          width: 18px; height: 18px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .divider { display: flex; align-items: center; gap: 12px; margin: 24px 0; }
        .divider-line { flex: 1; height: 1px; background: #e8e8e2; }
        .divider-text { font-size: 12px; color: #b0b0a4; }

        .register-prompt {
          text-align: center; font-size: 14px; color: #7a7a72; margin-top: 20px;
        }
        .register-prompt a {
          color: #4f6ef7; font-weight: 600; cursor: pointer; text-decoration: none;
        }
        .register-prompt a:hover { text-decoration: underline; }

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
          <div className="auth-left-glow" />

          <div className="auth-logo">
            <div className="auth-logo-mark">F</div>
            <span>FoodShare</span>
          </div>

          <div className="auth-left-body">
            <div className="auth-left-tag">
              <Leaf size={11} /> Making an impact
            </div>
            <h1 className="auth-left-title">
              Welcome<br />back to<br /><em>FoodShare.</em>
            </h1>
            <p className="auth-left-sub">
              Every login is a chance to reduce waste and feed someone who needs it today.
            </p>
            <div className="auth-points">
              {["Access real-time food listings", "Track your contribution history", "Connect with your community"].map((p, i) => (
                <div className="auth-point" key={i}>
                  <div className="auth-point-dot">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="#22c08b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {p}
                </div>
              ))}
            </div>
          </div>

          <div className="auth-left-footer">© 2026 FoodShare</div>
        </div>

        {/* RIGHT */}
        <div className="auth-right">
          <div className="auth-form-wrap">
            <h2 className="auth-form-title">Sign in</h2>
            <p className="auth-form-sub">
              Don't have an account?{" "}
              <a onClick={() => window.location.href = "/register"}>Create one free</a>
            </p>

            <div className="field">
              <label>Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                className={error ? "error-input" : ""}
              />
            </div>

            <div className="field">
              <label>Password</label>
              <div className="field-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={error ? "error-input" : ""}
                />
                <button className="eye-btn" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="forgot-row">
              <a className="forgot-link" href="#">Forgot password?</a>
            </div>

            {error && (
              <div className="error-msg">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6.5" stroke="#dc2626"/>
                  <path d="M7 4v3M7 9.5v.5" stroke="#dc2626" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}

            <button className="submit-btn" onClick={handleLogin} disabled={loading || !email || !password}>
              {loading ? <div className="spinner" /> : <>Sign in <ArrowRight size={16} /></>}
            </button>

            <p className="register-prompt">
              New here?{" "}
              <a onClick={() => window.location.href = "/register"}>Create your account</a>
            </p>
          </div>
        </div>

      </div>
    </>
  );
}