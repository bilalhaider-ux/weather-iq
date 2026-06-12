// WeatherIQ Meteorological Engine (Client-Side Serverless implementation)

const WMO_CONDITIONS = {
  0: ["Clear Sky", "clear"],
  1: ["Mainly Clear", "clear"],
  2: ["Partly Cloudy", "cloudy"],
  3: ["Overcast", "cloudy"],
  45: ["Foggy", "cloudy"],
  48: ["Icy Fog", "cloudy"],
  51: ["Light Drizzle", "rain"],
  53: ["Drizzle", "rain"],
  55: ["Heavy Drizzle", "rain"],
  61: ["Light Rain", "rain"],
  63: ["Rain", "rain"],
  65: ["Heavy Rain", "rain"],
  71: ["Light Snow", "snow"],
  73: ["Snow", "snow"],
  75: ["Heavy Snow", "snow"],
  80: ["Rain Showers", "rain"],
  81: ["Rain Showers", "rain"],
  82: ["Heavy Showers", "rain"],
  95: ["Thunderstorm", "storm"],
  96: ["Thunderstorm + Hail", "storm"],
  99: ["Heavy Thunderstorm", "storm"],
};

const CITIES = {
  "lahore":     { lat: 31.5204, lon: 74.3587, name: "Lahore",     country: "PK" },
  "karachi":    { lat: 24.8607, lon: 67.0011, name: "Karachi",    country: "PK" },
  "islamabad":  { lat: 33.6844, lon: 73.0479, name: "Islamabad",  country: "PK" },
  "peshawar":   { lat: 34.0151, lon: 71.5249, name: "Peshawar",   country: "PK" },
  "quetta":     { lat: 30.1798, lon: 66.9750, name: "Quetta",     country: "PK" },
  "multan":     { lat: 30.1575, lon: 71.5249, name: "Multan",     country: "PK" },
  "dubai":      { lat: 25.2048, lon: 55.2708, name: "Dubai",      country: "AE" },
  "london":     { lat: 51.5074, lon: -0.1278, name: "London",     country: "GB" },
  "new york":   { lat: 40.7128, lon: -74.0060, name: "New York",  country: "US" },
};

export async function getCityCoords(cityName) {
  const key = cityName.toLowerCase().trim();
  if (CITIES[key]) {
    return CITIES[key];
  }

  // Geocoding Fallback
  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
    const resp = await fetch(geoUrl);
    if (!resp.ok) return null;
    const data = await resp.json();
    if (!data.results || data.results.length === 0) return null;
    const result = data.results[0];
    return {
      lat: result.latitude,
      lon: result.longitude,
      name: result.name,
      country: result.country_code || "",
    };
  } catch (e) {
    console.error("Geocoding fetch failed", e);
    return null;
  }
}

function calculateAnomalyScore(temp, avgHigh, avgLow, humidity, wind, weights) {
  const mid = (avgHigh + avgLow) / 2;
  const deviation = Math.abs(temp - mid);

  const tempScore = Math.min(deviation * 10, 100);
  const humidScore = Math.abs(humidity - 50) * 1.4; // 50% humidity is normal
  const windScore = Math.min(wind * 2.5, 100);      // 40 km/h is highly unusual

  const wTemp = weights.temp !== undefined ? weights.temp : 0.55;
  const wHumid = weights.humid !== undefined ? weights.humid : 0.25;
  const wWind = weights.wind !== undefined ? weights.wind : 0.20;

  const total = (tempScore * wTemp) + (humidScore * wHumid) + (windScore * wWind);
  
  return {
    score: Math.round(Math.min(total, 100)),
    temperature: Math.round(Math.min(tempScore, 100)),
    humidity: Math.round(Math.min(humidScore, 100)),
    wind: Math.round(Math.min(windScore, 100)),
  };
}

function getLabel(score) {
  if (score >= 80) return "HIGHLY UNUSUAL";
  if (score >= 60) return "UNUSUAL";
  if (score >= 40) return "SLIGHTLY UNUSUAL";
  return "NORMAL";
}

function generateAIInsight(city, temp, deviation, humidity, wind, condition) {
  const parts = [];
  parts.push(`${city} is experiencing ${condition.toLowerCase()} conditions at ${temp}°C today.`);
  
  if (Math.abs(deviation) > 2.0) {
    const dirStr = deviation > 0 ? "above" : "below";
    parts.push(`This registers ${Math.abs(deviation)}°C ${dirStr} the weekly average.`);
  } else {
    parts.push("This aligns closely with the seasonal norm for this week.");
  }
  
  if (temp > 35) {
    parts.push("Elevated heat index poses a heat stress warning; prioritize hydration.");
  } else if (temp < 12) {
    parts.push("Radiative cooling under thin atmospheres will drop night temps sharply.");
  }
  
  if (humidity > 70) {
    parts.push("High relative humidity is creating muggy, saturated air columns.");
  } else if (humidity < 25) {
    parts.push("Dry atmospheric boundary layer detected, causing rapid moisture loss.");
  }
  
  if (wind > 18) {
    parts.push(`Blustery wind patterns at ${wind} km/h indicate localized isobaric gradients.`);
  }
  
  const cond = condition.toLowerCase();
  if (cond.includes("rain") || cond.includes("drizzle") || cond.includes("shower")) {
    parts.push("Precipitation cells will remain active. Monitor for localized water logging.");
  } else if (cond.includes("clear") || cond.includes("sunny") || cond.includes("mainly clear")) {
    parts.push("Clear skies permit intense solar radiation; peak UV index conditions.");
  } else {
    parts.push("Cloud decks will remain stable, maintaining flat thermal profiles.");
  }
  
  return parts.join(" ");
}

export async function fetchWeatherData(cityName, weights) {
  // 1. Get coords
  const coords = await getCityCoords(cityName);
  if (!coords) {
    throw new Error(`City '${cityName}' not found.`);
  }

  // 2. Fetch Open-Meteo forecast
  const { lat, lon } = coords;
  const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code,surface_pressure&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=7`;
  
  const response = await fetch(forecastUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch weather data for ${coords.name}`);
  }
  const raw = await response.json();

  const current = raw.current;
  const daily = raw.daily;

  const temp = current.temperature_2m;
  const humidity = current.relative_humidity_2m;
  const feels = current.apparent_temperature;
  const wind = current.wind_speed_10m;
  const code = current.weather_code;
  const pressure = current.surface_pressure;

  const [conditionName, conditionType] = WMO_CONDITIONS[code] || ["Cloudy", "cloudy"];

  // 3. Stats from forecast
  const highs = daily.temperature_2m_max;
  const lows = daily.temperature_2m_min;
  
  const sumHighs = highs.reduce((sum, val) => sum + val, 0);
  const weekAvg = Math.round((sumHighs / highs.length) * 10) / 10;
  
  const deviation = Math.round((temp - weekAvg) * 10) / 10;
  const trendStr = deviation > 0 ? "Rising" : deviation < 0 ? "Falling" : "Stable";

  // 4. Anomaly score
  const avgHigh = sumHighs / highs.length;
  const sumLows = lows.reduce((sum, val) => sum + val, 0);
  const avgLow = sumLows / lows.length;
  
  const iq = calculateAnomalyScore(temp, avgHigh, avgLow, humidity, wind, weights);

  // 5. Build 5-day forecast
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const forecast = [];
  const todayDate = new Date();
  
  for (let i = 0; i < 5; i++) {
    const d = new Date();
    d.setDate(todayDate.getDate() + i);
    const codeDaily = daily.weather_code[i];
    const [cName, cType] = WMO_CONDITIONS[codeDaily] || ["Clear", "clear"];
    
    forecast.push({
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: d.toISOString().split("T")[0],
      high: highs[i],
      low: lows[i],
      condition: cName,
      type: cType,
    });
  }

  // 6. Chart data (7 days)
  const chartData = [];
  for (let i = 0; i < Math.min(7, highs.length); i++) {
    const d = new Date();
    d.setDate(todayDate.getDate() + i);
    chartData.push({
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      high: highs[i],
      low: lows[i],
      avg: Math.round(((highs[i] + lows[i]) / 2) * 10) / 10,
    });
  }

  const aiInsight = generateAIInsight(coords.name, temp, deviation, humidity, wind, conditionName);

  return {
    city: coords.name,
    country: coords.country,
    temperature: temp,
    feels_like: feels,
    humidity: humidity,
    wind_speed: wind,
    pressure: pressure,
    condition: conditionName,
    condition_type: conditionType,
    ai_insight: aiInsight,
    stats: {
      week_average: weekAvg,
      deviation: deviation,
      trend: trendStr,
      forecast_window: "7-day",
    },
    weatheriq_score: {
      score: iq.score,
      label: getLabel(iq.score),
      temperature: iq.temperature,
      humidity: iq.humidity,
      wind: iq.wind,
    },
    forecast: forecast,
    chart_data: chartData,
  };
}
