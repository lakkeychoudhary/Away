import { useMemo } from "react";
import styles from "./StarMap.module.css";

interface StarMapStar {
  hip: number;
  name: string;
  ra: number;
  dec: number;
  mag: number;
  spectral: string;
  temp: number;
  distance: number;
  visible: boolean;
}

interface StarMapProps {
  stars: StarMapStar[];
  bortle: number;
  locationLabel: string;
}

function spectralColor(spectral: string): string {
  const cls = spectral[0];
  switch (cls) {
    case 'O': return '#9bb0ff';
    case 'B': return '#aabfff';
    case 'A': return '#cad8ff';
    case 'F': return '#f8f7ff';
    case 'G': return '#ffeaa0';
    case 'K': return '#ffcc66';
    case 'M': return '#ff8844';
    default: return '#e8e8ff';
  }
}

function magnitudeSize(mag: number): number {
  const min = -1.5;
  const max = 5;
  const normalized = 1 - (mag - min) / (max - min);
  return Math.max(4, Math.min(32, normalized * 28));
}

export default function StarMap({ stars, bortle, locationLabel }: StarMapProps) {
  const visibleStars = useMemo(() => stars.filter(s => s.visible), [stars]);
  const lostStars = useMemo(() => stars.filter(s => !s.visible), [stars]);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Your visible star chart</h2>
        <p className={styles.subtitle}>
          Based on light pollution at {locationLabel} (Bortle {bortle})
          — {visibleStars.length} of {stars.length} bright stars visible tonight
        </p>

        <div className={styles.chart}>
          <div className={styles.chartInner}>
            {/* Celestial equator line */}
            <div className={styles.equator} />
            
            {/* Cardinal directions */}
            <span className={styles.cardinal} style={{ top: 8, left: '50%' }}>N</span>
            <span className={styles.cardinal} style={{ bottom: 8, left: '50%' }}>S</span>
            <span className={styles.cardinal} style={{ top: '50%', left: 8 }}>W</span>
            <span className={styles.cardinal} style={{ top: '50%', right: 8 }}>E</span>

            {/* Visible stars */}
            {visibleStars.map((star) => {
              const x = ((star.ra % 360) / 360) * 100;
              const y = ((star.dec + 90) / 180) * 100;
              const size = magnitudeSize(star.mag);
              const color = spectralColor(star.spectral);

              return (
                <div
                  key={star.hip}
                  className={styles.star}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: size,
                    height: size,
                    background: color,
                    boxShadow: `0 0 ${size}px ${color}40`,
                  }}
                  title={`${star.name} — ${star.mag} mag, ${star.spectral}, ${star.distance} ly`}
                >
                  {size > 16 && <span className={styles.starName}>{star.name}</span>}
                </div>
              );
            })}

            {/* Lost/faded stars */}
            {lostStars.map((star) => {
              const x = ((star.ra % 360) / 360) * 100;
              const y = ((star.dec + 90) / 180) * 100;
              const size = magnitudeSize(star.mag);

              return (
                <div
                  key={`lost-${star.hip}`}
                  className={styles.lostStar}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: size * 0.6,
                    height: size * 0.6,
                  }}
                  title={`${star.name} — hidden by light pollution`}
                >
                  <div className={styles.lostCross} />
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.legend}>
          <span className={styles.legendItem}>
            <span className={styles.dotVisible} /> Visible ({visibleStars.length})
          </span>
          <span className={styles.legendItem}>
            <span className={styles.dotLost} /> Hidden by pollution ({lostStars.length})
          </span>
        </div>
      </div>
    </section>
  );
}