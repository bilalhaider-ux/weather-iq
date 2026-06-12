import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroCard from "./components/HeroCard";
import WeatherIQScore from "./components/WeatherIQScore";
import AIInsightCard from "./components/AIInsightCard";
import StatsCard from "./components/StatsCard";
import ForecastStrip from "./components/ForecastStrip";
import TempChart from "./components/TempChart";
import GlobalMap from "./components/GlobalMap";
import AIPredictions from "./components/AIPredictions";
import AlertHistory from "./components/AlertHistory";
import SettingsView from "./components/SettingsView";
import { fetchWeatherData } from "./utils/weatherEngine";

export default function App() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentCity, setCurrentCity] = useState("Lahore");
  const [unit, setUnit] = useState("C");
  const [liveClock, setLiveClock] = useState("");
  const [showProModal, setShowProModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Update live clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const t = now.toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" });
      const d = now.toLocaleDateString("en-PK", { weekday: "short", day: "numeric", month: "short" });
      setLiveClock(`${t} · ${d}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch weather data from client-side engine (calling Open-Meteo directly)
  const fetchWeather = async (city) => {
    setLoading(true);
    setError(null);
    try {
      // Load user-defined weights from settings (localStorage)
      const wTemp = localStorage.getItem("weatheriq_weight_temp");
      const wHumid = localStorage.getItem("weatheriq_weight_humid");
      const wWind = localStorage.getItem("weatheriq_weight_wind");
      const weights = {
        temp: wTemp !== null ? parseFloat(wTemp) : 0.55,
        humid: wHumid !== null ? parseFloat(wHumid) : 0.25,
        wind: wWind !== null ? parseFloat(wWind) : 0.20,
      };

      const data = await fetchWeatherData(city, weights);
      setWeatherData(data);
      setCurrentCity(data.city);
    } catch (e) {
      setError(e.message || "Failed to establish link to the meteorological server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(currentCity);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchWeather(searchQuery.trim());
      setSearchQuery("");
      setActiveTab("Dashboard");
    }
  };

  const handleSync = () => {
    fetchWeather(currentCity);
  };

  return (
    <div className="min-h-screen bg-[#0e0e0f] text-[#e5e2e3] font-sans selection:bg-primary selection:text-on-primary">
      {/* Sidebar Navigation */}
      <aside className="h-screen w-64 fixed left-0 top-0 flex flex-col p-8 border-r border-white/10 bg-[#131314]/30 backdrop-blur-xl shadow-2xl z-50">
        <div className="mb-12">
          <h1 className="text-3xl font-black text-primary tracking-tight cursor-pointer" style={{ fontFamily: "Outfit" }} onClick={() => { setActiveTab("Dashboard"); }}>
            WeatherIQ
          </h1>
          <p className="text-sm text-on-surface-variant opacity-70 mt-1">AI Analyst Active</p>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: "Dashboard", label: "Dashboard", icon: "dashboard" },
            { id: "Global Maps", label: "Global Maps", icon: "map" },
            { id: "AI Predictions", label: "AI Predictions", icon: "psychology" },
            { id: "Alert History", label: "Alert History", icon: "warning" },
            { id: "Settings", label: "Settings", icon: "settings" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "text-primary bg-secondary-container/20 border border-white/5"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
              }`}
            >
              <span
                className="material-symbols-outlined text-lg"
                style={{
                  fontVariationSettings: activeTab === tab.id ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-4">
          <button
            onClick={() => setShowProModal(true)}
            className="w-full py-3 bg-secondary-container text-on-secondary-container rounded-xl font-bold text-sm hover:opacity-90 transition-opacity cursor-pointer shadow-lg shadow-secondary-container/20"
          >
            Upgrade to Pro
          </button>
          <div className="pt-4 border-t border-white/10 space-y-2">
            <a
              onClick={(e) => { e.preventDefault(); setShowSupportModal(true); }}
              className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:text-on-surface text-sm transition-all"
              href="#"
            >
              <span className="material-symbols-outlined text-lg">help</span>
              <span>Support</span>
            </a>
          </div>
        </div>
      </aside>

      {/* Top Navbar */}
      <header className="fixed top-0 right-0 left-64 h-16 flex justify-between items-center px-8 bg-[#131314]/10 backdrop-blur-md border-b border-white/10 z-40">
        <div className="flex items-center gap-8">
          <span className="text-xl font-black text-primary cursor-pointer" style={{ fontFamily: "Outfit" }} onClick={() => setActiveTab("Dashboard")}>
            WeatherIQ AI
          </span>
          
          {/* Quick search input */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center bg-white/5 border border-white/10 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 rounded-full px-4 py-1.5 transition-all w-80">
            <span className="material-symbols-outlined text-on-surface-variant mr-2 text-lg">search</span>
            <input
              type="text"
              placeholder="Search city (e.g. London, Karachi)..."
              className="bg-transparent border-none text-sm outline-none text-on-surface placeholder:text-on-surface-variant/40 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-sm text-on-surface-variant font-medium bg-white/5 border border-white/10 rounded-full px-4 py-2 hidden sm:block">
            {liveClock}
          </div>
          <button
            onClick={handleSync}
            disabled={loading}
            className="bg-primary hover:bg-primary-fixed-dim px-4 py-2 rounded-lg text-on-primary text-sm font-bold opacity-90 hover:opacity-100 hover:scale-[1.02] transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-sm ${loading ? 'animate-spin' : ''}`}>
              sync
            </span>
            <span>Run AI Sync</span>
          </button>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="ml-64 mt-16 p-8 min-h-[calc(100vh-4rem)]">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-[calc(100vh-12rem)] w-full flex flex-col items-center justify-center gap-3 text-center"
            >
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
              </div>
              <p className="text-sm text-on-surface-variant" style={{ fontFamily: "Outfit" }}>
                Analyzing atmospheric data columns...
              </p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="h-[calc(100vh-12rem)] w-full flex flex-col items-center justify-center gap-4 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-error/10 border border-error/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-error text-3xl">error</span>
              </div>
              <div className="space-y-1 max-w-md">
                <h4 className="font-bold text-white text-lg" style={{ fontFamily: "Outfit" }}>
                  Connection Failed
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {error}
                </p>
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => fetchWeather(currentCity)}
                  className="bg-primary text-on-primary px-5 py-2.5 rounded-lg text-xs font-bold hover:opacity-90 transition-all cursor-pointer"
                >
                  Retry Connection
                </button>
                <button
                  onClick={() => {
                    setCurrentCity("Lahore");
                    fetchWeather("Lahore");
                  }}
                  className="border border-white/10 bg-white/3 text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:border-white/20 transition-all cursor-pointer"
                >
                  Reset to Lahore
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {activeTab === "Dashboard" && weatherData && (
                <>
                  <div className="grid grid-cols-12 gap-6">
                    {/* Left Hero Card */}
                    <section className="col-span-12 lg:col-span-7">
                      <HeroCard data={weatherData} unit={unit} onToggleUnit={setUnit} />
                    </section>

                    {/* Right column with Score, Analyst, Stats */}
                    <section className="col-span-12 lg:col-span-5 space-y-6">
                      <WeatherIQScore scoreData={weatherData.weatheriq_score} />
                      <AIInsightCard insight={weatherData.ai_insight} />
                      <StatsCard stats={weatherData.stats} unit={unit} />
                    </section>
                  </div>

                  {/* Forecast Strip */}
                  <ForecastStrip forecast={weatherData.forecast} unit={unit} />

                  {/* Temp Chart */}
                  <TempChart chartData={weatherData.chart_data} unit={unit} />
                </>
              )}

              {activeTab === "Global Maps" && (
                <GlobalMap
                  onSelectCity={(city) => {
                    setCurrentCity(city);
                    fetchWeather(city);
                    setActiveTab("Dashboard");
                  }}
                />
              )}

              {activeTab === "AI Predictions" && <AIPredictions />}

              {activeTab === "Alert History" && <AlertHistory />}

              {activeTab === "Settings" && <SettingsView />}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-on-surface-variant/60">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span>Made with ⚡ by <a href="https://github.com/bilalhaider-ux" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-white font-bold transition-all">Bilal Haider</a></span>
            <span className="text-on-surface-variant/30 hidden sm:inline">•</span>
            <span className="text-tertiary font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[10px] animate-pulse">work</span>
              Available for projects & collaboration!
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/bilalhaider-ux"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-all flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">code</span>
              <span>GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/bilal-haider-ds/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-all flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">link</span>
              <span>LinkedIn</span>
            </a>
            <a
              href="mailto:bilalhaider4911@gmail.com"
              className="hover:text-white transition-all flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">mail</span>
              <span>Email</span>
            </a>
          </div>
        </footer>
      </main>

      {/* Upgrade to Pro Modal */}
      <AnimatePresence>
        {showProModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0e0e0f]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowProModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="glass-card ai-glow-border max-w-sm w-full rounded-[2rem] p-8 text-center space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-secondary text-3xl animate-pulse">star</span>
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-white font-display" style={{ fontFamily: "Outfit" }}>
                  Premium Account
                </h4>
                <p className="text-xs text-on-surface-variant/80 leading-relaxed">
                  This feature will be available soon! We are compiling custom ML forecasting models for Pro members.
                </p>
              </div>
              <button
                onClick={() => setShowProModal(false)}
                className="w-full py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:opacity-90 transition-all cursor-pointer"
              >
                Acknowledge
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Support Modal */}
      <AnimatePresence>
        {showSupportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0e0e0f]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSupportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="glass-card rounded-[2rem] max-w-lg w-full p-8 space-y-6 relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              style={{ boxShadow: "0 0 50px rgba(195,192,255,0.05)" }}
            >
              <button
                onClick={() => setShowSupportModal(false)}
                className="absolute top-6 right-6 text-on-surface-variant hover:text-white cursor-pointer border-none bg-transparent"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-secondary px-2.5 py-1 bg-secondary/10 border border-secondary/20 rounded-full">
                  Project Concept
                </span>
                <h3 className="text-2xl font-black text-white" style={{ fontFamily: "Outfit" }}>
                  About WeatherIQ AI
                </h3>
              </div>

              <div className="space-y-4 text-xs text-on-surface-variant/80 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
                <p>
                  <strong>WeatherIQ</strong> is a state-of-the-art meteorological intelligence tool.
                  Traditional weather applications only display current temps; WeatherIQ calculates an
                  <strong> Atmospheric Anomaly Index (0-100)</strong> using localized algorithms that evaluate deviation
                  margins from seasonal norms.
                </p>

                <div className="bg-white/3 border border-white/5 rounded-xl p-4 space-y-2">
                  <h5 className="font-bold text-white text-xs flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-tertiary">science</span>
                    Calculations Engine
                  </h5>
                  <p>
                    By pulling raw grids from the Open-Meteo API, our backend calculates standard deviation thresholds.
                    If wind gusts, relative humidity, or temperatures spike sharply beyond the 7-day average, the anomaly index shifts, triggering predictive alerts.
                  </p>
                </div>

                <p>
                  Developed with ⚡ by <strong>Bilal Haider</strong>, WeatherIQ stands as a showcase of combining Django REST framework calculations with highly fluid React client environments.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <a
                  href="https://github.com/bilalhaider-ux"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 border border-white/10 bg-white/3 hover:border-white/20 text-white rounded-xl text-xs font-bold text-center transition-all"
                >
                  Developer Portfolio
                </a>
                <button
                  onClick={() => setShowSupportModal(false)}
                  className="flex-1 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:opacity-90 transition-all cursor-pointer"
                >
                  Close Diagnostics
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
