import { motion } from "framer-motion";
import { WeatherIcon } from "./WeatherIcons";

export default function ForecastStrip({ forecast, unit }) {
  return (
    <div className="space-y-4 w-full">
      <h3 className="text-xl font-bold text-on-surface" style={{ fontFamily: "Outfit" }}>
        5-Day Forecast
      </h3>
      <div className="flex md:grid md:grid-cols-5 overflow-x-auto md:overflow-x-visible pb-3 md:pb-0 gap-4 snap-x scrollbar-none">
        {forecast.map((day, i) => {
          const high = unit === "C" ? Math.round(day.high) : Math.round(day.high * 9 / 5 + 32);
          const low = unit === "C" ? Math.round(day.low) : Math.round(day.low * 9 / 5 + 32);
          
          return (
            <motion.div
              key={day.day + i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ scale: 1.05 }}
              className="glass-card p-5 rounded-2xl text-center flex flex-col items-center gap-3 hover:border-primary/40 transition-all cursor-pointer snap-start flex-shrink-0 w-[125px] md:w-auto"
            >
              <span className="text-xs font-black text-on-surface-variant uppercase tracking-widest">
                {day.day}
              </span>
              <div className="flex items-center justify-center h-12">
                <WeatherIcon condition={day.type} size={48} />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white">{high}°</span>
                <span className="text-on-surface-variant text-xs">{low}°</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
