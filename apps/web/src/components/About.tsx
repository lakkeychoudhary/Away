import styles from "./About.module.css";

export function About() {
  return (
    <section id="about" className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>How Away works</h2>

        <div className={styles.block}>
          <h3>NASA night lights, your lifetime</h3>
          <p>
            Away samples{" "}
            <a
              href="https://blackmarble.gsfc.nasa.gov/"
              target="_blank"
              rel="noreferrer"
            >
              VIIRS Black Marble
            </a>{" "}
            radiance at your coordinates for each year since 2012 (or your birth year,
            whichever is later). Brighter radiance → higher Bortle class → fewer visible
            stars.
          </p>
        </div>

        <div className={styles.block}>
          <h3>Find darkness nearby</h3>
          <p>
            The <strong>Get away</strong> feature scans compass directions within 80 km
            for lower radiance — a practical "which way do I drive?" answer, powered by
            the same NASA data.
          </p>
        </div>

        <div className={styles.block}>
          <h3>Built for Stardance</h3>
          <p>Open source, demo-friendly, and honest about what satellite data can and can't tell you.</p>
          <ul className={styles.list}>
            <li>Frontend: React + MapLibre + Recharts</li>
            <li>Backend: Fastify API with GIBS + geocoding</li>
            <li>Agent docs in <code>.agents/</code> for continued development</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
