import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label, unit }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1c1b1c] border border-white/10 rounded-lg p-3 shadow-xl backdrop-blur-md">
        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">{label}</p>
        <div className="space-y-1">
          <p className="text-sm font-black text-tertiary">
            High: {payload[0].value}°{unit}
          </p>
          {payload[1] && (
            <p className="text-sm font-black text-secondary">
              Low: {payload[1].value}°{unit}
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export default function TempChart({ chartData, unit }) {
  // Convert chartData based on unit
  const converted = chartData.map((d) => ({
    day: d.day,
    high: unit === "C" ? Math.round(d.high) : Math.round(d.high * 9 / 5 + 32),
    low: unit === "C" ? Math.round(d.low) : Math.round(d.low * 9 / 5 + 32),
    avg: unit === "C" ? Math.round(d.avg) : Math.round(d.avg * 9 / 5 + 32),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-[2rem] p-6 relative overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h4 className="text-lg font-bold text-white" style={{ fontFamily: "Outfit" }}>
            Regional Temperature Flow
          </h4>
          <p className="text-xs text-on-surface-variant">Real-time AI Atmospheric Interpolation</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_#ffb95f]"></div>
            <span className="text-[10px] uppercase font-bold text-on-surface-variant">Surface Max</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#c3c0ff]"></div>
            <span className="text-[10px] uppercase font-bold text-on-surface-variant">Stratosphere Min</span>
          </div>
        </div>
      </div>

      <div className="w-full h-44 min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart data={converted} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGradientHigh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffb95f" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ffb95f" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="chartGradientLow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c3c0ff" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#c3c0ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: "bold" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}°`}
            />
            <Tooltip content={<CustomTooltip unit={unit} />} cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="high"
              stroke="#ffb95f"
              strokeWidth={2.5}
              fill="url(#chartGradientHigh)"
              dot={{ fill: "#ffb95f", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: "#ffddb8", stroke: "#ffb95f", strokeWidth: 2 }}
              animationDuration={1500}
            />
            <Area
              type="monotone"
              dataKey="low"
              stroke="#c3c0ff"
              strokeWidth={2}
              fill="url(#chartGradientLow)"
              dot={{ fill: "#c3c0ff", strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, fill: "#e2dfff", stroke: "#c3c0ff", strokeWidth: 1.5 }}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
