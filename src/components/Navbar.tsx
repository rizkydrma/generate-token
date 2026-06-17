import { Link, useLocation } from "react-router-dom";
import React, { useState } from "react";
import { motion } from "framer-motion";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const Navbar = () => {
  const location = useLocation();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const navItems: NavItem[] = [
    {
      label: "Home",
      path: "/",
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      label: "CampusQu",
      path: "/campusqu",
      icon: (
        <svg
          width="14"
          height="14"
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
      label: "WargaQu",
      path: "/wargaqu",
      icon: (
        <svg
          width="14"
          height="14"
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
      label: "PesantrenQu",
      path: "/pqu",
      icon: (
        <svg
          width="14"
          height="14"
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
    {
      label: "Baznas",
      path: "/baznas",
      icon: (
        <svg
          width="14"
          height="14"
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
  ];

  const styles: Record<string, React.CSSProperties> = {
    navWrapper: {
      position: "fixed",
      top: "1.25rem",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 100000,
      display: "flex",
      alignItems: "center",
      boxSizing: "border-box",
    },
    navContainer: {
      display: "flex",
      alignItems: "center",
      gap: "0.25rem",
      backgroundColor: "rgba(10, 10, 15, 0.72)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      padding: "0.4rem 0.5rem",
      borderRadius: "999px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
    },
    link: {
      display: "flex",
      alignItems: "center",
      gap: "0.45rem",
      padding: "0.5rem 1.1rem",
      borderRadius: "999px",
      fontSize: "0.85rem",
      fontWeight: 600,
      textDecoration: "none",
      transition: "color 0.25s ease, transform 0.25s ease",
      position: "relative",
      outline: "none",
    },
  };

  return (
    <div style={styles.navWrapper}>
      <nav style={styles.navContainer} onMouseLeave={() => setHoveredPath(null)}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isPillHere = item.path === (hoveredPath || location.pathname);

          let linkColor = "#a1a1aa"; // zinc-400
          let linkScale = "1";

          if (isPillHere) {
            linkColor = "#ffffff"; // White when pill is here
            linkScale = "1.02";
          } else if (isActive) {
            linkColor = "#e4e4e7"; // Slightly lighter for active page when pill is hovered elsewhere
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              onMouseEnter={() => setHoveredPath(item.path)}
              style={{
                ...styles.link,
                color: linkColor,
                transform: `scale(${linkScale})`,
              }}
            >
              {/* Unified Sliding Pill Background */}
              {isPillHere && (
                <motion.div
                  layoutId="navPill"
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(99, 102, 241, 0.15)", // Soft glowing Indigo
                    borderRadius: "999px",
                    border: "1px solid rgba(99, 102, 241, 0.25)",
                    boxShadow: "0 0 15px rgba(99, 102, 241, 0.12)",
                    zIndex: 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 30,
                  }}
                />
              )}

              {/* Link Content Wrapper to render on top of the absolute background pills */}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  zIndex: 1,
                  position: "relative",
                }}
              >
                {/* Icon wrapper */}
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    opacity: isPillHere || isActive ? 1 : 0.7,
                    color: isActive ? "#818cf8" : "currentColor",
                    transition: "color 0.2s ease",
                  }}
                >
                  {item.icon}
                </span>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Navbar;
