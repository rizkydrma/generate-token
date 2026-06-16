/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import { authWargaqu } from "../firebase";

// ============================================================
// APPLE MINIMALISM — DESIGN TOKENS
// ============================================================
const T = {
    bg: "#f5f5f7",
    cardBg: "rgba(255,255,255,0.72)",
    text: "#1d1d1f",
    textSecondary: "#86868b",
    accent: "#0071e3",
    error: "#ff3b30",
    success: "#34c759",
    border: "rgba(0,0,0,0.08)",
    font: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif',
    radius: 24,
    radiusSm: 14,
} as const;

// ============================================================
// KEYFRAMES
// ============================================================
const appleKeyframes = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.96); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes orbFloat {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%       { transform: translate(30px, -20px) scale(1.05); }
    66%       { transform: translate(-20px, 10px) scale(0.97); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

// ============================================================
// STYLES
// ============================================================
const S: Record<string, React.CSSProperties> = {
    shell: {
        minHeight: "100vh",
        backgroundColor: T.bg,
        fontFamily: T.font,
        color: T.text,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        position: "relative",
        overflow: "hidden",
        WebkitFontSmoothing: "antialiased",
    },

    orb: {
        position: "fixed",
        borderRadius: "50%",
        filter: "blur(120px)",
        pointerEvents: "none",
        opacity: 0.45,
    },

    card: {
        position: "relative",
        zIndex: 1,
        width: "100%",
        maxWidth: 680,
        backgroundColor: T.cardBg,
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        borderRadius: T.radius,
        padding: "clamp(2rem, 6vw, 3.5rem)",
        boxShadow: "0 2px 40px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)",
        animation: "scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
    },

    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: "50%",
        backgroundColor: T.text,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "1.5rem",
        animation: "fadeUp 0.7s 0.1s cubic-bezier(0.16, 1, 0.3, 1) both",
    },

    title: {
        fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
        fontWeight: 700,
        letterSpacing: "-0.025em",
        lineHeight: 1.15,
        margin: 0,
        marginBottom: "0.5rem",
        animation: "fadeUp 0.7s 0.15s cubic-bezier(0.16, 1, 0.3, 1) both",
    },

    subtitle: {
        fontSize: "clamp(1rem, 2vw, 1.15rem)",
        fontWeight: 400,
        color: T.textSecondary,
        lineHeight: 1.5,
        margin: 0,
        marginBottom: "2rem",
        animation: "fadeUp 0.7s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both",
    },

    btn: {
        width: "100%",
        padding: "0.95rem 2rem",
        fontSize: "1rem",
        fontWeight: 600,
        fontFamily: T.font,
        letterSpacing: "-0.01em",
        backgroundColor: T.text,
        color: "#fff",
        border: "none",
        borderRadius: T.radiusSm,
        cursor: "pointer",
        transition: "all 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        animation: "fadeUp 0.7s 0.25s cubic-bezier(0.16, 1, 0.3, 1) both",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        position: "relative",
        overflow: "hidden",
    },

    btnDisabled: {
        opacity: 0.55,
        cursor: "not-allowed",
        transform: "none",
    },

    loadingShimmer: {
        backgroundImage:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
    },

    statusText: {
        fontSize: "0.8rem",
        color: T.success,
        fontWeight: 500,
        marginTop: "0.75rem",
        textAlign: "center" as const,
        animation: "fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
    },

    sep: {
        width: "100%",
        height: 1,
        backgroundColor: T.border,
        margin: "2rem 0 1.5rem",
        animation: "fadeIn 0.5s 0.1s cubic-bezier(0.16, 1, 0.3, 1) both",
    },

    outputSection: {
        animation: "fadeUp 0.55s 0.1s cubic-bezier(0.16, 1, 0.3, 1) both",
    },

    outputLabel: {
        fontSize: "0.75rem",
        fontWeight: 600,
        color: T.textSecondary,
        textTransform: "uppercase" as const,
        letterSpacing: "0.06em",
        marginBottom: "0.6rem",
    },

    textarea: {
        width: "100%",
        minHeight: 180,
        backgroundColor: "#fff",
        color: T.text,
        fontFamily: '"SF Mono", "Fira Code", "JetBrains Mono", monospace',
        fontSize: "0.8rem",
        lineHeight: 1.55,
        padding: "1rem 1.15rem",
        border: `1px solid ${T.border}`,
        borderRadius: T.radiusSm,
        resize: "vertical" as const,
        outline: "none",
        boxSizing: "border-box" as const,
        transition: "border-color 0.25s ease, box-shadow 0.25s ease",
    },

    copyBtn: {
        marginTop: "0.75rem",
        padding: "0.55rem 1.2rem",
        fontSize: "0.8rem",
        fontWeight: 500,
        fontFamily: T.font,
        letterSpacing: "-0.01em",
        backgroundColor: "transparent",
        color: T.accent,
        border: "none",
        borderRadius: T.radiusSm,
        cursor: "pointer",
        transition: "all 0.25s cubic-bezier(0.25, 0.1, 0.25, 1)",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
    },

    errorBox: {
        marginTop: "1rem",
        padding: "0.85rem 1.15rem",
        backgroundColor: "rgba(255,59,48,0.06)",
        borderRadius: T.radiusSm,
        color: T.error,
        fontSize: "0.85rem",
        fontWeight: 500,
        animation: "fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
    },

    footer: {
        marginTop: "2.5rem",
        fontSize: "0.75rem",
        color: T.textSecondary,
        display: "flex",
        justifyContent: "center",
        gap: "1.5rem",
        animation: "fadeIn 0.6s 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
    },
};

// ============================================================
// ICONS (inline SVG)
// ============================================================
const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path
            fill="#fff"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        />
        <path
            fill="#fff"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
            fill="#fff"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
            fill="#fff"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
    </svg>
);

const LockIcon = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
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

    // Cleanup copied state
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
            const google_sso: { user: any } = await signInWithPopup(
                authWargaqu,
                provider,
            );
            setToken(google_sso?.user?.accessToken ?? "");
        } catch (err: any) {
            console.error(err);
            setError(err?.message ?? "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    const copyToken = async () => {
        try {
            await navigator.clipboard.writeText(token);
            setCopied(true);
        } catch {
            const el = document.getElementById(
                "token-output",
            ) as HTMLTextAreaElement;
            el?.select();
        }
    };

    return (
        <>
            <style>{appleKeyframes}</style>

            <div style={S.shell}>
                {/* ---- BACKGROUND ORBS ---- */}
                <div
                    style={{
                        ...S.orb,
                        width: "clamp(300px, 50vw, 600px)",
                        height: "clamp(300px, 50vw, 600px)",
                        background:
                            "radial-gradient(circle, #a5b4fc 0%, transparent 70%)",
                        top: "-10%",
                        left: "-5%",
                        animation: "orbFloat 18s ease-in-out infinite",
                    }}
                />
                <div
                    style={{
                        ...S.orb,
                        width: "clamp(250px, 40vw, 500px)",
                        height: "clamp(250px, 40vw, 500px)",
                        background:
                            "radial-gradient(circle, #f9a8d4 0%, transparent 70%)",
                        bottom: "-8%",
                        right: "-5%",
                        animation: "orbFloat 21s ease-in-out infinite reverse",
                    }}
                />
                <div
                    style={{
                        ...S.orb,
                        width: "clamp(200px, 30vw, 400px)",
                        height: "clamp(200px, 30vw, 400px)",
                        background:
                            "radial-gradient(circle, #a5d6ff 0%, transparent 70%)",
                        top: "50%",
                        left: "60%",
                        animation: "orbFloat 15s ease-in-out infinite 5s",
                    }}
                />

                {/* ---- CARD ---- */}
                <article style={S.card}>
                    {/* Icon */}
                    <div style={S.iconCircle}>
                        <LockIcon />
                    </div>

                    {/* Title */}
                    <h1 style={S.title}>Wargaqu Token</h1>
                    <p style={S.subtitle}>
                        Sign in with your Google account to generate an access
                        token securely.
                    </p>

                    {/* Button */}
                    <button
                        style={{
                            ...S.btn,
                            ...(loading
                                ? { ...S.btnDisabled, ...S.loadingShimmer }
                                : {}),
                        }}
                        onClick={signInWithGoogle}
                        disabled={loading}
                        onMouseEnter={(e) => {
                            if (loading) return;
                            e.currentTarget.style.transform = "scale(1.015)";
                            e.currentTarget.style.boxShadow =
                                "0 6px 28px rgba(0,0,0,0.15)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow =
                                "0 2px 12px rgba(0,0,0,0.08)";
                        }}
                    >
                        {loading ? (
                            <>
                                <Spinner />
                                Signing in…
                            </>
                        ) : (
                            <>
                                <GoogleIcon />
                                Sign in with Google
                            </>
                        )}
                    </button>

                    {/* Authenticated badge */}
                    {token && !loading && (
                        <div style={S.statusText}>
                            ✓ Authenticated — sign in again to refresh
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div style={S.errorBox}>
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                aria-hidden="true"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* Token Output */}
                    {token && (
                        <>
                            <div style={S.sep} />
                            <div style={S.outputSection}>
                                <div style={S.outputLabel}>Access Token</div>
                                <textarea
                                    id="token-output"
                                    readOnly
                                    style={{
                                        ...S.textarea,
                                        ...(focused
                                            ? {
                                                  borderColor: T.accent,
                                                  boxShadow:
                                                      "0 0 0 3px rgba(0,113,227,0.15)",
                                              }
                                            : {}),
                                    }}
                                    value={token}
                                    rows={7}
                                    onFocus={() => setFocused(true)}
                                    onBlur={() => setFocused(false)}
                                />
                                <button
                                    style={{
                                        ...S.copyBtn,
                                        ...(copied ? { color: T.success } : {}),
                                    }}
                                    onClick={copyToken}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor =
                                            "rgba(0,113,227,0.06)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor =
                                            "transparent";
                                    }}
                                >
                                    {copied ? <CheckIcon /> : <CopyIcon />}
                                    {copied ? "Copied" : "Copy token"}
                                </button>
                            </div>
                        </>
                    )}

                    {/* Footer */}
                    <div style={S.footer}>
                        <span>Wargaqu</span>
                        <span>·</span>
                        <span>Token Generator</span>
                    </div>
                </article>
            </div>
        </>
    );
};

export default WargaquPage;
