import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SCENARIOS = [
  {
    id: "heatwave",
    name: "Extreme Heatwave Anomaly",
    icon: "solar_power",
    color: "text-error border-error/30 bg-error/10",
    desc: "A massive high-pressure heat dome stalling over Central Asia, driving temperatures 8-10°C above seasonal norms.",
    impacts: [
      "Lahore peak temp projection: 47.5°C (+8.5°C anomaly)",
      "Karachi Heat Index: 52°C due to high humidity",
      "Power grid load factor: Critical (98% capacity)",
      "Severe dehydration warning active across Punjab",
    ],
    prediction: "Expect maximum severity between June 18 - June 22. Highly stable descending air masses will suppress any cloud formation, leading to maximum solar insulation. Coastal sea breezes in Karachi will be blocked by continental wind vectors.",
  },
  {
    id: "monsoon",
    name: "Monsoon Cloudburst Vortex",
    icon: "thunderstorm",
    color: "text-secondary border-secondary/30 bg-secondary/10",
    desc: "Deep low-pressure monsoon trough migrating from Bay of Bengal, colliding with dry western wind columns.",
    impacts: [
      "Peshawar/Islamabad precipitation projection: 150mm in 12 hours",
      "Flash flooding probability: Extremely High (92%)",
      "Wind shear vectors: Up to 65 km/h gusts",
      "Drainage overflow threat in low-lying sectors",
    ],
    prediction: "Vortex formation detected at 700 hPa level. Atmospheric moisture content is at maximum saturation. Intense convective updrafts will trigger severe thunderstorms, hail, and high lightning frequency beginning June 15.",
  },
  {
    id: "cool_trough",
    name: "Sudden Polar Cool Trough",
    icon: "ac_unit",
    color: "text-blue-400 border-blue-400/30 bg-blue-400/10",
    desc: "A deep atmospheric trough moving south from Siberia, causing a sudden cooling wave and gusty wind currents.",
    impacts: [
      "Quetta/Peshawar temp drop: -12°C within 6 hours",
      "Gale force winds: 55 km/h sustained",
      "Snowfall in elevated ranges above 2,500m",
      "Sudden agricultural frost hazard warning",
    ],
    prediction: "Rapid isobar compression will drive strong wind currents. High radiative heat loss during nights will push minimum temps to record lows for this month. Gradual warming cycle starts after 4 days.",
  },
];

export default function AIPredictions() {
  const [activeScenario, setActiveScenario] = useState(SCENARIOS[0]);
  const [simulating, setSimulating] = useState(false);
  const [progress, setProgress] = useState(0);

  const startSimulation = () => {
    setSimulating(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setSimulating(false);
          return 100;
        }
        return prev + 4;
      });
    }, 50);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-12 gap-6 min-h-[calc(100vh-12rem)] h-auto md:h-[calc(100vh-12rem)]"
    >
      {/* Left panel: Scenario selector */}
      <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
        <div className="glass-card rounded-[2rem] p-6 flex flex-col gap-4 h-auto md:h-full">
          <div>
            <h3 className="text-xl font-bold text-white" style={{ fontFamily: "Outfit" }}>
              AI Scenario Simulator
            </h3>
            <p className="text-xs text-on-surface-variant mt-1">
              Analyze hypothetical extreme weather formations.
            </p>
          </div>

          <div className="flex-1 flex flex-col gap-3">
            {SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                onClick={() => {
                  setActiveScenario(sc);
                  setProgress(0);
                }}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                  activeScenario.id === sc.id
                    ? "bg-white/5 border-primary shadow-lg"
                    : "bg-transparent border-white/5 hover:border-white/10 hover:bg-white/3"
                }`}
              >
                <span className="material-symbols-outlined text-tertiary mt-0.5">{sc.icon}</span>
                <div>
                  <h4 className="font-bold text-sm text-white" style={{ fontFamily: "Outfit" }}>
                    {sc.name}
                  </h4>
                  <p className="text-xs text-on-surface-variant line-clamp-2 mt-1">
                    {sc.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={startSimulation}
            disabled={simulating}
            className="w-full py-3.5 bg-primary text-on-primary rounded-xl font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">
              {simulating ? "autorenew" : "science"}
            </span>
            <span>{simulating ? "Computing Models..." : "Run AI Simulation"}</span>
          </button>
        </div>
      </div>

      {/* Right panel: Simulation analysis */}
      <div className="col-span-12 md:col-span-8 h-auto md:h-full">
        <div className="glass-card rounded-[2rem] p-5 sm:p-8 h-auto md:h-full flex flex-col gap-6 relative">
          <AnimatePresence mode="wait">
            {simulating ? (
              <motion.div
                key="simulating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center gap-4 text-center"
              >
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  <span className="text-sm font-black text-primary" style={{ fontFamily: "Outfit" }}>
                    {progress}%
                  </span>
                </div>
                <h4 className="font-bold text-white text-lg">Interpolating Isobar Gradients...</h4>
                <p className="text-xs text-on-surface-variant max-w-sm">
                  Running Gemini meteorological predictions, calculating thermodynamic indices, and convective cloud vectors.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="analysis"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col gap-6 overflow-y-visible md:overflow-y-auto"
              >
                {/* Scenario Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full border ${activeScenario.color}`}>
                      Predictive Model Active
                    </span>
                    <h3 className="text-2xl font-black text-white mt-3" style={{ fontFamily: "Outfit" }}>
                      {activeScenario.name}
                    </h3>
                  </div>
                  <span className="material-symbols-outlined text-secondary text-3xl">psychology</span>
                </div>

                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {activeScenario.desc}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Projected Impacts */}
                  <div className="bg-white/3 border border-white/5 rounded-2xl p-5">
                    <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-error">warning</span>
                      Projected Anomalous Impacts
                    </h4>
                    <ul className="space-y-2.5">
                      {activeScenario.impacts.map((im, i) => (
                        <li key={i} className="text-xs text-on-surface-variant flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>{im}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Gemini AI Reasoning */}
                  <div className="bg-white/3 border border-white/5 rounded-2xl p-5">
                    <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-secondary">auto_awesome</span>
                      Gemini Atmospheric Reasoning
                    </h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed italic">
                      &ldquo;{activeScenario.prediction}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Simulated Chart Placeholder / Wind Flow Vector */}
                <div className="bg-white/3 border border-white/5 rounded-2xl p-5 flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-white text-xs">Simulated Isobaric Flow Forecast</h4>
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant">500 hPa Geopotential</span>
                  </div>
                  <div className="flex-1 flex items-center justify-around gap-2 min-h-[100px] border-b border-white/5 pb-4">
                    {[12, 18, 24, 32, 28, 15, 10, 16, 22, 34, 40, 36, 25, 18, 12].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-2">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${h * 2}px` }}
                          transition={{ duration: 0.8, delay: i * 0.03 }}
                          className={`w-full rounded-t-sm ${
                            activeScenario.id === "heatwave"
                              ? "bg-error/70"
                              : activeScenario.id === "monsoon"
                              ? "bg-secondary/70"
                              : "bg-blue-400/70"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[8px] font-bold text-on-surface-variant uppercase tracking-widest mt-2">
                    <span>T-0h</span>
                    <span>T-24h</span>
                    <span>T-48h</span>
                    <span>T-72h</span>
                    <span>T-96h</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
