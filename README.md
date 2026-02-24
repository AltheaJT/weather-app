# Weather App

A clean, responsive weather application that displays real-time weather conditions, forecasts, and dynamic backgrounds based on current weather data.

## Features

-  **City Search** — Search weather by city name
-  **Live Location** — Get weather for your current location via geolocation
-  **Current Conditions** — Displays temperature, humidity, wind speed, and weather description
-  **Date & Time** — Shows the local date and time of the searched city (not your device's time)
-  **Tomorrow's Forecast** — Displays tomorrow's high and low temperature with a weather icon
-  **Dynamic Backgrounds** — Background gradient changes based on weather conditions (clear, rain, snow, etc.)
-  **OpenWeather Icons** — Live weather icons pulled directly from the OpenWeather CDN

## Tech Stack

- **HTML5**
- **CSS3** — Flexbox, gradients, transitions
- **Vanilla JavaScript** — Async/await, Fetch API, Geolocation API
- **OpenWeather API** — Current weather and 5-day forecast data
- **Font Awesome** — UI icons

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/weather-app.git
cd weather-app
```

### 2. Get an API key
Sign up at [openweathermap.org](https://openweathermap.org) and generate a free API key.

### 3. Add your API key
In `script.js`, replace the placeholder with your key:
```javascript
const apiKey = 'YOUR_API_KEY_HERE';
```

### 4. Run the app
Open `index.html` in your browser — no build tools or dependencies required.

## Project Structure

```
weather-app/
├── index.html
├── style.css
├── script.js
└── assets/
    ├── weather/
    │   ├── clear.svg
    │   ├── clouds.svg
    │   └── ...
    └── message/
        ├── search-city.png
        └── not-found.png
```

## API Usage

This project uses two OpenWeather endpoints:

| Endpoint | Purpose |
|----------|---------|
| `api.openweathermap.org/data/2.5/weather` | Current weather by city or coordinates |
| `api.openweathermap.org/data/2.5/forecast` | 5-day forecast for tomorrow's data |

## Weather Backgrounds

The background gradient updates dynamically based on the OpenWeather condition ID:

| Condition | ID Range |
|-----------|----------|
| Thunderstorm | 200–299 |
| Drizzle | 300–399 |
| Rain | 500–599 |
| Snow | 600–699 |
| Atmosphere (fog, haze) | 700–799 |
| Clear | 800 |
| Clouds | 801–804 |

## Known Limitations

- Free OpenWeather API tier has a rate limit of 60 calls/minute
- Forecast min/max temps are based on the 12:00:00 UTC forecast entry for the next day
- Geolocation requires the user to grant browser location permissions

## License

MIT
