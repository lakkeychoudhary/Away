import { useState, useEffect } from "react";
import styles from "./Nav.module.css";

interface NavProps {
  hasResults?: boolean;
  theme: string;
  onToggleTheme: () => void;
}

export function Nav({ hasResults, theme, onToggleTheme }: NavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
      <a href="#" className={styles.logo}>
        <span className={styles.star}>✦</span>
        <span className={styles.logoText}>Away</span>
      </a>
      <div className={styles.links}>
        <a href="#explore" className={styles.link}>Explore</a>
        <a href="#about" className={styles.link}>About</a>
        {hasResults && (
          <a href="#results" className={styles.link}>Your Sky</a>
        )}
        <button
          onClick={onToggleTheme}
          className={styles.themeToggle}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          aria-label="Toggle theme"
          type="button"
        >
          {theme === "dark" ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
        <a href="#explore" className={styles.cta}>
          Find darker skies
        </a>
      </div>
    </nav>
  );
}