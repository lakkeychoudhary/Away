import type { SkyMetrics } from "@away/shared";
import { bortleDescription } from "../lib/api";
import styles from "./MetricsGrid.module.css";

interface MetricsGridProps {
  metrics: SkyMetrics;
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <div className={styles.valuePink}>{metrics.percentLost}%</div>
        <div className={styles.label}>Stars lost (est.)</div>
        <div className={styles.detail}>
          {metrics.baselineStars} → {metrics.currentStars} visible stars
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.value}>{metrics.currentBortle}</div>
        <div className={styles.label}>Bortle class now</div>
        <div className={styles.detail}>{bortleDescription(metrics.currentBortle)}</div>
      </div>
      <div className={styles.card}>
        <div className={styles.value}>+{metrics.brightnessIncreasePercent}%</div>
        <div className={styles.label}>Sky brightening</div>
        <div className={styles.detail}>
          Since {metrics.baselineYear}
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.value}>{metrics.starsLost}</div>
        <div className={styles.label}>Fewer stars</div>
        <div className={styles.detail}>
          Bortle {metrics.baselineBortle} → {metrics.currentBortle}
        </div>
      </div>
    </div>
  );
}
