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

    await updateForecastInfo(city);
    showDisplaySection(weatherInfoSection);
}

async function updateForecastInfo(city) {
    const forecastData = await getFetchData("forecast", city);

    const timeTaken = '12:00:00';
    const todayDate = new Date().toISOString().split('T')[0];

    // get tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];

    forecastInfoSection.innerHTML = "";

    const tomorrowForecast = forecastData.list.find(forecastWeather => 
        forecastWeather.dt_txt.includes(timeTaken) && 
        forecastWeather.dt_txt.includes(tomorrowDate)  // match tomorrow specifically
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