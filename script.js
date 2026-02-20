const app = document.getElementById("main-container");
const temp = document.getElementById("temp-txt");
const dateOutput = document.querySelector(".current-date-txt");
const timeOutput = document.querySelector(".current-time-txt");
const conditionOutput = document.querySelector(".condition-txt");
const countryOutput = document.querySelector(".country-txt");
const icon = document.querySelector(".weather-summary-img");
const humidityOutput = document.querySelector(".humidity-info");
const windOutput = document.querySelector(".wind-info");

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const liveBtn = document.getElementById("live-btn");

const apiKey = 'ab0d89de83cdef966b49b7c18923291b';

searchBtn.addEventListener("click", () => {
    let cityValue = cityInput.value;
    if (cityValue.trim() != "") {
        updateWeatherInfo(cityValue)
        cityValue = "";
    } else if (cityValue.length == 0) {
        alert("Please enter a city name");
        console.log("Please enter a city name");
    }
});

cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        let cityValue = cityInput.value;
        if (cityValue.trim() != "") {
            updateWeatherInfo(cityValue)
            cityValue = "";
        }
    }
});           

async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(apiUrl);
    return response.json();
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData("weather", city);
    
    if (weatherData.cod != 200) {
        showDisplayError()
        return
    }
    console.log(weatherData);
}
