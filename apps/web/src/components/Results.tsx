import type { AwayResponse, SkyResponse } from "@away/shared";
import { MetricsGrid } from "./MetricsGrid";
import { SkyTimeline } from "./SkyTimeline";
import { SkyMap } from "./SkyMap";
import { AwayCard } from "./AwayCard";
import { ShareCard } from "./ShareCard";
import styles from "./Results.module.css";

interface ResultsProps {
  sky: SkyResponse;
  away: AwayResponse;
  locationLabel: string;
  activeYear: number;
  onYearChange: (year: number) => void;
  theme: string;
}

export function Results({
  sky,
  away,
  locationLabel,
  activeYear,
  onYearChange,
  theme,
}: ResultsProps) {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Your sky</p>
          <h2 className={styles.title}>{sky.share.headline}</h2>
          <p className={styles.location}>{locationLabel}</p>
        </div>

        <MetricsGrid metrics={sky.metrics} />

        <SkyTimeline
          timeline={sky.timeline}
          activeYear={activeYear}
          onYearChange={onYearChange}
        />

        <SkyMap
          lat={sky.location.lat}
          lon={sky.location.lon}
          timeline={sky.timeline}
          activeYear={activeYear}
          theme={theme}
          awayDest={
            away.destination
              ? {
                  lat: away.destination.lat,
                  lon: away.destination.lon,
                  bearingLabel: away.destination.bearingLabel,
                  distanceKm: away.destination.distanceKm,
                }
              : null
          }
        />

        <AwayCard away={away} />

        <div className={styles.shareSection}>
          <p className={styles.shareLabel}>Share your result</p>
          <ShareCard share={sky.share} />
        </div>

        <p className={styles.disclaimer}>
          Bortle classes and star counts are estimated from NASA VIIRS upward radiance —
          not on-site SQM measurements. Use for storytelling and awareness, not
          professional dark-sky planning.
        </p>
      </div>
    </section>
  );
}
