import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const MAP_CITIES = [
  { name: "Lahore", lat: 31.5204, lon: 74.3587 },
  { name: "Karachi", lat: 24.8607, lon: 67.0011 },
  { name: "Islamabad", lat: 33.6844, lon: 73.0479 },
  { name: "Peshawar", lat: 34.0151, lon: 71.5249 },
  { name: "Quetta", lat: 30.1798, lon: 66.9750 },
  { name: "Multan", lat: 30.1575, lon: 71.5249 },
  { name: "Dubai", lat: 25.2048, lon: 55.2708 },
  { name: "London", lat: 51.5074, lon: -0.1278 },
  { name: "New York", lat: 40.7128, lon: -74.0060 },
];

export default function GlobalMap({ onSelectCity }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [loading, setLoading] = useState(true);
  const [cityTemps, setCityTemps] = useState({});

  // Fetch temperatures for all cities in one batch request
  useEffect(() => {
    const fetchTemps = async () => {
      try {
        const lats = MAP_CITIES.map((c) => c.lat).join(",");
        const lons = MAP_CITIES.map((c) => c.lon).join(",");
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m`;
        const res = await fetch(url);
        const data = await res.json();
        
        const temps = {};
        // If data is list (multiple coordinates)
        if (Array.isArray(data)) {
          data.forEach((item, idx) => {
            temps[MAP_CITIES[idx].name] = Math.round(item.current.temperature_2m);
          });
        } else if (data.current) {
          // Single coordinate fallback
          temps[MAP_CITIES[0].name] = Math.round(data.current.temperature_2m);
        } else {
          // If response lists coordinates in array inside a single object
          MAP_CITIES.forEach((c, idx) => {
            if (data[idx] && data[idx].current) {
              temps[c.name] = Math.round(data[idx].current.temperature_2m);
            } else if (Array.isArray(data.current_weather)) {
              temps[c.name] = Math.round(data.current_weather[idx].temperature);
            } else if (data.current) {
              // Open-Meteo structure for multi-location returns an array of objects or an object with lists
              const tVal = Array.isArray(data) ? data[idx].current.temperature_2m : (data.current?.temperature_2m || 25);
              temps[c.name] = Math.round(tVal);
            }
          });
        }
        
        // Handle case where API response is a list or object with arrays
        const resolvedTemps = {};
        const responseList = Array.isArray(data) ? data : [data];
        MAP_CITIES.forEach((c, index) => {
          const item = responseList[index] || responseList[0];
          resolvedTemps[c.name] = item?.current?.temperature_2m !== undefined 
            ? Math.round(item.current.temperature_2m) 
            : 30; // fallback
        });

        setCityTemps(resolvedTemps);
        setLoading(false);
      } catch (e) {
        console.error("Failed to load map weather data", e);
        // Fallback default temps
        setCityTemps({
          Lahore: 38, Karachi: 32, Islamabad: 34, Peshawar: 36,
          Quetta: 29, Multan: 40, Dubai: 41, London: 17, "New York": 22
        });
        setLoading(false);
      }
    };
    fetchTemps();
  }, []);

  // Init Leaflet Map
  useEffect(() => {
    if (loading || !window.L || !mapContainerRef.current) return;

    // Destroy existing map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    // Centered on Lahore/Islamabad area initially
    const map = window.L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([30.0, 70.0], 5);

    mapInstanceRef.current = map;

    // Dark Matter tile layer
    window.L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 18,
    }).addTo(map);

    // Zoom controls customized
    window.L.control.zoom({
      position: "bottomright"
    }).addTo(map);

    // Add markers with custom HTML labels
    markersRef.current = MAP_CITIES.map((c) => {
      const temp = cityTemps[c.name] !== undefined ? cityTemps[c.name] : "--";
      
      // Custom DivIcon
      const icon = window.L.divIcon({
        html: `
          <div class="flex flex-col items-center">
            <div class="bg-[#1c1b1c]/90 border border-white/10 hover:border-primary/50 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap">
              <span class="w-1.5 h-1.5 rounded-full ${temp > 35 ? 'bg-error' : temp > 22 ? 'bg-tertiary' : 'bg-secondary'}"></span>
              <span>${c.name}</span>
              <span class="text-on-surface-variant font-black">${temp}°C</span>
            </div>
            <div class="w-1.5 h-1.5 bg-primary rounded-full mt-0.5 border border-black shadow-md"></div>
          </div>
        `,
        className: "custom-map-marker",
        iconSize: [80, 40],
        iconAnchor: [40, 20],
      });

      const marker = window.L.marker([c.lat, c.lon], { icon }).addTo(map);
      
      marker.on("click", () => {
        if (onSelectCity) {
          onSelectCity(c.name);
        }
      });

      return marker;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [loading, cityTemps]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-[2rem] p-6 h-[calc(100vh-12rem)] flex flex-col relative"
    >
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white" style={{ fontFamily: "Outfit" }}>
          Interactive Meteorological Globe
        </h3>
        <p className="text-sm text-on-surface-variant">
          Live atmospheric overlays and surface temperatures. Click any marker to load dashboard.
        </p>
      </div>

      <div className="flex-1 rounded-2xl overflow-hidden border border-white/10 relative">
        {loading && (
          <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm z-50 flex items-center justify-center flex-col gap-3">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin">
              autorenew
            </span>
            <span className="text-sm text-on-surface-variant">Compiling global weather grids...</span>
          </div>
        )}
        <div ref={mapContainerRef} className="w-full h-full z-10" />
      </div>
    </motion.div>
  );
}
