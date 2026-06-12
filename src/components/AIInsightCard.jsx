import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AIInsightCard({ insight }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!insight) return;
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < insight.length) {
        const char = insight[i];
        if (char !== undefined) {
          setDisplayed((prev) => prev + char);
        }
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, 18);
    return () => clearInterval(interval);
  }, [insight]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-card ai-glow-border rounded-[1.5rem] p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
          auto_awesome
        </span>
        <h3 className="text-lg font-bold text-secondary" style={{ fontFamily: "Outfit" }}>
          AI Weather Analyst
        </h3>
      </div>
      <div className="min-h-[80px]">
        <p className="text-sm italic text-on-surface leading-relaxed">
          {displayed}
          {!done && <span className="typewriter-cursor">|</span>}
        </p>
      </div>
      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
        <span className="text-xs text-on-surface-variant flex items-center gap-2 bg-secondary/10 border border-secondary/20 rounded-full px-3 py-1.5">
          ✦ Powered by Gemini
        </span>
        <span className="material-symbols-outlined text-secondary text-sm">bolt</span>
      </div>
    </motion.div>
  );
}
