import { useState, useEffect } from "react";
import styles from "./Nav.module.css";

interface NavProps {
  hasResults?: boolean;
}

export function Nav({ hasResults }: NavProps) {
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
        <a href="#explore" className={styles.cta}>
          Find darker skies
        </a>
      </div>
    </nav>
  );
}