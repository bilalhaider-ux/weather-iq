// Lottie-style animated weather icons using pure CSS/SVG animations

export function SunIcon({ size = 80 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ overflow: "visible" }}
    >
      <style>{`
        @keyframes rotateSun {
          from { transform: rotate(0deg); transform-origin: 50px 50px; }
          to { transform: rotate(360deg); transform-origin: 50px 50px; }
        }
        @keyframes pulseSun {
          0%, 100% { r: 20; }
          50% { r: 22; }
        }
        @keyframes rayPulse {
          0%, 100% { opacity: 1; transform-origin: 50px 50px; transform: scale(1); }
          50% { opacity: 0.6; transform-origin: 50px 50px; transform: scale(1.1); }
        }
        .sun-rays { animation: rotateSun 15s linear infinite; }
        .sun-core { animation: pulseSun 2s ease-in-out infinite; }
      `}</style>
      <g className="sun-rays">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <line
            key={i}
            x1="50" y1="12" x2="50" y2="6"
            stroke="#ffb95f" strokeWidth="3.5" strokeLinecap="round"
            transform={`rotate(${angle} 50 50)`}
            style={{ animation: `rayPulse 2s ease-in-out ${i * 0.25}s infinite` }}
          />
        ))}
      </g>
      <circle cx="50" cy="50" r="20" fill="url(#sunGrad)" className="sun-core" />
      <defs>
        <radialGradient cx="50" cy="50" r="20" gradientUnits="userSpaceOnUse" id="sunGrad">
          <stop offset="0%" stopColor="#ffb95f"/>
          <stop offset="100%" stopColor="#ad6e00"/>
        </radialGradient>
      </defs>
    </svg>
  );
}

export function CloudIcon({ size = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 70">
      <style>{`
        @keyframes floatCloud {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(4px); }
        }
        .cloud-body { animation: floatCloud 3s ease-in-out infinite; }
      `}</style>
      <g className="cloud-body" fill="rgba(195,198,215,0.85)">
        <circle cx="30" cy="45" r="20" />
        <circle cx="50" cy="35" r="25" />
        <circle cx="70" cy="45" r="18" />
        <rect x="10" y="45" width="80" height="20" rx="5" />
      </g>
    </svg>
  );
}

export function RainIcon({ size = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <style>{`
        @keyframes rainDrop {
          0% { transform: translateY(0px); opacity: 1; }
          100% { transform: translateY(30px); opacity: 0; }
        }
        .drop1 { animation: rainDrop 1s ease-in 0s infinite; }
        .drop2 { animation: rainDrop 1s ease-in 0.3s infinite; }
        .drop3 { animation: rainDrop 1s ease-in 0.6s infinite; }
        .drop4 { animation: rainDrop 1s ease-in 0.15s infinite; }
        @keyframes floatCloud2 {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(3px); }
        }
        .rain-cloud { animation: floatCloud2 3s ease-in-out infinite; }
      `}</style>
      <g className="rain-cloud" fill="rgba(144,144,150,0.85)">
        <circle cx="30" cy="35" r="15" />
        <circle cx="48" cy="25" r="20" />
        <circle cx="66" cy="35" r="14" />
        <rect x="15" y="35" width="65" height="15" rx="5" />
      </g>
      <line x1="28" y1="58" x2="23" y2="72" stroke="#c3c0ff" strokeWidth="2.5" strokeLinecap="round" className="drop1" />
      <line x1="42" y1="58" x2="37" y2="72" stroke="#c3c0ff" strokeWidth="2.5" strokeLinecap="round" className="drop2" />
      <line x1="56" y1="58" x2="51" y2="72" stroke="#c3c0ff" strokeWidth="2.5" strokeLinecap="round" className="drop3" />
      <line x1="70" y1="58" x2="65" y2="72" stroke="#c3c0ff" strokeWidth="2.5" strokeLinecap="round" className="drop4" />
    </svg>
  );
}

export function StormIcon({ size = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <style>{`
        @keyframes rainDropFast {
          0% { transform: translateY(0px); opacity: 1; }
          100% { transform: translateY(30px); opacity: 0; }
        }
        @keyframes lightning {
          0%, 95%, 98%, 100% { opacity: 0; }
          96%, 97%, 99% { opacity: 1; }
        }
        .s-drop1 { animation: rainDropFast 0.8s ease-in 0s infinite; }
        .s-drop2 { animation: rainDropFast 0.8s ease-in 0.2s infinite; }
        .s-drop3 { animation: rainDropFast 0.8s ease-in 0.4s infinite; }
        .lightning-bolt { animation: lightning 4s ease-in-out infinite; transform-origin: 50px 50px; }
        .storm-cloud { animation: floatCloud2 2.5s ease-in-out infinite; }
      `}</style>
      <g className="storm-cloud" fill="rgba(80,80,90,0.9)">
        <circle cx="30" cy="35" r="15" />
        <circle cx="48" cy="25" r="20" />
        <circle cx="66" cy="35" r="14" />
        <rect x="15" y="35" width="65" height="15" rx="5" />
      </g>
      <path className="lightning-bolt" d="M48,48 L42,65 L50,65 L46,82 L58,60 L50,60 Z" fill="#ffb95f" filter="drop-shadow(0 0 4px #ffb95f)" />
      <line x1="25" y1="58" x2="20" y2="72" stroke="#c3c0ff" strokeWidth="2" strokeLinecap="round" className="s-drop1" />
      <line x1="38" y1="58" x2="33" y2="72" stroke="#c3c0ff" strokeWidth="2" strokeLinecap="round" className="s-drop2" />
      <line x1="68" y1="58" x2="63" y2="72" stroke="#c3c0ff" strokeWidth="2" strokeLinecap="round" className="s-drop3" />
    </svg>
  );
}

export function SnowIcon({ size = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <style>{`
        @keyframes snowfall {
          0% { transform: translateY(0px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(35px) rotate(360deg); opacity: 0; }
        }
        .flake1 { animation: snowfall 2s linear 0s infinite; }
        .flake2 { animation: snowfall 2.5s linear 0.5s infinite; }
        .flake3 { animation: snowfall 1.8s linear 1s infinite; }
      `}</style>
      <g fill="rgba(195,198,215,0.85)">
        <circle cx="30" cy="35" r="15" />
        <circle cx="48" cy="25" r="20" />
        <circle cx="66" cy="35" r="14" />
        <rect x="15" y="35" width="65" height="15" rx="5" />
      </g>
      <circle cx="30" cy="55" r="3" fill="#fff" className="flake1" />
      <circle cx="50" cy="62" r="2" fill="#fff" className="flake2" />
      <circle cx="68" cy="58" r="3" fill="#fff" className="flake3" />
    </svg>
  );
}

export function WeatherIcon({ condition, size = 60 }) {
  const cond = (condition || "").toLowerCase();
  if (cond.includes("clear") || cond.includes("sunny")) return <SunIcon size={size} />;
  if (cond.includes("rain") || cond.includes("drizzle") || cond.includes("shower")) return <RainIcon size={size} />;
  if (cond.includes("storm") || cond.includes("thunderstorm")) return <StormIcon size={size} />;
  if (cond.includes("snow") || cond.includes("ice") || cond.includes("icy")) return <SnowIcon size={size} />;
  return <CloudIcon size={size} />;
}
