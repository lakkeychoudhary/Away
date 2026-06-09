import type { AwayResponse } from "@away/shared";
import styles from "./AwayCard.module.css";

interface AwayCardProps {
  away: AwayResponse;
}

export function AwayCard({ away }: AwayCardProps) {
  const dest = away.destination;

  return (
    <div className={styles.card}>
      <p className={styles.eyebrow}>Get away</p>
      <h3 className={styles.title}>Where to find darker sky</h3>
      <p className={styles.message}>{away.message}</p>

      {dest ? (
        <div className={styles.stats}>
          <div className={styles.stat}>
            <strong>{dest.distanceKm} km</strong>
            Drive distance
          </div>
          <div className={styles.stat}>
            <strong>{dest.bearingLabel}</strong>
            Direction
          </div>
          <div className={styles.stat}>
            <strong>Bortle {dest.bortle}</strong>
            Was {away.origin.bortle} at home
          </div>
        </div>
      ) : (
        <p className={`${styles.message} ${styles.none}`}>
          Try a weekend trip to a regional dark-sky park — you're in a heavily lit area.
        </p>
      )}
    </div>
  );
}
