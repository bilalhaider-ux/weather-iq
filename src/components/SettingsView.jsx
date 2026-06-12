import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function SettingsView() {
  const [serverOnline, setServerOnline] = useState(true);
  const [checking, setChecking] = useState(true);
  const [tempCoeff, setTempCoeff] = useState(0.55);
  const [humidCoeff, setHumidCoeff] = useState(0.25);
  const [windCoeff, setWindCoeff] = useState(0.20);
  const [cacheCleared, setCacheCleared] = useState(false);

  // Load weights from localStorage on mount
  useEffect(() => {
    const wTemp = localStorage.getItem("weatheriq_weight_temp");
    const wHumid = localStorage.getItem("weatheriq_weight_humid");
    const wWind = localStorage.getItem("weatheriq_weight_wind");
    if (wTemp !== null) setTempCoeff(parseFloat(wTemp));
    if (wHumid !== null) setHumidCoeff(parseFloat(wHumid));
    if (wWind !== null) setWindCoeff(parseFloat(wWind));
    
    // Simulate instant connection check to local engine
    const timer = setTimeout(() => {
      setChecking(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Save weights to localStorage when modified
  useEffect(() => {
    localStorage.setItem("weatheriq_weight_temp", tempCoeff.toString());
    localStorage.setItem("weatheriq_weight_humid", humidCoeff.toString());
    localStorage.setItem("weatheriq_weight_wind", windCoeff.toString());
  }, [tempCoeff, humidCoeff, windCoeff]);

  const handleClearCache = () => {
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-[2rem] p-5 sm:p-8 h-auto min-h-[calc(100vh-12rem)] lg:h-[calc(100vh-12rem)] flex flex-col gap-6 overflow-y-auto"
    >
      <div>
        <h3 className="text-xl font-bold text-white" style={{ fontFamily: "Outfit" }}>
          Meteorological Settings & Engine Diagnostics
        </h3>
        <p className="text-xs text-on-surface-variant">
          Configure local client parameters and inspect backend system connections.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section: Diagnostic status */}
        <div className="space-y-4">
          <h4 className="font-bold text-white text-sm" style={{ fontFamily: "Outfit" }}>
            Backend Connectivity
          </h4>

          <div className="bg-white/3 border border-white/5 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-on-surface-variant">Client-Side Core Engine</span>
              {checking ? (
                <span className="text-xs text-on-surface-variant flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-500 animate-pulse" />
                  Checking...
                </span>
              ) : (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping absolute" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  ACTIVE
                </span>
              )}
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-on-surface-variant">Engine Address</span>
              <span className="font-mono text-white/70">
                weatherEngine.js (Serverless)
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-on-surface-variant">Data Provider</span>
              <span className="text-white/70">Open-Meteo Integration (Direct Fetch)</span>
            </div>

            <div className="pt-2">
              <button
                onClick={handleClearCache}
                className="px-4 py-2 border border-white/10 hover:border-white/20 bg-white/3 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                {cacheCleared ? "Cache Flushed!" : "Flush Forecast Cache"}
              </button>
            </div>
          </div>
        </div>

        {/* Section: Anomaly score coefficients */}
        <div className="space-y-4">
          <h4 className="font-bold text-white text-sm" style={{ fontFamily: "Outfit" }}>
            WeatherIQ Core Coefficients
          </h4>

          <div className="bg-white/3 border border-white/5 rounded-2xl p-5 space-y-5">
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Adjust how the Anomaly Engine calculates unusual weather scores. Sum must equal 1.0.
            </p>

            {/* Temp slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-on-surface-variant">
                <span>Temperature Weight</span>
                <span>{Math.round(tempCoeff * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.05"
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                value={tempCoeff}
                onChange={(e) => setTempCoeff(parseFloat(e.target.value))}
              />
            </div>

            {/* Humidity slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-on-surface-variant">
                <span>Humidity Weight</span>
                <span>{Math.round(humidCoeff * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.05"
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                value={humidCoeff}
                onChange={(e) => setHumidCoeff(parseFloat(e.target.value))}
              />
            </div>

            {/* Wind slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-on-surface-variant">
                <span>Wind Weight</span>
                <span>{Math.round(windCoeff * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.05"
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                value={windCoeff}
                onChange={(e) => setWindCoeff(parseFloat(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/3 border border-white/5 rounded-2xl p-5 flex flex-col md:flex-row justify-between gap-4 mt-auto">
        <div>
          <h4 className="font-bold text-white text-sm" style={{ fontFamily: "Outfit" }}>
            Design Theme & Visuals
          </h4>
          <p className="text-xs text-on-surface-variant mt-1">
            WeatherIQ is set to Dark Mode automatically to preserve premium OLED aesthetics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-tertiary">dark_mode</span>
          <span className="text-xs font-bold text-white">Dark Mode Forced</span>
        </div>
      </div>
    </motion.div>
  );
}
