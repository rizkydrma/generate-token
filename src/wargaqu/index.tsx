/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import { authWargaqu } from "../firebase";
import GlitchText from "./components/GlitchText";
import Hyperspeed from "./components/Hyperspeed";

// ============================================================
// DESIGN TOKENS
// ============================================================
const T = {
  bg: "#030014",
  cardBg: "rgba(9, 9, 11, 0.6)",
  text: "#f4f4f5",
  textSecondary: "#a1a1aa",
  accent: "#6366f1", // Indigo
  accentHover: "#4f46e5",
  accentGlow: "rgba(99, 102, 241, 0.15)",
  border: "rgba(255, 255, 255, 0.08)",
  borderHover: "rgba(255, 255, 255, 0.16)",
  error: "#f87171",
  success: "#34d399",
  font: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
  radius: 24,
  radiusSm: 14,
} as const;

// ============================================================
// CSS KEYFRAMES & GLOBAL INJECTIONS
// ============================================================
const customKeyframes = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.97); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes orbFloat {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%       { transform: translate(40px, -30px) scale(1.08); }
    66%       { transform: translate(-30px, 20px) scale(0.94); }
  }
  @keyframes pulseGlow {
    0%, 100% { opacity: 0.3; }
    50%       { opacity: 0.65; }
  }
  @keyframes statusPulse {
    0%, 100% { transform: scale(1); opacity: 0.8; }
    50%       { transform: scale(1.2); opacity: 1; }
  }
  @keyframes shiny-text-shine {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

// ============================================================
// SUB-COMPONENTS (React Bits Inspired)
// ============================================================

// Hyperspeed WebGL road/lights effect takes the place of Canvas Particles here.

// GlitchText is imported from "./components/GlitchText"

// ============================================================
// STYLES
// ============================================================
const S: Record<string, React.CSSProperties> = {
  shell: {
    position: "fixed",
    inset: 0,
    backgroundColor: T.bg,
    fontFamily: T.font,
    color: T.text,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "clamp(1.5rem, 5vw, 4rem)",
    overflowY: "auto",
    boxSizing: "border-box",
    WebkitFontSmoothing: "antialiased",
    zIndex: 9999,
  },

  orb: {
    position: "fixed",
    borderRadius: "50%",
    filter: "blur(140px)",
    pointerEvents: "none",
    opacity: 0.35,
    mixBlendMode: "screen",
  },

  container: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: 900,
    margin: "auto",
    padding: "clamp(2rem, 5vw, 4rem) 2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    boxSizing: "border-box",
    animation: "scaleIn 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
  },

  pillBadge: {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "0.45rem 1rem",
    borderRadius: "999px",
    fontSize: "0.8rem",
    fontWeight: 600,
    letterSpacing: "0.03em",
    color: "#f4f4f5",
    marginBottom: "2rem",
    animation: "fadeUp 0.8s 0.05s cubic-bezier(0.16, 1, 0.3, 1) both",
  },

  pillNew: {
    backgroundColor: "#fff",
    color: "#030014",
    padding: "0.15rem 0.5rem",
    borderRadius: "999px",
    fontSize: "0.7rem",
    fontWeight: 800,
    textTransform: "uppercase",
  },

  featuresRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
    color: T.textSecondary,
    fontSize: "0.85rem",
    fontWeight: 500,
    marginBottom: "1.5rem",
    animation: "fadeUp 0.8s 0.1s cubic-bezier(0.16, 1, 0.3, 1) both",
  },

  bullet: {
    color: "rgba(255, 255, 255, 0.2)",
    fontSize: "0.6rem",
  },

  heroTitle: {
    fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
    fontWeight: 800,
    letterSpacing: "-0.04em",
    lineHeight: 1.1,
    color: "#fff",
    margin: 0,
    marginBottom: "1.5rem",
    animation: "fadeUp 0.8s 0.15s cubic-bezier(0.16, 1, 0.3, 1) both",
  },

  heroSubtitle: {
    fontSize: "clamp(1rem, 2vw, 1.2rem)",
    fontWeight: 400,
    color: T.textSecondary,
    lineHeight: 1.6,
    maxWidth: 620,
    margin: "0 auto 3rem",
    animation: "fadeUp 0.8s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both",
  },

  glassResult: {
    width: "100%",
    maxWidth: 720,
    backgroundColor: "rgba(9, 9, 11, 0.45)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    borderRadius: "20px",
    padding: "1.75rem",
    marginTop: "3rem",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
    animation: "fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
    textAlign: "left",
  },

  btn: {
    padding: "0.95rem 2.5rem",
    fontSize: "1rem",
    fontWeight: 700,
    fontFamily: T.font,
    backgroundColor: "#fff",
    color: "#030014",
    border: "none",
    borderRadius: "999px",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)",
    boxShadow: "0 10px 30px rgba(255, 255, 255, 0.15)",
    animation: "fadeUp 0.8s 0.25s cubic-bezier(0.16, 1, 0.3, 1) both",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.6rem",
    position: "relative",
    overflow: "hidden",
  },

  btnDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
    transform: "none",
    boxShadow: "none",
  },

  loadingShimmer: {
    backgroundImage: "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.08) 50%, transparent 100%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
  },

  statusText: {
    fontSize: "0.85rem",
    color: T.success,
    fontWeight: 600,
    marginTop: "1.5rem",
    textAlign: "center" as const,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.4rem",
    animation: "fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
  },

  sep: {
    width: "100%",
    height: 1,
    backgroundColor: T.border,
    margin: "2.5rem 0 2rem",
    animation: "fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
  },

  outputSection: {
    animation: "fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
  },

  outputLabelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.6rem",
  },

  outputLabel: {
    fontSize: "0.75rem",
    fontWeight: 700,
    color: T.textSecondary,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
  },

  textareaContainer: {
    position: "relative",
    width: "100%",
  },

  textarea: {
    width: "100%",
    minHeight: 120,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    color: "#e4e4e7",
    fontFamily: '"SF Mono", "Fira Code", "JetBrains Mono", monospace',
    fontSize: "0.8rem",
    lineHeight: 1.6,
    padding: "1.1rem 1.25rem",
    border: `1px solid ${T.border}`,
    borderRadius: T.radiusSm,
    resize: "none",
    outline: "none",
    boxSizing: "border-box" as const,
    transition: "border-color 0.25s ease, box-shadow 0.25s ease",
  },

  copyBtn: {
    position: "absolute",
    top: "0.75rem",
    right: "0.75rem",
    padding: "0.45rem 0.75rem",
    fontSize: "0.75rem",
    fontWeight: 600,
    fontFamily: T.font,
    backgroundColor: "rgba(255,255,255,0.06)",
    color: T.text,
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.3rem",
    backdropFilter: "blur(4px)",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(3, 0, 20, 0.75)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100001,
    animation: "fadeIn 0.3s ease-out both",
  },

  modalContainer: {
    width: "90%",
    maxWidth: 540,
    backgroundColor: "rgba(9, 9, 11, 0.9)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "24px",
    padding: "2.5rem 2rem",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    animation: "scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
    position: "relative",
  },

  modalHeader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "1.5rem",
  },

  modalTitle: {
    fontSize: "1.5rem",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    color: "#fff",
    marginTop: "1rem",
    marginBottom: "0.5rem",
  },

  modalSubtitle: {
    fontSize: "0.85rem",
    color: T.textSecondary,
    lineHeight: 1.5,
    textAlign: "center",
    maxWidth: 380,
  },

  modalCloseX: {
    position: "absolute",
    top: "1.25rem",
    right: "1.25rem",
    background: "none",
    border: "none",
    color: T.textSecondary,
    cursor: "pointer",
    padding: "0.25rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    transition: "all 0.2s ease",
  },

  modalDoneBtn: {
    marginTop: "2rem",
    padding: "0.85rem 2.5rem",
    fontSize: "0.95rem",
    fontWeight: 700,
    fontFamily: T.font,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    color: T.text,
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "999px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    width: "100%",
    textAlign: "center",
  },

  errorBox: {
    marginTop: "1.25rem",
    padding: "1rem 1.25rem",
    backgroundColor: "rgba(248,113,113,0.08)",
    border: "1px solid rgba(248,113,113,0.2)",
    borderRadius: T.radiusSm,
    color: T.error,
    fontSize: "0.85rem",
    fontWeight: 500,
    animation: "fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
    display: "flex",
    alignItems: "flex-start",
    gap: "0.6rem",
  },

  footer: {
    marginTop: "3rem",
    fontSize: "0.75rem",
    color: T.textSecondary,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1.2rem",
    animation: "fadeIn 0.8s 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
  },
};

// ============================================================
// ICONS (inline SVG)
// ============================================================
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const CopyIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// TerminalIcon deleted

const Spinner = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    aria-hidden="true"
    style={{ animation: "spin 0.8s linear infinite" }}
  >
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <path d="M12 2a10 10 0 1 0 10 10" />
  </svg>
);

// ============================================================
// COMPONENT
// ============================================================
const WargaquPage = () => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [focused, setFocused] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Cleanup states
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const signInWithGoogle = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const google_sso: { user: any } = await signInWithPopup(authWargaqu, provider);
      setToken(google_sso?.user?.accessToken ?? "");
      setShowModal(true);
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const copyToken = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
    } catch {
      const el = document.getElementById("token-output") as HTMLTextAreaElement;
      el?.select();
    }
  };

  return (
    <>
      <style>{customKeyframes}</style>

      <div style={S.shell}>
        {/* ---- DYNAMIC BACKGROUND WEBGL HYPERSPEED ---- */}
        <Hyperspeed />

        {/* ---- GLOWING ORBS ---- */}
        <div
          style={{
            ...S.orb,
            width: "clamp(350px, 60vw, 700px)",
            height: "clamp(350px, 60vw, 700px)",
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.16) 0%, transparent 65%)",
            top: "-15%",
            left: "-5%",
            animation: "orbFloat 22s ease-in-out infinite",
          }}
        />
        <div
          style={{
            ...S.orb,
            width: "clamp(300px, 50vw, 600px)",
            height: "clamp(300px, 50vw, 600px)",
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.14) 0%, transparent 65%)",
            bottom: "-10%",
            right: "-5%",
            animation: "orbFloat 25s ease-in-out infinite reverse",
          }}
        />
        <div
          style={{
            ...S.orb,
            width: "clamp(250px, 40vw, 500px)",
            height: "clamp(250px, 40vw, 500px)",
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 65%)",
            top: "40%",
            left: "55%",
            animation: "orbFloat 18s ease-in-out infinite 4s",
          }}
        />

        <div style={S.container}>
          {/* Status Pill Badge */}
          <div style={S.pillBadge}>
            <span style={S.pillNew}>NEW</span>
            <span style={{ marginLeft: "0.5rem" }}>Wargaqu Auth v1.0</span>
          </div>

          {/* Advantages/Features List */}
          <div style={S.featuresRow}>
            <span>⚡ Instant Activation</span>
            <span style={S.bullet}>•</span>
            <span>🔒 Google Secure</span>
            <span style={S.bullet}>•</span>
            <span>🛠️ Developer-First</span>
          </div>

          {/* Hero Title */}
          <h1 style={S.heroTitle}>
            <GlitchText speed={0.4}>Wargaqu Access Token</GlitchText>
          </h1>

          {/* Subtitle */}
          <p style={S.heroSubtitle}>
            Securely authenticate with your Google account to instantly generate a developer access token.
          </p>

          {/* Action Button (White Pill Button) */}
          <button
            style={{
              ...S.btn,
              ...(loading ? S.btnDisabled : {}),
            }}
            onClick={signInWithGoogle}
            disabled={loading}
            onMouseEnter={(e) => {
              if (loading) return;
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 12px 35px rgba(255, 255, 255, 0.25)";
            }}
            onMouseLeave={(e) => {
              if (loading) return;
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(255, 255, 255, 0.15)";
            }}
          >
            {loading ? (
              <>
                <Spinner />
                Requesting Authorization…
              </>
            ) : (
              <>
                <GoogleIcon />
                Sign in with Google
              </>
            )}
          </button>

          {/* Auth Status Check */}
          {token && !loading && (
            <div style={S.statusText}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Secure Session Established
            </div>
          )}

          {/* Error display */}
          {error && (
            <div style={S.errorBox}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
                style={{ flexShrink: 0, marginTop: "1px" }}
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div>{error}</div>
            </div>
          )}

          {/* Token Display Modal */}
          {showModal && token && (
            <div style={S.modalOverlay} onClick={() => setShowModal(false)}>
              <div style={S.modalContainer} onClick={(e) => e.stopPropagation()}>
                <button style={S.modalCloseX} onClick={() => setShowModal(false)}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                <div style={S.modalHeader}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      backgroundColor: "rgba(52, 211, 153, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: T.success,
                      border: "1px solid rgba(52, 211, 153, 0.2)",
                      marginBottom: "1rem",
                    }}
                  >
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h2 style={S.modalTitle}>Success! Token Generated</h2>
                  <p style={S.modalSubtitle}>Your developer token is ready. Copy it below to authenticate requests.</p>
                </div>

                <div style={{ width: "100%", position: "relative" }}>
                  <div style={S.textareaContainer}>
                    <textarea
                      id="token-output"
                      readOnly
                      style={{
                        ...S.textarea,
                        minHeight: 140,
                        ...(focused
                          ? {
                              borderColor: T.accent,
                              boxShadow: `0 0 0 3px rgba(99, 102, 241, 0.25)`,
                            }
                          : {}),
                      }}
                      value={token}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                    />
                    <button
                      style={{
                        ...S.copyBtn,
                        ...(copied ? { color: T.success, borderColor: T.success } : {}),
                      }}
                      onClick={copyToken}
                      onMouseEnter={(e) => {
                        if (!copied) e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.12)";
                      }}
                      onMouseLeave={(e) => {
                        if (!copied) e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.06)";
                      }}
                    >
                      {copied ? <CheckIcon /> : <CopyIcon />}
                      {copied ? "Copied!" : "Copy Token"}
                    </button>
                  </div>
                </div>

                <button
                  style={S.modalDoneBtn}
                  onClick={() => setShowModal(false)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.25)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WargaquPage;
