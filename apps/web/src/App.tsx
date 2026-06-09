import { useCallback, useState, useRef, useEffect } from "react";
import type { GeocodeResult } from "@away/shared";
import type { AwayResponse, SkyResponse } from "@away/shared";
import { fetchAway, fetchSky, fetchStars } from "./lib/api";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Explorer } from "./components/Explorer";
import { Results } from "./components/Results";
import { About } from "./components/About";
import { Footer } from "./components/Footer";
import Starfield from "./components/Starfield";
import StarMap from "./components/StarMap";
import styles from "./App.module.css";

export default function App() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sky, setSky] = useState<SkyResponse | null>(null);
  const [away, setAway] = useState<AwayResponse | null>(null);
  const [locationLabel, setLocationLabel] = useState("");
  const [activeYear, setActiveYear] = useState(2024);
  const [stars, setStars] = useState<any[]>([]);
  const [currentBortle, setCurrentBortle] = useState<number | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

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
        setCurrentBortle(skyData.metrics.currentBortle);

        // Fetch visible stars for this location
        try {
          const starsData = await fetchStars(
            location.lat, location.lon, skyData.metrics.currentBortle
          );
          setStars(starsData.stars);
        } catch {
          // star catalog is optional
        }

        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth" });
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
      <Starfield />
      <div className={styles.content}>
        <Nav hasResults={!!sky} theme={theme} onToggleTheme={toggleTheme} />
        <Hero />
        <Explorer onAnalyze={handleAnalyze} loading={loading} error={error} />
        
        {sky && away && (
          <div ref={resultsRef}>
            <Results
              sky={sky}
              away={away}
              locationLabel={locationLabel}
              activeYear={activeYear}
              onYearChange={setActiveYear}
              theme={theme}
            />
            {stars.length > 0 && currentBortle !== null && (
              <StarMap
                stars={stars}
                bortle={currentBortle}
                locationLabel={locationLabel}
              />
            )}
          </div>
        )}
        
        <About />
        <Footer />
      </div>
    </div>
  );
}