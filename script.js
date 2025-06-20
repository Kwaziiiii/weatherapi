// Replace with your OpenWeatherMap API key
const apiKey = 'YOUR_API_KEY_HERE';

const weatherContainer = document.getElementById("weather");
const city = document.getElementById("city");
const error = document.getElementById("error");

const units = 'metric'; // 'metric' for °C or 'imperial' for °F
const temperatureSymbol = units === 'imperial' ? "°F" : "°C";

// Fetch weather for user inputted city
async function fetchWeather() {
    try {
        weatherContainer.innerHTML = '';
        error.innerHTML = '';
        city.innerHTML = '';

        const cityInputtedByUser = document.getElementById('cityInput').value;
        if (!cityInputtedByUser.trim()) {
            error.innerHTML = `Please enter a city name.`;
            return;
        }

        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInputtedByUser}&appid=${apiKey}&units=${units}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.cod === '400' || data.cod === '404') {
            error.innerHTML = `Not a valid city. Please input another city.`;
            return;
        }

        city.innerHTML = `Hourly Weather for ${data.city.name}`;

        data.list.forEach(hourlyWeatherData => {
            const hourlyWeatherDataDiv = createWeatherDescription(hourlyWeatherData);
            weatherContainer.appendChild(hourlyWeatherDataDiv);
        });

    } catch (err) {
        console.error(err);
        error.innerHTML = "Error fetching weather data. Try again later.";
    }
}

function convertToLocalTime(dt) {
    const date = new Date(dt * 1000);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours() % 12 || 12).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const period = date.getHours() >= 12 ? 'PM' : 'AM';

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${period}`;
}

function createWeatherDescription(weatherData) {
    const { main, dt } = weatherData;
    const description = document.createElement("div");
    const convertedDateAndTime = convertToLocalTime(dt);

    description.className = "weather_description";
    description.innerHTML = `
        ${main.temp}${temperatureSymbol} - ${convertedDateAndTime.substring(10)} - ${convertedDateAndTime.substring(5, 10)}
    `;
    return description;
}

// Capital cities weather scroll
const capitalCities = [
    { name: "London", country: "UK" },
    { name: "Tokyo", country: "Japan" },
    { name: "Paris", country: "France" },
    { name: "Washington", country: "USA" },
    { name: "Canberra", country: "Australia" },
    { name: "Ottawa", country: "Canada" },
    { name: "Brasília", country: "Brazil" },
    { name: "Beijing", country: "China" },
];

async function fetchCapitalWeather() {
    const capitalContainer = document.getElementById("capitalWeather");
    capitalContainer.innerHTML = '';

    for (let city of capitalCities) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=${apiKey}&units=${units}`;

        try {
            const res = await fetch(url);
            const data = await res.json();

            if (data.cod === 200) {
                const card = document.createElement("div");
                card.className = "capital-card";

                card.innerHTML = `
                    <h4>${city.name}, ${city.country}</h4>
                    <p>🌡️ ${data.main.temp}${temperatureSymbol}</p>
                    <p>🌤️ ${data.weather[0].description}</p>
                `;

                capitalContainer.appendChild(card);
            }
        } catch (err) {
            console.error(`Error fetching weather for ${city.name}:`, err);
        }
    }
}

// Static calendar-style upcoming events
function loadWeatherEvents() {
    const events = [
        { date: "2025-06-23", location: "New Delhi", event: "🔥 Heatwave Alert (42°C)" },
        { date: "2025-06-25", location: "Bangkok", event: "🌧️ Heavy Rain Forecast" },
        { date: "2025-06-27", location: "New York", event: "⛈️ Thunderstorms Expected" },
        { date: "2025-06-28", location: "Moscow", event: "❄️ Unusually Cold Weather (10°C)" },
        { date: "2025-06-29", location: "Lagos", event: "🌊 Flood Warning" },
    ];

    const calendar = document.getElementById("weatherEvents");
    calendar.innerHTML = '';

    events.forEach(e => {
        const eventDiv = document.createElement("div");
        eventDiv.className = "calendar-event";
        eventDiv.innerHTML = `
            <h4>${e.date}</h4>
            <p>📍 ${e.location}</p>
            <p>📢 ${e.event}</p>
        `;
        calendar.appendChild(eventDiv);
    });
}

// Run these when page loads
window.onload = () => {
    fetchCapitalWeather();
    loadWeatherEvents();
};
