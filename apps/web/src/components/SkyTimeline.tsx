import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SkyTimelinePoint } from "@away/shared";
import styles from "./SkyTimeline.module.css";

interface SkyTimelineProps {
  timeline: SkyTimelinePoint[];
  activeYear: number;
  onYearChange: (year: number) => void;
}

export function SkyTimeline({
  timeline,
  activeYear,
  onYearChange,
}: SkyTimelineProps) {
  return (
    <div className={styles.chartWrap}>
      <h3 className={styles.chartTitle}>Your sky over time</h3>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart
          data={timeline}
          onClick={(state) => {
            const year = state?.activeLabel;
            if (year) onYearChange(Number(year));
          }}
        >
          <defs>
            <linearGradient id="radianceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2997ff" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#2997ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" opacity={0.3} vertical={false} />
          <XAxis
            dataKey="year"
            stroke="var(--text-muted)"
            tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
          />
          <YAxis
            yAxisId="left"
            stroke="var(--text-muted)"
            tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
            label={{
              value: "Radiance",
              angle: -90,
              position: "insideLeft",
              fill: "var(--text-muted)",
              fontSize: 11,
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[1, 9]}
            stroke="var(--text-muted)"
            tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
            label={{
              value: "Bortle",
              angle: 90,
              position: "insideRight",
              fill: "var(--text-muted)",
              fontSize: 11,
            }}
          />
          <Tooltip
            contentStyle={{
              background: "var(--bg-panel)",
              border: "1px solid var(--border)",
              borderRadius: 12,
            }}
            labelStyle={{ color: "var(--text-primary)" }}
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="radiance"
            stroke="#2997ff"
            fill="url(#radianceGrad)"
            strokeWidth={2}
            activeDot={{ r: 6, fill: "#2997ff" }}
          />
          <Area
            yAxisId="right"
            type="stepAfter"
            dataKey="bortle"
            stroke="#ff6b9d"
            fill="none"
            strokeWidth={2}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>

      <input
        type="range"
        min={timeline[0]?.year ?? 2012}
        max={timeline.at(-1)?.year ?? 2024}
        value={activeYear}
        onChange={(e) => onYearChange(Number(e.target.value))}
        style={{ width: "100%", marginTop: 16 }}
        aria-label="Scrub through years"
      />

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.dotRadiance} /> Night radiance (NASA VIIRS)
        </span>
        <span className={styles.legendItem}>
          <span className={styles.dotBortle} /> Bortle class
        </span>
      </div>
    </div>
  );
}
