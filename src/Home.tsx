import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DarkVeil from "./DarkVeil";
import RotatingText from "./components/RotatingText";

interface PortalItem {
  id: number;
  name: string;
  path: string;
  desc: string;
  color: string;
  bgColor: string;
  borderColor: string;
  glowColor: string;
  icon: React.ReactNode;
}

const HomePage = () => {
  const navigate = useNavigate();
  const [activeIndices, setActiveIndices] = useState<number[]>([0, 1, 2, 3]);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const swapTimerRef = useRef<NodeJS.Timeout | null>(null);

  const portals: PortalItem[] = [
    {
      id: 0,
      name: "CampusQu",
      path: "/campusqu",
      desc: "Academic information system token utility. Secure Google SSO authorization for students and faculty.",
      color: "#38bdf8", // Sky Blue
      bgColor: "rgba(56, 189, 248, 0.08)",
      borderColor: "rgba(56, 189, 248, 0.25)",
      glowColor: "rgba(56, 189, 248, 0.15)",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
        </svg>
      ),
    },
    {
      id: 1,
      name: "Wargaqu",
      path: "/wargaqu",
      desc: "Community and citizen platform helper. Securely acquire access keys for neighborhood coordination systems.",
      color: "#818cf8", // Indigo
      bgColor: "rgba(129, 140, 248, 0.08)",
      borderColor: "rgba(129, 140, 248, 0.25)",
      glowColor: "rgba(129, 140, 248, 0.15)",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      id: 2,
      name: "Baznas",
      path: "/baznas",
      desc: "Zakat, donation, and charity portal. Generate developer access tokens for donation processing APIs.",
      color: "#34d399", // Emerald Green
      bgColor: "rgba(52, 211, 153, 0.08)",
      borderColor: "rgba(52, 211, 153, 0.25)",
      glowColor: "rgba(52, 211, 153, 0.15)",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M12 8v8" />
          <path d="M8 12h8" />
        </svg>
      ),
    },
    {
      id: 3,
      name: "PQU",
      path: "/pqu",
      desc: "Pesantren Qu education and administration gate. Obtain authentication keys to interface with school directories.",
      color: "#fbbf24", // Amber Orange
      bgColor: "rgba(251, 191, 36, 0.08)",
      borderColor: "rgba(251, 191, 36, 0.25)",
      glowColor: "rgba(251, 191, 36, 0.15)",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          <path d="M6 6h10" />
          <path d="M6 10h10" />
        </svg>
      ),
    },
  ];

  const handleSwap = () => {
    if (isSwapping) return;
    setIsSwapping(true);
    setActiveIndices((prev) => {
      const next = [...prev];
      const first = next.shift()!;
      next.push(first);
      return next;
    });
    setTimeout(() => setIsSwapping(false), 800);
  };

  // Autoplay cycle
  useEffect(() => {
    swapTimerRef.current = setInterval(handleSwap, 5000);
    return () => {
      if (swapTimerRef.current) clearInterval(swapTimerRef.current);
    };
  }, [isSwapping]);

  // Reset autoplay timer when manually swapping
  const handleManualSwap = () => {
    if (swapTimerRef.current) clearInterval(swapTimerRef.current);
    handleSwap();
    swapTimerRef.current = setInterval(handleSwap, 5000);
  };

  // Card Animation states based on current stack position
  const getCardStyle = (pos: number): any => {
    if (pos === 3 && isSwapping) {
      // Flyout animation for swiped card returning to bottom
      return {
        x: [0, -320, 50],
        y: [0, -15, -48],
        scale: [1, 0.9, 0.85],
        rotate: [0, -12, 4.5],
        zIndex: 1,
        opacity: [1, 0.9, 0.45],
        transition: {
          duration: 0.8,
          times: [0, 0.4, 1],
          ease: "easeInOut",
        },
      };
    }

    // Default layered layout
    return {
      x: pos * 24,
      y: -pos * 20,
      scale: 1 - pos * 0.06,
      rotate: pos * 1.5,
      zIndex: 4 - pos,
      opacity: pos === 3 ? 0.45 : 1 - pos * 0.15,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    };
  };

  // Get index of the current active card
  const activePortalIndex = activeIndices[0];
  const activePortal = portals[activePortalIndex];

  return (
    <>
      <style>{`
        .home-shell {
          min-height: 100vh;
          width: 100vw;
          background-color: #0c0a12;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;
          color: #f4f4f5;
          position: fixed;
          inset: 0;
          overflow-x: hidden;
          overflow-y: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          padding: 6rem 2rem 2rem;
          -webkit-font-smoothing: antialiased;
          z-index: 9999;
        }

        /* Dotted Grid Background overlay */
        .dotted-overlay {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px);
          background-size: 24px 24px;
          z-index: 1;
          pointer-events: none;
        }

        .hero-layout {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 4rem;
          width: 100%;
          max-width: 1200px;
          align-items: center;
          z-index: 2;
          position: relative;
          box-sizing: border-box;
        }

        .left-col {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
          min-width: 0;
        }

        .right-col {
          display: flex;
          justify-content: center;
          align-items: center;
          animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
        }

        .badge {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 999px;
          padding: 0.45rem 1rem;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          color: #d1d5db;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .badge-dot {
          width: 6px;
          height: 6px;
          background-color: #a855f7;
          border-radius: 50%;
          box-shadow: 0 0 10px #a855f7;
          animation: pulse 2s infinite;
        }

        .hero-title {
          font-size: clamp(2.2rem, 4.6vw, 3.4rem);
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.04em;
          margin: 0 0 1.5rem;
          background: linear-gradient(135deg, #ffffff 10%, #d8b4fe 60%, #a855f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .rotating-portal-text {
          display: inline-flex;
          margin-left: 0.5rem;
          width: 11ch;
          text-align: left;
        }

        .rotating-portal-text .text-rotate-element {
          background: linear-gradient(135deg, #c084fc 0%, #38bdf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: clamp(1rem, 1.8vw, 1.12rem);
          color: #a1a1aa;
          line-height: 1.6;
          margin: 0 0 3rem;
          max-width: 540px;
        }

        /* Mockup Browse Button style */
        .btn-browse {
          background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
          color: #ffffff;
          padding: 0.9rem 2.2rem;
          border-radius: 999px;
          font-size: 0.95rem;
          font-weight: 700;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 8px 25px rgba(168, 85, 247, 0.35);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-browse:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(168, 85, 247, 0.5);
          border-color: rgba(255, 255, 255, 0.25);
        }

        /* Mockup Window Style */
        .mock-window {
          width: 100%;
          max-width: 480px;
          height: 380px;
          background: rgba(10, 8, 15, 0.8);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 18px;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .window-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.85rem 1.25rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .window-dots {
          display: flex;
          gap: 0.45rem;
        }

        .dot-control {
          width: 9.5px;
          height: 9.5px;
          border-radius: 50%;
        }
        .dot-close { background-color: #ef4444; }
        .dot-minimize { background-color: #eab308; }
        .dot-zoom { background-color: #22c55e; }

        .window-dropdown {
          font-size: 0.72rem;
          font-weight: 600;
          color: #a1a1aa;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 0.25rem 0.65rem;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          cursor: pointer;
        }

        .window-content {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 2rem;
          box-sizing: border-box;
        }

        /* Stack Card Styling */
        .swap-card {
          position: absolute;
          width: 420px;
          height: 280px;
          background: rgba(18, 15, 23, 0.95);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 1.8rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5), 0 0 20px var(--glow-color);
          box-sizing: border-box;
          cursor: pointer;
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }

        @media (max-width: 480px) {
          .swap-card {
            width: 290px;
            height: 220px;
            padding: 1.25rem;
          }
        }

        .card-header-icon {
          width: 38px;
          height: 38px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-tint);
          color: var(--theme-color);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .card-title {
          font-size: 1.15rem;
          font-weight: 700;
          margin: 0.75rem 0 0.4rem;
          color: #ffffff;
        }

        .card-desc {
          font-size: 0.8rem;
          color: #9f9fad;
          line-height: 1.45;
          margin: 0;
        }

        .card-btn {
          align-self: flex-start;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--theme-color);
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.35rem 0.75rem;
          background: var(--bg-tint);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .card-btn:hover {
          background: var(--theme-color);
          color: #000;
        }

        .click-hint {
          position: absolute;
          bottom: 0.75rem;
          font-size: 0.7rem;
          color: #71717a;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        @media (max-width: 860px) {
          .hero-layout {
            grid-template-columns: 1fr;
            gap: 3.5rem;
            max-width: 520px;
          }
          .home-shell {
            padding: 6.5rem 1.5rem 2.5rem;
            align-items: flex-start;
          }
          .left-col {
            align-items: center;
            text-align: center;
          }
          .hero-subtitle {
            margin: 0 auto 2.5rem;
          }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
      `}</style>

      <div className="home-shell">
        {/* DarkVeil Background Shader */}
        <DarkVeil
          hueShift={0}
          noiseIntensity={0}
          scanlineIntensity={0}
          speed={0.5}
          scanlineFrequency={0}
          warpAmount={0}
        />

        {/* Dotted grid pattern overlay */}
        <div className="dotted-overlay" />

        {/* Core Layout Split */}
        <div className="hero-layout">
          {/* Left info column */}
          <div className="left-col">
            <div className="badge">
              <span className="badge-dot" />
              SSO Ecosystem
            </div>
            <h1 className="hero-title">
              Developer portals for{" "}
              <span style={{ whiteSpace: "nowrap" }}>
                integrated apps{" "}
                <RotatingText
                  texts={["CampusQu", "WargaQu", "PesantrenQu", "Baznas"]}
                  mainClassName="rotating-portal-text"
                  staggerDuration={0.025}
                  staggerFrom="first"
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  rotationInterval={2500}
                />
              </span>
            </h1>
            <p className="hero-subtitle">
              Highly customizable single sign-on helper utilities that drop into your sandbox and instantly make stage
              authentication seamless.
            </p>
            <button onClick={() => navigate(activePortal.path)} className="btn-browse">
              Enter {activePortal.name} Console
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>

          {/* Right cardswap column */}
          <div
            className="right-col"
            style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}
          >
            {/* Active Stack Layout mapping using framer-motion directly */}
            <div
              style={{ position: "relative", width: "100%", height: "360px", display: "grid", placeItems: "center" }}
            >
              {activeIndices.map((originalIndex, orderPos) => {
                const portal = portals[originalIndex];
                const isFront = orderPos === 0;

                return (
                  <motion.div
                    key={portal.id}
                    animate={getCardStyle(orderPos)}
                    onClick={isFront ? undefined : handleManualSwap}
                    className="swap-card"
                    style={
                      {
                        "--theme-color": portal.color,
                        "--border-color": portal.borderColor,
                        "--glow-color": portal.glowColor,
                        "--bg-tint": portal.bgColor,
                      } as React.CSSProperties
                    }
                  >
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div className="card-header-icon">{portal.icon}</div>
                        <span
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            color: "#71717a",
                            textTransform: "uppercase",
                          }}
                        >
                          {isFront ? "Active" : `Stack #${orderPos}`}
                        </span>
                      </div>

                      <h3 className="card-title">{portal.name}</h3>
                      <p className="card-desc">{portal.desc}</p>
                    </div>

                    <Link
                      to={portal.path}
                      className="card-btn"
                      style={{ pointerEvents: isFront ? "auto" : "none" }}
                      onClick={(e) => {
                        if (!isFront) {
                          e.preventDefault();
                          handleManualSwap();
                        }
                      }}
                    >
                      Generate Token
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
