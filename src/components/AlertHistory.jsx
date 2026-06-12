import { useState } from "react";
import { motion } from "framer-motion";

const HISTORIC_ALERTS = [
  {
    id: 1,
    city: "Lahore",
    date: "Jun 10, 2026",
    type: "Heatwave Anomaly",
    score: 87,
    level: "HIGH",
    desc: "Surface temperature spiked to 43.2°C, registering +8.2°C above historical mid-averages. Highly unusual dry air dome over North-East Punjab.",
  },
  {
    id: 2,
    city: "Karachi",
    date: "Jun 08, 2026",
    type: "Humidity Saturation",
    score: 74,
    level: "MEDIUM",
    desc: "Relative humidity exceeded 88% during peak solar transit. Heat index reached critical threshold of 49°C. Minor coastal wind shear.",
  },
  {
    id: 3,
    city: "Islamabad",
    date: "Jun 03, 2026",
    type: "Pressure Dip Vortex",
    score: 62,
    level: "MEDIUM",
    desc: "Sudden atmospheric pressure drop of 14 hPa in 3 hours. Severe wind squalls up to 72 km/h detected at Margalla foothill sensors.",
  },
  {
    id: 4,
    city: "Quetta",
    date: "May 28, 2026",
    type: "Thermal Inversion",
    score: 91,
    level: "CRITICAL",
    desc: "Extreme night radiative cooling causing an unprecedented 16°C temperature drop in a single diurnal cycle. Frost danger flagged.",
  },
  {
    id: 5,
    city: "London",
    date: "May 22, 2026",
    type: "Jetstream Displacement",
    score: 55,
    level: "LOW",
    desc: "High-altitude jetstream displacement of 200km southwards, introducing cool maritime troughs and persistent rain.",
  },
];

export default function AlertHistory() {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const filtered = HISTORIC_ALERTS.filter((al) => {
    const matchFilter =
      filter === "ALL" ||
      (filter === "CRITICAL" && (al.level === "CRITICAL" || al.level === "HIGH")) ||
      (filter === "NORMAL" && al.level === "LOW") ||
      (filter === "MEDIUM" && al.level === "MEDIUM");
    
    const matchSearch =
      al.city.toLowerCase().includes(search.toLowerCase()) ||
      al.type.toLowerCase().includes(search.toLowerCase());

    return matchFilter && matchSearch;
  });

  const getAlertStyle = (level) => {
    switch (level) {
      case "CRITICAL":
        return "bg-rose-500/20 text-rose-400 border border-rose-500/30";
      case "HIGH":
        return "bg-error/20 text-error border border-error/30";
      case "MEDIUM":
        return "bg-tertiary/20 text-tertiary border border-tertiary/30";
      case "LOW":
      default:
        return "bg-secondary/20 text-secondary border border-secondary/30";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-[2rem] p-8 h-[calc(100vh-12rem)] flex flex-col gap-6"
    >
      {/* Header and filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-white" style={{ fontFamily: "Outfit" }}>
            Anomalous Alert Registry
          </h3>
          <p className="text-xs text-on-surface-variant">
            Historical log of extreme deviation events recorded by WeatherIQ AI.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="flex items-center bg-white/5 border border-white/10 focus-within:border-primary/50 rounded-xl px-3 py-1.5 w-full md:w-56 transition-all">
            <span className="material-symbols-outlined text-on-surface-variant text-sm mr-2">search</span>
            <input
              type="text"
              placeholder="Search by city or type..."
              className="bg-transparent border-none text-xs outline-none text-white w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter Chips */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
            {["ALL", "CRITICAL", "MEDIUM", "LOW"].map((fl) => (
              <button
                key={fl}
                onClick={() => setFilter(fl)}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  filter === fl
                    ? "bg-primary text-on-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {fl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {filtered.length > 0 ? (
          filtered.map((al, idx) => (
            <motion.div
              key={al.id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="bg-white/3 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all flex flex-col md:flex-row justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-bold text-white" style={{ fontFamily: "Outfit" }}>
                    {al.city}
                  </span>
                  <span className="text-xs text-on-surface-variant opacity-60">•</span>
                  <span className="text-xs text-on-surface-variant">{al.date}</span>
                  <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${getAlertStyle(al.level)}`}>
                    {al.level}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-tertiary" style={{ fontFamily: "Outfit" }}>
                  {al.type}
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {al.desc}
                </p>
              </div>

              {/* Anomaly Gauge */}
              <div className="flex items-center gap-3 self-center md:self-auto">
                <div className="text-right">
                  <p className="text-[9px] uppercase font-bold text-on-surface-variant">WeatherIQ Score</p>
                  <p className="text-2xl font-black text-white" style={{ fontFamily: "Outfit" }}>
                    {al.score}
                    <span className="text-xs text-on-surface-variant font-normal">/100</span>
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/3 relative overflow-hidden">
                  <div
                    className={`absolute bottom-0 w-full transition-all ${
                      al.score > 80 ? "bg-error" : al.score > 60 ? "bg-tertiary" : "bg-secondary"
                    }`}
                    style={{ height: `${al.score}%`, opacity: 0.2 }}
                  />
                  <span className="material-symbols-outlined text-sm text-white font-bold">
                    warning
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center text-on-surface-variant gap-2">
            <span className="material-symbols-outlined text-4xl">folder_off</span>
            <span className="text-sm font-bold">No active anomalies detected</span>
            <span className="text-xs opacity-60">Try modifying your search or filter values</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
