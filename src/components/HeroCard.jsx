import { motion } from "framer-motion";
import { WeatherIcon } from "./WeatherIcons";
import { useEffect, useState } from "react";

export default function HeroCard({ data, unit, onToggleUnit }) {
  const tempVal = unit === "C" ? Math.round(data.temperature) : Math.round(data.temperature * 9 / 5 + 32);
  const feelsLikeVal = unit === "C" ? Math.round(data.feels_like) : Math.round(data.feels_like * 9 / 5 + 32);

  // Formatted date/time
  const [localTime, setLocalTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = { weekday: "long", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
      setLocalTime(now.toLocaleDateString("en-PK", options).replace(",", " •"));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="glass-card rounded-[2rem] p-10 h-full relative group"
      style={{ boxShadow: "0 0 60px rgba(245,158,11,0.05)" }}
    >
      <div className="flex justify-between items-start mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-on-surface-variant text-sm">location_on</span>
            <h2 className="text-2xl font-bold text-on-surface" style={{ fontFamily: "Outfit" }}>
              {data.city}, {data.country}
            </h2>
          </div>
          <p className="text-sm text-on-surface-variant opacity-60">
            {localTime}
          </p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-full border border-white/10">
          <button
            onClick={() => onToggleUnit("C")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              unit === "C"
                ? "bg-primary text-on-primary"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            °C
          </button>
          <button
            onClick={() => onToggleUnit("F")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              unit === "F"
                ? "bg-primary text-on-primary"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            °F
          </button>
        </div>
      </div>

      <div className="flex items-center gap-12 mb-14">
        <div className="relative sun-glow">
          <WeatherIcon condition={data.condition_type} size={150} />
        </div>
        <div>
          <div className="flex items-start">
            <span className="font-black text-white tracking-tighter" style={{ fontSize: "90px", lineHeight: 1, fontFamily: "Outfit" }}>
              {tempVal}
            </span>
            <span className="text-4xl font-bold text-white/60 mt-4">°{unit}</span>
          </div>
          <div className="flex items-center gap-2 text-tertiary mt-2">
            <span className="material-symbols-outlined text-xl">
              {data.condition_type === "clear" ? "wb_sunny" : data.condition_type === "rain" ? "water_drop" : "cloud"}
            </span>
            <span className="text-lg font-semibold" style={{ fontFamily: "Outfit" }}>
              {data.condition}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
        <div className="space-y-1">
          <p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">Humidity</p>
          <p className="text-xl font-bold">{data.humidity}%</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">Wind Speed</p>
          <p className="text-xl font-bold">{data.wind_speed} km/h</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">Feels Like</p>
          <p className="text-xl font-bold">
            {feelsLikeVal}°{unit}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
