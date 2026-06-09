import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.stars} aria-hidden />
      <div className={styles.glow} aria-hidden />

      <div className={styles.badge}>
        <span>✦</span> Stardance × NASA VIIRS Black Marble
      </div>

      <h1 className={styles.title}>
        Find where the
        <br />
        <span className={styles.titleAccent}>stars still are.</span>
      </h1>

      <p className={styles.subtitle}>
        Enter your city and birth year. Away shows how much of your night sky
        satellite data says you've lost — and which direction to drive for darkness.
      </p>

      <div className={styles.actions}>
        <a href="#explore" className={styles.primaryBtn}>
          Explore your sky →
        </a>
        <a href="#about" className={styles.secondaryBtn}>
          How it works
        </a>
      </div>

      <p className={styles.nasa}>
        Night lights: NASA Earth Observatory / VIIRS Black Marble via GIBS
      </p>
    </section>
  );
}
