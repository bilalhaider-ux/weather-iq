export const mockWeatherData = {
  city: "Lahore",
  country: "PK",
  condition: "clear", // clear | cloudy | rain | night
  temperature: 38,
  feelsLike: 42,
  humidity: 28,
  windSpeed: 12,
  description: "Clear Sky",
  stats: {
    weeklyMean: 33,
    deviation: +5,
    trend: "rising", // rising | falling | stable
  },
  aiInsight:
    "Lahore is sitting at 38°C today — about 5°C above this week's average and the warmest day in the current forecast window. Temperatures have been climbing steadily since Monday. Expect a gradual cooldown starting Thursday as a trough moves in from the northwest.",
  forecast: [
    { day: "Mon", condition: "clear", high: 38, low: 28 },
    { day: "Tue", condition: "cloudy", high: 35, low: 26 },
    { day: "Wed", condition: "rain", high: 29, low: 22 },
    { day: "Thu", condition: "cloudy", high: 31, low: 24 },
    { day: "Fri", condition: "clear", high: 36, low: 27 },
  ],
  chartData: [
    { day: "Mon", temp: 38 },
    { day: "Tue", temp: 35 },
    { day: "Wed", temp: 29 },
    { day: "Thu", temp: 31 },
    { day: "Fri", temp: 36 },
  ],
  recentCities: ["Karachi", "Islamabad", "Dubai"],
  weatherIQScore: {
    score: 87,
    label: "Highly Unusual",
    breakdown: {
      temperature: 91, // z-score contribution
      humidity: 72,
      wind: 45,
    },
  },
};
