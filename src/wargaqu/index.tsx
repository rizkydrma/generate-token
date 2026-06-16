/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { authWargaqu } from "../firebase";

// ============================================================
// BRUTALIST DESIGN TOKENS
// ============================================================
const C = {
    bg: "#0a0a0a",
    bgCard: "#0f0f0f",
    bgInput: "#111111",
    text: "#f0f0f0",
    accent: "#00ff41",
    accentAlt: "#ffff00",
    error: "#ff3333",
    border: "#f0f0f0",
    borderWidth: "4px",
    shadowOffset: "6px",
    font: "'Courier New', 'JetBrains Mono', 'Fira Code', monospace",
} as const;

// ============================================================
// STYLES
// ============================================================
const styles: Record<string, React.CSSProperties> = {
    shell: {
        minHeight: "100vh",
        backgroundColor: C.bg,
        color: C.text,
        fontFamily: C.font,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        position: "relative",
        overflow: "hidden",
    },

    watermark: {
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        userSelect: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "clamp(6rem, 15vw, 16rem)",
        fontWeight: 900,
        color: C.text,
        opacity: 0.025,
        lineHeight: 1,
        whiteSpace: "pre",
        fontFamily: C.font,
    },

    card: {
        position: "relative",
        zIndex: 1,
        width: "100%",
        maxWidth: 820,
        border: `${C.borderWidth} solid ${C.border}`,
        padding: "clamp(1.5rem, 5vw, 3rem)",
        backgroundColor: C.bgCard,
    },

    title: {
        fontSize: "clamp(1.2rem, 3.5vw, 2rem)",
        fontWeight: 900,
        textTransform: "uppercase" as const,
        letterSpacing: "0.08em",
        margin: 0,
        marginBottom: "0.25rem",
        color: C.text,
    },

    titleUnderline: {
        width: "100%",
        height: C.borderWidth,
        backgroundColor: C.accent,
        marginBottom: "2rem",
    },

    subtitle: {
        fontSize: "0.75rem",
        fontWeight: 400,
        color: C.accent,
        marginBottom: "1.5rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase" as const,
        opacity: 0.8,
    },

    btn: {
        width: "100%",
        padding: "1rem 1.5rem",
        fontSize: "clamp(0.75rem, 1.8vw, 1rem)",
        fontWeight: 900,
        fontFamily: C.font,
        textTransform: "uppercase" as const,
        letterSpacing: "0.08em",
        backgroundColor: C.accent,
        color: C.bg,
        border: `${C.borderWidth} solid ${C.border}`,
        cursor: "pointer",
        transition: "all 0.1s ease",
        boxShadow: `${C.shadowOffset} ${C.shadowOffset} 0 ${C.border}`,
    },

    btnDisabled: {
        opacity: 0.5,
        cursor: "not-allowed",
    },

    btnLabel: {
        color: "#666",
        fontSize: "0.65rem",
        marginTop: "0.5rem",
        letterSpacing: "0.1em",
    },

    outputSection: {
        marginTop: "2rem",
    },

    separator: {
        width: "100%",
        height: "2px",
        backgroundColor: C.border,
        margin: "1.5rem 0",
        opacity: 0.4,
    },

    outputLabel: {
        fontSize: "0.8rem",
        fontWeight: 700,
        color: C.accent,
        textTransform: "uppercase" as const,
        letterSpacing: "0.15em",
        marginBottom: "0.75rem",
    },

    textarea: {
        width: "100%",
        minHeight: 200,
        backgroundColor: C.bgInput,
        color: C.accent,
        fontFamily: C.font,
        fontSize: "0.8rem",
        lineHeight: 1.6,
        padding: "1rem",
        border: `${C.borderWidth} solid ${C.border}`,
        resize: "vertical" as const,
        outline: "none",
        boxSizing: "border-box" as const,
    },

    copyBtn: {
        marginTop: "0.75rem",
        padding: "0.5rem 1rem",
        fontSize: "0.7rem",
        fontWeight: 700,
        fontFamily: C.font,
        textTransform: "uppercase" as const,
        letterSpacing: "0.1em",
        backgroundColor: "transparent",
        color: C.text,
        border: `2px solid ${C.text}`,
        cursor: "pointer",
        transition: "all 0.1s ease",
    },

    errorBox: {
        marginTop: "1rem",
        padding: "1rem",
        border: `${C.borderWidth} solid ${C.error}`,
        color: C.error,
        fontSize: "0.8rem",
        fontWeight: 700,
        letterSpacing: "0.05em",
    },

    footer: {
        marginTop: "2rem",
        paddingTop: "1rem",
        borderTop: `2px solid ${C.border}`,
        fontSize: "0.65rem",
        color: C.text,
        opacity: 0.5,
        letterSpacing: "0.1em",
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap" as const,
        gap: "0.5rem",
    },

    blink: {
        display: "inline-block",
        width: "0.6em",
        height: "1em",
        backgroundColor: C.accent,
        marginLeft: "0.15em",
        verticalAlign: "text-bottom",
        animation: "blink 1s step-end infinite",
    },
};

// ============================================================
// INLINE KEYFRAMES (injected once via <style>)
// ============================================================
const brutalistKeyframes = `
  @keyframes blink {
    50% { opacity: 0; }
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

// ============================================================
// COMPONENT
// ============================================================
const WargaquPage = () => {
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

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
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback: select the text
            const el = document.getElementById(
                "token-output",
            ) as HTMLTextAreaElement;
            el?.select();
        }
    };

    return (
        <>
            <style>{brutalistKeyframes}</style>

            <div style={styles.shell}>
                {/* ---- BACKGROUND WATERMARK ---- */}
                <div style={styles.watermark} aria-hidden="true">
                    {"{  }"}
                </div>

                {/* ---- MAIN CARD ---- */}
                <div style={styles.card}>
                    {/* Title */}
                    <h1 style={styles.title}>WARGAGU</h1>
                    <h1
                        style={{
                            ...styles.title,
                            color: C.accent,
                            marginTop: "-0.25rem",
                        }}
                    >
                        TOKEN GENERATOR
                    </h1>
                    <div style={styles.titleUnderline} />
                    <p style={styles.subtitle}>
                        Sign in with Google to retrieve your access token
                    </p>

                    {/* Button */}
                    <button
                        style={{
                            ...styles.btn,
                            ...(loading ? styles.btnDisabled : {}),
                        }}
                        onClick={signInWithGoogle}
                        disabled={loading}
                    >
                        {loading
                            ? "[ AUTHENTICATING... ]"
                            : "[ SIGN IN WITH GOOGLE ]"}
                    </button>
                    {token && (
                        <div style={styles.btnLabel}>
                            ✓ AUTHENTICATED — YOU MAY SIGN IN AGAIN TO REFRESH
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div style={styles.errorBox}>[ ERROR ] {error}</div>
                    )}

                    {/* Token Output */}
                    {token && (
                        <div
                            style={{
                                ...styles.outputSection,
                                animation: "slideDown 0.3s ease",
                            }}
                        >
                            <div style={styles.separator} />
                            <div style={styles.outputLabel}>
                                [ TOKEN OUTPUT ]
                                <span style={styles.blink} />
                            </div>
                            <textarea
                                id="token-output"
                                readOnly
                                style={styles.textarea}
                                value={token}
                                rows={8}
                            />
                            <button
                                style={{
                                    ...styles.copyBtn,
                                    ...(copied
                                        ? {
                                              backgroundColor: C.accent,
                                              color: C.bg,
                                              borderColor: C.accent,
                                          }
                                        : {}),
                                }}
                                onClick={copyToken}
                            >
                                {copied
                                    ? "[ COPIED ]"
                                    : "[ COPY TO CLIPBOARD ]"}
                            </button>
                        </div>
                    )}

                    {/* Footer */}
                    <div style={styles.footer}>
                        <span>WARGAGU v1.0</span>
                        <span>{new Date().getFullYear()}</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default WargaquPage;
