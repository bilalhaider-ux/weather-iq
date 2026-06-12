import { motion } from "framer-motion";

export default function StatsCard({ stats, unit }) {
  const avgVal = unit === "C" ? Math.round(stats.week_average) : Math.round(stats.week_average * 9 / 5 + 32);
  const devVal = unit === "C" ? Math.round(stats.deviation) : Math.round(stats.deviation * 9 / 5);

  const getDeviationColor = (val) => {
    if (val > 0) return "text-error";
    if (val < 0) return "text-secondary";
    return "text-emerald-400";
  };

  const getTrendIcon = (trend) => {
    const t = (trend || "").toLowerCase();
    if (t === "rising") return "↑ Rising";
    if (t === "falling") return "↓ Falling";
    return "→ Stable";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-[1.5rem] p-6"
    >
      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="text-lg font-bold" style={{ fontFamily: "Outfit" }}>📊 Statistical Context</h3>
          <p className="text-xs text-on-surface-variant mt-0.5">Week Average Deviation</p>
        </div>
        <span className={`font-bold text-lg ${getDeviationColor(devVal)}`}>
          {devVal > 0 ? "+" : ""}{devVal}°{unit}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/3 border border-white/6 rounded-xl p-3">
          <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wide">Week's Avg</p>
          <p className="text-xl font-black text-tertiary mt-1" style={{ fontFamily: "Outfit" }}>
            {avgVal}°{unit}
          </p>
        </div>
        <div className="bg-white/3 border border-white/6 rounded-xl p-3">
          <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wide">Deviation</p>
          <p className={`text-xl font-black mt-1 ${getDeviationColor(devVal)}`} style={{ fontFamily: "Outfit" }}>
            {devVal > 0 ? "+" : ""}{devVal}°{unit}
          </p>
        </div>
        <div className="bg-white/3 border border-white/6 rounded-xl p-3">
          <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wide">Trend</p>
          <p className="text-xl font-black text-tertiary mt-1" style={{ fontFamily: "Outfit" }}>
            {getTrendIcon(stats.trend)}
          </p>
        </div>
        <div className="bg-white/3 border border-white/6 rounded-xl p-3">
          <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wide">Window</p>
          <p className="text-sm font-bold text-on-surface-variant mt-1" style={{ fontFamily: "Outfit" }}>
            {stats.forecast_window || "7-day"} / 40 pts
          </p>
        </div>
      </div>
    </motion.div>
  );
}
