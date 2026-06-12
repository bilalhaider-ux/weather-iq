# 🌦️ WeatherIQ AI — Meteorological Anomaly Intelligence

**WeatherIQ AI** is a premium, high-fidelity weather intelligence dashboard. Unlike generic weather apps that merely present raw metrics, WeatherIQ evaluates live atmospheric coordinates against 7-day historical forecast averages to calculate a custom **Atmospheric Anomaly Score (0-100)** and generates contextual AI Analyst summaries.

Live Demo: *(Deploy to Vercel and paste your URL here)*  
Developer Portfolio: [Bilal Haider on LinkedIn](https://www.linkedin.com/in/bilal-haider-ds/)

---

## 🚀 Key Features

1. **Meteorological Scoring Engine**: 
   - Evaluates deviation metrics of temperatures, humidity ranges, and wind speeds against weekly averages.
   - Outputs a live dynamic **WeatherIQ Anomaly Score** categorized into: `NORMAL`, `SLIGHTLY UNUSUAL`, `UNUSUAL`, and `HIGHLY UNUSUAL`.
2. **AI Weather Analyst**:
   - Generates contextual summaries of atmospheric columns (typewriter loading animation).
   - Signals heat stresses, UV indexes, dry boundary layers, and convective precipitation indicators.
3. **Interactive Dark Globe (Leaflet)**:
   - Customized CartoDB Dark Matter base map layer.
   - Batches temperature points from multiple regional nodes with responsive action triggers.
4. **Convective Scenario Simulator**:
   - Model localized weather phenomena: *Extreme Heatwave*, *Monsoon Cloudburst*, and *Polar Cool Trough*.
   - Renders animated isobar geopotential curves on grid layers.
5. **Score Tuning Diagnostics**:
   - Dynamically sliders to fine-tune weights for Temperature, Humidity, and Wind coefficients.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 (Glassmorphic variables, dark mode forced)
- **Animation**: Framer Motion (page entries, simulator sliders, and state transitions)
- **Charts**: Recharts (smooth area curves for regional temperature flows)
- **Maps**: Leaflet JS (custom HTML markers)
- **Data Source**: Open-Meteo REST API (100% serverless client-side fetching)

---

## 📦 Local Setup Instructions

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/bilalhaider-ux/weather-iq.git
   cd weather-iq
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

---

## 🚢 Vercel Deployment (Step-by-Step)

Since the entire application runs serverless on the client side, you can deploy it to Vercel in just a few clicks without setting up a backend:

1. Create a free account on [Vercel](https://vercel.com).
2. Connect your GitHub account.
3. Click **Add New** > **Project** and select your `weather-iq` repository.
4. Keep the default build settings (`npm run build` as Build Command and `dist` as Output Directory).
5. Click **Deploy**!

---

## 👨‍💻 Author

- **Name**: Bilal Haider
- **LinkedIn**: [bilal-haider-ds](https://www.linkedin.com/in/bilal-haider-ds/)
- **Email**: bilalhaider4911@gmail.com
- **GitHub**: [bilalhaider-ux](https://github.com/bilalhaider-ux)

*Feel free to reach out for collaboration, project availability, or questions!*
