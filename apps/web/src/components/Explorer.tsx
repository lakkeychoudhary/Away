import { useCallback, useEffect, useState } from "react";
import type { GeocodeResult } from "@away/shared";
import { geocode } from "../lib/api";
import styles from "./Explorer.module.css";

interface ExplorerProps {
  onAnalyze: (location: GeocodeResult, birthYear: number) => void;
  loading: boolean;
  error: string | null;
}

export function Explorer({ onAnalyze, loading, error }: ExplorerProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeocodeResult[]>([]);
  const [selected, setSelected] = useState<GeocodeResult | null>(null);
  const [birthYear, setBirthYear] = useState(2005);
  const [searching, setSearching] = useState(false);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    setSearching(true);
    try {
      const res = await geocode(q);
      setSuggestions(res.results);
    } catch {
      setSuggestions([]);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!selected || query !== selected.label) {
        void search(query);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [query, search, selected]);

  function pick(place: GeocodeResult) {
    setSelected(place);
    setQuery(place.label);
    setSuggestions([]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    onAnalyze(selected, birthYear);
  }

  const currentYear = new Date().getFullYear();

  return (
    <section id="explore" className={styles.section}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Explore</p>
        <h2 className={styles.title}>Where did your stars go?</h2>
        <p className={styles.desc}>
          Search a city, pick your birth year, and Away pulls NASA VIIRS night-light
          radiance for every year since you were born.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="location">
              Location
            </label>
            <div className={styles.inputRow}>
              <input
                id="location"
                className={styles.input}
                placeholder="Paris, Mumbai, San Francisco…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelected(null);
                }}
                autoComplete="off"
              />
              {suggestions.length > 0 && (
                <div className={styles.suggestions}>
                  {suggestions.map((s) => (
                    <button
                      key={`${s.lat}-${s.lon}`}
                      type="button"
                      className={styles.suggestion}
                      onClick={() => pick(s)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {selected && (
              <p className={styles.selected}>
                Selected: <strong>{selected.label}</strong>
              </p>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="birthYear">
              Birth year
            </label>
            <div className={styles.yearRow}>
              <input
                id="birthYear"
                type="number"
                className={styles.yearInput}
                min={1950}
                max={currentYear}
                value={birthYear}
                onChange={(e) => setBirthYear(parseInt(e.target.value, 10))}
              />
              <span className={styles.yearHint}>
                Timeline starts at {Math.max(2012, birthYear)} (VIIRS data from 2012)
              </span>
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            className={styles.submit}
            disabled={!selected || loading || searching}
          >
            {loading ? "Reading the sky…" : "Analyze my sky →"}
          </button>
        </form>
      </div>
    </section>
  );
}
