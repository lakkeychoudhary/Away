import { useCallback, useState } from "react";
import type { GeocodeResult } from "@away/shared";
import type { AwayResponse, SkyResponse } from "@away/shared";
import { fetchAway, fetchSky } from "./lib/api";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Explorer } from "./components/Explorer";
import { Results } from "./components/Results";
import { About } from "./components/About";
import { Footer } from "./components/Footer";
import styles from "./App.module.css";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sky, setSky] = useState<SkyResponse | null>(null);
  const [away, setAway] = useState<AwayResponse | null>(null);
  const [locationLabel, setLocationLabel] = useState("");
  const [activeYear, setActiveYear] = useState(2024);

  const handleAnalyze = useCallback(
    async (location: GeocodeResult, birthYear: number) => {
      setLoading(true);
      setError(null);

      try {
        const [skyData, awayData] = await Promise.all([
          fetchSky(location.lat, location.lon, birthYear),
          fetchAway(location.lat, location.lon),
        ]);

        setSky(skyData);
        setAway(awayData);
        setLocationLabel(location.label);
        setActiveYear(skyData.metrics.currentYear);

        setTimeout(() => {
          document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setSky(null);
        setAway(null);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return (
    <div className={styles.page}>
      <Nav />
      <Hero />
      <Explorer onAnalyze={handleAnalyze} loading={loading} error={error} />
      {sky && away && (
        <div id="results">
          <Results
            sky={sky}
            away={away}
            locationLabel={locationLabel}
            activeYear={activeYear}
            onYearChange={setActiveYear}
          />
        </div>
      )}
      <About />
      <Footer />
    </div>
  );
}
