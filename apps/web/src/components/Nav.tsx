import styles from "./Nav.module.css";

export function Nav() {
  return (
    <nav className={styles.nav}>
      <a href="#" className={styles.logo}>
        <span className={styles.star}>✦</span>
        Away
      </a>
      <div className={styles.links}>
        <a href="#explore">Explore</a>
        <a href="#about">About</a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        <a href="#explore" className={styles.cta}>
          Start →
        </a>
      </div>
    </nav>
  );
}
