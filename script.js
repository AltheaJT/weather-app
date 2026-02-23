const app = document.getElementById("main-container");
const tempOutput = document.getElementById("temp-txt");
const dateOutput = document.querySelector(".current-date-txt");
const timeOutput = document.querySelector(".current-time-txt");
const conditionOutput = document.querySelector(".condition-txt");
const countryOutput = document.querySelector(".country-txt");
const weatherIcon = document.querySelector(".weather-summary-img");
const humidityOutput = document.querySelector(".humidity-info");
const windOutput = document.querySelector(".wind-info");

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const liveBtn = document.getElementById("live-btn");
const notFoundSection = document.querySelector(".not-found");
const searchCitySection = document.querySelector(".search-city");
const weatherInfoSection = document.querySelector(".weather-info");
const forecastInfoSection = document.querySelector(".forecast-info");

const apiKey = 'ab0d89de83cdef966b49b7c18923291b';

searchBtn.addEventListener("click", () => {
    let cityValue = cityInput.value;
    if (cityValue.trim() != "") {
        updateWeatherInfo(cityValue)
        cityValue = "";
        cityInput.blur();
    } else if (cityValue.length == 0) {
        alert("Please enter a city name");
        console.log("Please enter a city name");
    }
});

cityInput.addEventListener('keydown', (event) => {
    if (event.key == "Enter" && cityInput.value.trim() != "") {
        let cityValue = cityInput.value;
        updateWeatherInfo(cityValue)
        cityValue = "";
        cityInput.blur();
    }
});           

async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(apiUrl);
    return response.json();
}

function getCurrentDate(timezoneOffset) {
    const now = new Date();
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const cityDate = new Date(utcMs + timezoneOffset * 1000);
    const options = {
        weekday: "long",
        day: "2-digit",
        month: "short",
    }
    return cityDate.toLocaleDateString("en-GB", options);
}

function getCurrentTime(timezoneOffset) {
    const now = new Date();
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const cityTime = new Date(utcMs + timezoneOffset * 1000);
    const options = {
        hour: "2-digit",
        minute: "2-digit",
    }
    return cityTime.toLocaleTimeString("en-GB", options);
}

const weatherGradients = {
    thunderstorm: "linear-gradient(105deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    drizzle:      "linear-gradient(105deg, #89a4c7 0%, #a8c0d6 50%, #c9d8e8 100%)",
    rain:         "linear-gradient(105deg, #4a6fa5 0%, #6b8cba 50%, #89a4c7 100%)",
    snow:         "linear-gradient(105deg, #e8f0f7 0%, #d6e4f0 50%, #c9d8e8 100%)",
    atmosphere:   "linear-gradient(105deg, #b8b8b8 0%, #d0d0d0 50%, #e8e8e8 100%)",
    clear:        "linear-gradient(105deg, #f7d86e 0%, #f4a444 50%, #f07030 100%)",
    clouds:       "linear-gradient(105deg, #bad1fa 0%, #ecddd4 50%, #FFE2B0 100%)",
}

function getWeatherGradient(id) {
    if (id >= 200 && id < 300) return weatherGradients.thunderstorm;
    if (id >= 300 && id < 400) return weatherGradients.drizzle;
    if (id >= 500 && id < 600) return weatherGradients.rain;
    if (id >= 600 && id < 700) return weatherGradients.snow;
    if (id >= 700 && id < 800) return weatherGradients.atmosphere;
    if (id === 800)             return weatherGradients.clear;
    if (id > 800)               return weatherGradients.clouds;
}

function applyGradient(id) {
    const gradient = getWeatherGradient(id);
    document.body.style.background = gradient;
    app.style.background = gradient;
}


async function updateWeatherInfo(city) {
    const weatherData = await getFetchData("weather", city);
    
    if (weatherData.cod != 200) {
        showDisplaySection(notFoundSection)
        return
    }

    const {
        name: country,
        main: { temp, humidity },
        weather: [{id, description, icon}],
        wind: {speed},
        timezone
    } = weatherData;

    countryOutput.textContent = country;
    tempOutput.textContent = `${Math.round(temp)}°C`;
    conditionOutput.textContent = description;
    humidityOutput.textContent = `Humidity: ${humidity}%`;
    windOutput.textContent = `Wind: ${speed} m/s`;

    dateOutput.textContent = getCurrentDate(timezone);
    timeOutput.textContent = getCurrentTime(timezone);
    weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@4x.png`;

    applyGradient(id);
    await updateForecastInfo(city);
    showDisplaySection(weatherInfoSection);
}

async function updateForecastInfo(city) {
    const forecastData = await getFetchData("forecast", city);

    const timeTaken = '12:00:00';

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];

    forecastInfoSection.innerHTML = "";

    const tomorrowForecast = forecastData.list.find(forecastWeather => 
        forecastWeather.dt_txt.includes(timeTaken) && 
        forecastWeather.dt_txt.includes(tomorrowDate) 
    );

    if (tomorrowForecast) {
        updateForecastItem(tomorrowForecast);
    }
}

function updateForecastItem(weatherData) {
    const {  
        main: {temp}, 
        weather: [{icon}] 
    } = weatherData;   

    const forecastItem = `
        <p class="forecast-txt">Tomorrow's Weather</p>
        <img src="https://openweathermap.org/img/wn/${icon}@4x.png" class="forecast-img">
        <h5 class="temp-txt">
            <span class="forecast-temp">${Math.round(temp)}°C |</span>
            <span>15&deg;C</span>
        </h5>
    `
    forecastInfoSection.innerHTML = forecastItem;

}

function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notFoundSection]
        .forEach(section => section.style.display = "none");

    section.style.display = "flex";
}