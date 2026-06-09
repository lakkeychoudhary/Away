import { useEffect, useRef } from "react";
import styles from "./Hero.module.css";

export function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.visible);
        }
      },
      { threshold: 0.2 },
    );

    if (titleRef.current) observer.observe(titleRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.gradientOrb} aria-hidden />
      <div className={styles.gradientOrb2} aria-hidden />

      <div className={styles.content}>
        <div className={styles.badge}>
          <span className={styles.badgeStar}>✦</span>
          Stardance × NASA VIIRS Black Marble
        </div>

        <h1 ref={titleRef} className={styles.title}>
          <span className={styles.titleLine}>Find where the</span>
          <span className={styles.titleAccent}>stars still are.</span>
        </h1>

        <p className={styles.subtitle}>
          Type any city, pick the year you were born. Away uses real NASA satellite 
          data to show how much light pollution has stolen from your night sky — 
          and exactly which way to drive to get it back.
        </p>

        <div className={styles.actions}>
          <a href="#explore" className={styles.primaryBtn}>
            <span className={styles.btnGlow} aria-hidden />
            Explore your sky
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={styles.arrowIcon}>
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a href="#about" className={styles.secondaryBtn}>
            How it works
          </a>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>2012–2024</span>
            <span className={styles.statLabel}>NASA VIIRS years</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>80 km</span>
            <span className={styles.statLabel}>Search radius</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>Bortle 1–9</span>
            <span className={styles.statLabel}>Darkness scale</span>
          </div>
        </div>
      </div>
    </section>
  );
}