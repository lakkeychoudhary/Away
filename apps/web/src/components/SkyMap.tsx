import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { SkyTimelinePoint } from "@away/shared";
import styles from "./SkyMap.module.css";

interface SkyMapProps {
  lat: number;
  lon: number;
  timeline: SkyTimelinePoint[];
  activeYear: number;
  awayDest?: { lat: number; lon: number; bearingLabel: string; distanceKm: number } | null;
}

function nasaTileUrl(year: number): string {
  return `https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&LAYERS=VIIRS_Black_Marble&STYLES=default&FORMAT=image/png&TRANSPARENT=true&SRS=EPSG:3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256&TIME=${year}-01-01`;
}

export function SkyMap({ lat, lon, timeline, activeYear, awayDest }: SkyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const awayMarkerRef = useRef<maplibregl.Marker | null>(null);

  const point = timeline.find((t) => t.year === activeYear) ?? timeline.at(-1);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap © CARTO",
          },
          nasa: {
            type: "raster",
            tiles: [nasaTileUrl(activeYear)],
            tileSize: 256,
          },
        },
        layers: [
          { id: "osm", type: "raster", source: "osm" },
          { id: "nasa", type: "raster", source: "nasa", paint: { "raster-opacity": 0.65 } },
        ],
      },
      center: [lon, lat],
      zoom: 8,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), "bottom-right");

    markerRef.current = new maplibregl.Marker({ color: "#ff6b9d" })
      .setLngLat([lon, lat])
      .addTo(map);

    mapRef.current = map;

    return () => {
      markerRef.current?.remove();
      awayMarkerRef.current?.remove();
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      awayMarkerRef.current = null;
    };
  }, [lat, lon]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    if (map.getLayer("nasa")) map.removeLayer("nasa");
    if (map.getSource("nasa")) map.removeSource("nasa");

    map.addSource("nasa", {
      type: "raster",
      tiles: [nasaTileUrl(activeYear)],
      tileSize: 256,
    });

    map.addLayer({
      id: "nasa",
      type: "raster",
      source: "nasa",
      paint: { "raster-opacity": 0.65 },
    });

    markerRef.current?.setLngLat([lon, lat]);
  }, [lat, lon, activeYear]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    awayMarkerRef.current?.remove();
    awayMarkerRef.current = null;

    if (awayDest) {
      awayMarkerRef.current = new maplibregl.Marker({ color: "#2997ff" })
        .setLngLat([awayDest.lon, awayDest.lat])
        .setPopup(
          new maplibregl.Popup().setHTML(
            `<strong>Darker sky</strong><br/>~${awayDest.distanceKm} km ${awayDest.bearingLabel}`,
          ),
        )
        .addTo(map);
    }
  }, [awayDest]);

  return (
    <div className={styles.mapWrap}>
      <div className={styles.yearBadge}>{activeYear} · VIIRS Black Marble</div>
      {point && <div className={styles.bortleBadge}>Bortle {point.bortle}</div>}
      <div ref={containerRef} className={styles.map} />
    </div>
  );
}
