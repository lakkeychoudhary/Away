import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span>✦</span> Away
        </div>
        <div className={styles.col}>
          Night lights: NASA Earth Observatory / VIIRS Black Marble via{" "}
          <a href="https://earthdata.nasa.gov/" target="_blank" rel="noreferrer">
            NASA GIBS
          </a>
          . Geocoding © OpenStreetMap contributors.
        </div>
        <div className={styles.col}>
          Stardance · Hack Club × NASA
          <br />
          Open source — ship something you're proud of.
        </div>
      </div>
    </footer>
  );
}
