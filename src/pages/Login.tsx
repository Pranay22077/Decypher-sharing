import { useState } from "react";
import { Shield, Eye, EyeOff, Lock, AlertTriangle, ArrowRight } from "../components/icons";
import { DecypherLogo } from "../components/CypherNavbar";

type Role = "investigator" | "senior" | "forensics" | "admin";

interface Props {
  onLogin: (role: Role) => void;
  onNavigate: (page: string) => void;
}

const roles: { id: Role; label: string; desc: string; color: string }[] = [
  { id: "investigator", label: "Investigator", desc: "Access assigned cases", color: "var(--color-primary)" },
  { id: "senior", label: "Senior Investigator", desc: "Full case & restricted evidence", color: "var(--color-alert-high)" },
  { id: "forensics", label: "Forensics", desc: "Evidence processing", color: "var(--color-success)" },
  { id: "admin", label: "System Admin", desc: "Platform administration", color: "var(--color-alert-critical)" },
];

export default function Login({ onLogin, onNavigate }: Props) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>("investigator");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    const id = userId.trim();
    if (!id || !password.trim()) {
      setError("Enter your Gmail address and password.");
      return;
    }
    if (!/^[^\s@]+@gmail\.com$/i.test(id)) {
      setError("Use a valid @gmail.com address for demo access.");
      return;
    }
    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
      onLogin(selectedRole);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[var(--color-base-bg)] flex">
      {/* Left side - Institutional panel (hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-[var(--color-surface)] border-r border-[var(--color-border-subtle)] flex-col justify-between overflow-hidden">
        {/* Background image with a single flat scrim (no gradient) */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('/img.png')" }}
        />
        <div className="absolute inset-0" style={{ background: "rgba(233,237,242,0.62)" }} />

        {/* Tricolour accent band */}
        <div className="absolute top-0 left-0 w-full h-1 flex">
          <div className="flex-1 flag-saffron" />
          <div className="flex-1 flag-white" />
          <div className="flex-1 flag-green" />
        </div>

        {/* Content overlay */}
        <div className="relative z-10 p-12 mt-8">
          <button onClick={() => onNavigate("landing")} className="flex items-center gap-3 mb-12 group">
            <DecypherLogo size="lg" />
            <div className="text-left">
              <div className="font-bold text-[var(--color-text-primary)] text-2xl tracking-tight group-hover:text-[var(--color-primary)] transition-colors">Decypher</div>
            </div>
          </button>

          <h1 className="text-4xl font-bold text-[var(--color-text-primary)] leading-tight mb-4 tracking-tight">
            AI-Powered<br />
            <span className="text-[var(--color-primary)]">Criminal Network</span><br />
            Intelligence
          </h1>
          <p className="text-[var(--color-text-secondary)] text-lg max-w-md">
            Connecting fragmented evidence. Uncovering hidden networks. Strengthening national security investigations.
          </p>
        </div>

        <div className="relative z-10 p-12">
          <div className="gov-panel p-6 inline-block">
            <div className="flex items-center gap-4 mb-4">
              <Shield className="text-[var(--color-primary)]" size={24} />
              <div>
                <div className="text-[var(--color-text-primary)] font-semibold text-sm">Authorized Access Only</div>
                <div className="text-[var(--color-text-muted)] text-xs mt-0.5">Government of India secure node</div>
              </div>
            </div>
            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-[var(--color-border-subtle)]">
              <div>
                <div className="text-2xl font-bold text-[var(--color-text-primary)] stat-number">256-bit</div>
                <div className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mt-1">Encryption</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--color-text-primary)] stat-number">SHA-2</div>
                <div className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mt-1">Hash Verification</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        {/* Mobile only back link */}
        <div className="absolute top-6 left-6 lg:hidden">
          <button className="text-[12px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-2" onClick={() => onNavigate("landing")}>
            <ArrowRight size={14} className="rotate-180" /> Return
          </button>
        </div>

        <div className="w-full max-w-[440px]">
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-[var(--color-text-primary)] font-bold text-3xl tracking-tight mb-2">Sign In</h2>
            <p className="text-[var(--color-text-secondary)] text-sm">Access the Decypher intelligence platform.</p>
          </div>

          <div className="gov-panel p-8">
            {error && (
              <div
                className="flex items-center gap-3 bg-[var(--color-surface-2)] border rounded-sm p-4 mb-6"
                style={{ borderColor: "var(--color-alert-critical)" }}
              >
                <AlertTriangle size={16} className="flex-shrink-0" style={{ color: "var(--color-alert-critical)" }} />
                <span className="text-[13px]" style={{ color: "var(--color-alert-critical)" }}>{error}</span>
              </div>
            )}

            {/* Role selector */}
            <div className="mb-6">
              <label className="block text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-widest mb-3">Access Role</label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map(r => {
                  const isActive = selectedRole === r.id;
                  return (
                    <button
                      key={r.id}
                      className={`p-3.5 rounded-sm border text-left transition-colors ${
                        isActive
                          ? "border-[var(--color-primary)] bg-[var(--color-surface-2)]"
                          : "border-[var(--color-border-strong)] hover:border-[var(--color-text-secondary)] bg-[var(--color-surface)]"
                      }`}
                      onClick={() => setSelectedRole(r.id)}
                      aria-pressed={isActive}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 flex-shrink-0" style={{ background: r.color }} />
                        <span className={`text-[12px] font-semibold ${isActive ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)]"}`}>{r.label}</span>
                      </div>
                      <p className="text-[10px] text-[var(--color-text-muted)] leading-relaxed">{r.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gmail address */}
            <div className="mb-5">
              <label className="block text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-widest mb-2">Gmail Address</label>
              <input
                type="email"
                inputMode="email"
                autoComplete="username"
                value={userId}
                onChange={e => setUserId(e.target.value)}
                placeholder="yourname@gmail.com"
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                className="w-full bg-[var(--color-surface)] border border-[var(--color-border-strong)] focus:border-[var(--color-primary)] rounded-sm px-4 py-3 text-[14px] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none transition-colors"
              />
            </div>

            {/* Password */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-widest">Password</label>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-border-strong)] focus:border-[var(--color-primary)] rounded-sm px-4 py-3 text-[14px] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none transition-colors pr-12"
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                  onClick={() => setShowPass(s => !s)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              className="btn-premium btn-block btn-lg"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Lock size={16} />
                  Secure Sign In
                </>
              )}
            </button>

            <div className="mt-6 pt-6 border-t border-[var(--color-border-subtle)]">
              <p className="text-[11px] text-[var(--color-text-muted)] text-center leading-relaxed">
                <span className="text-[var(--color-primary)] font-medium">Demo Access:</span> Sign in with any @gmail.com address and any password.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
