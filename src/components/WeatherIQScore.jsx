import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Get badge styles based on score label
function getBadgeStyle(label) {
  const lbl = (label || "").toUpperCase();
  if (lbl.includes("HIGH")) {
    return "bg-error/20 text-error border border-error/30";
  }
  if (lbl.includes("SLIGHT")) {
    return "bg-secondary/20 text-secondary border border-secondary/30";
  }
  if (lbl.includes("UNUSUAL")) {
    return "bg-tertiary/20 text-tertiary border border-tertiary/30";
  }
  return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
}

export default function WeatherIQScore({ scoreData }) {
  const { score, label, temperature, humidity, wind } = scoreData;

  // Animated states
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let frame = 0;
    const totalFrames = 50;
    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setDisplayScore(Math.round(score * eased));
      if (frame >= totalFrames) clearInterval(interval);
    }, 16);
    return () => clearInterval(interval);
  }, [score]);

  // Needle angle for the semi-circle gauge:
  // Starts at -90deg (score 0) and ends at 90deg (score 100).
  const needleRotation = -90 + (displayScore / 100) * 180;

  // Stroke dasharray calculations for progress indicator
  // Arc length of a semi-circle of radius 40 is pi * 40 ≈ 125.6
  const arcLength = 125.6;
  const strokeDashoffset = arcLength - (displayScore / 100) * arcLength;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-[1.5rem] p-6"
      style={{
        boxShadow: "0 0 30px rgba(245,158,11,0.05)",
        borderColor: "rgba(245,158,11,0.15)",
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
          <span>⚡</span> WeatherIQ Score
        </h3>
        <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${getBadgeStyle(label)}`}>
          {label}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 sm:gap-0 mb-6">
        {/* Semi-circle Gauge */}
        <div className="relative w-44 h-24">
          <svg className="w-full overflow-visible" viewBox="0 0 100 50">
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffb95f" />
                <stop offset="100%" stopColor="#EF4444" />
              </linearGradient>
            </defs>

            {/* Background Track */}
            <path
              d="M10,50 A40,40 0 0,1 90,50"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeLinecap="round"
              strokeWidth="8"
            />

            {/* Active Progress */}
            <path
              d="M10,50 A40,40 0 0,1 90,50"
              fill="none"
              stroke="url(#scoreGrad)"
              strokeDasharray={arcLength}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              strokeWidth="8"
              style={{ transition: "stroke-dashoffset 0.1s linear" }}
            />

            {/* Needle */}
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="14"
              stroke="#e5e2e3"
              strokeLinecap="round"
              strokeWidth="2.5"
              transform={`rotate(${needleRotation}, 50, 50)`}
            />

            {/* Needle Center Pin */}
            <circle cx="50" cy="50" r="2" fill="#e5e2e3" />
          </svg>

          {/* Text Indicators */}
          <div className="absolute bottom-[-16px] left-1/2 -translate-x-1/2 text-center">
            <span className="text-3xl font-black text-white" style={{ fontFamily: "Outfit" }}>
              {displayScore}
            </span>
            <span className="text-on-surface-variant text-sm">/100</span>
          </div>
        </div>

        {/* Score Breakdown Bars */}
        <div className="flex flex-col gap-3 w-full max-w-[14rem] sm:w-36">
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] uppercase font-bold text-on-surface-variant">
              <span>Temperature</span>
              <span className="text-error">{temperature}</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${temperature}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-full bg-error rounded-full"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] uppercase font-bold text-on-surface-variant">
              <span>Humidity</span>
              <span className="text-secondary">{humidity}</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${humidity}%` }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                className="h-full bg-secondary rounded-full"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] uppercase font-bold text-on-surface-variant">
              <span>Wind</span>
              <span className="text-tertiary">{wind}</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${wind}%` }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.6 }}
                className="h-full bg-tertiary rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
