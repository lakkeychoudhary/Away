import { useState } from "react";
import type { SharePayload } from "@away/shared";
import styles from "./ShareCard.module.css";

interface ShareCardProps {
  share: SharePayload;
}

export function ShareCard({ share }: ShareCardProps) {
  const [copied, setCopied] = useState(false);

  async function copyStats() {
    const text = [
      share.headline,
      share.subline,
      ...share.stats.map((s) => `${s.label}: ${s.value}`),
      "",
      "away — find where the stars still are ✦",
    ].join("\n");

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={styles.card}>
      <h3 className={styles.headline}>{share.headline}</h3>
      <p className={styles.subline}>{share.subline}</p>

      <div className={styles.stats}>
        {share.stats.map((s) => (
          <div key={s.label} className={styles.stat}>
            <div className={styles.statLabel}>{s.label}</div>
            <div className={styles.statValue}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.copyBtn} onClick={() => void copyStats()}>
          Copy for devlog →
        </button>
        {copied && <span className={styles.copied}>Copied!</span>}
      </div>

      <p className={styles.brand}>
        Built with <strong>NASA VIIRS Black Marble</strong> · Stardance project
      </p>
    </div>
  );
}
