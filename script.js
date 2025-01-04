function getWeatherIcon(description, dayOrNight) {
    const desc = description.toLowerCase();
    if (desc.includes('clear')) return dayOrNight === 'night' ? 'bi-moon' : 'bi-sun';
    if (desc.includes('cloud')) return dayOrNight === 'night' ? 'bi-cloud-moon' : 'bi-cloud-sun';
    if (desc.includes('rain')) return dayOrNight === 'night' ? 'bi-cloud-moon-rain' : 'bi-cloud-rain';
    if (desc.includes('snow')) return 'bi-cloud-snow';
    if (desc.includes('thunderstorm')) return 'bi-cloud-lightning';
    return 'bi-question-circle';
}

function getCardinalDirection(deg) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
}

function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const isDarkMode = body.classList.contains('dark-mode');
    body.classList.toggle('dark-mode', !isDarkMode);
    body.classList.toggle('light-mode', isDarkMode);
    themeToggle.innerHTML = isDarkMode 
      ? '<i class="bi bi-moon"></i>' 
      : '<i class="bi bi-sun"></i>';
}

if (typeof data !== "undefined") {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const dayOrNight = data.currentWeather.dayOrNight || "day";

    // Apply initial theme and icon
    body.classList.add(dayOrNight === "night" ? "dark-mode" : "light-mode");
    themeToggle.innerHTML = dayOrNight === "night" 
      ? '<i class="bi bi-sun"></i>' 
      : '<i class="bi bi-moon"></i>';

    themeToggle.addEventListener('click', toggleTheme);

    // Populate Lake Level
    document.getElementById("lake-level").textContent = data.lakeLevel || "Unavailable";

    // Populate Weather Data
    const weatherData = data.currentWeather || {};
    const dynamicWeatherIcon = document.getElementById("dynamic-weather-icon");
    dynamicWeatherIcon.classList.add(getWeatherIcon(weatherData.description || "", dayOrNight));

    document.getElementById("current-temp").innerHTML = `<strong>Current Temp:</strong> ${weatherData.temp || "Unavailable"} °F`;
    document.getElementById("feels-like").innerHTML = `<strong>Feels Like:</strong> ${weatherData.feels_like || "Unavailable"} °F`;
    document.getElementById("description").innerHTML = `<strong>Description:</strong> ${weatherData.description || "Unavailable"}`;
    document.getElementById("wind-speed").innerHTML = `<strong>Wind Speed:</strong> ${weatherData.wind_speed || "Unavailable"} mph`;

    const windDeg = weatherData.wind_deg || "Unavailable";
    if (windDeg !== "Unavailable") {
        document.getElementById("wind-deg").innerHTML = `<strong>Wind Direction:</strong> ${windDeg}° (${getCardinalDirection(windDeg)})`;
    } else {
        document.getElementById("wind-deg").innerHTML = `<strong>Wind Direction:</strong> Unavailable`;
    }

    document.getElementById("wind-gust").innerHTML = `<strong>Wind Gust:</strong> ${weatherData.gust || "Unavailable"} mph`;
    document.getElementById("sunrise").innerHTML = `<strong>Sunrise:</strong> ${weatherData.sunrise || "Unavailable"}`;
    document.getElementById("sunset").innerHTML = `<strong>Sunset:</strong> ${weatherData.sunset || "Unavailable"}`;

    // Populate Fishing Report
    const fishingReport = data.fishingReport || {};
    document.getElementById("fishing-report-date").textContent = fishingReport.date || "No date available";
    document.getElementById("fishing-report-text").textContent = fishingReport.report || "No report available.";

    // Populate 5-Day Weather Forecast
    const fiveDayForecast = data.fiveDayWeather || [];
    const forecastContainer = document.getElementById("five-day-forecast");
    forecastContainer.innerHTML = ""; // Clear existing content

    fiveDayForecast.forEach(day => {
        const forecastCard = document.createElement("div");
        forecastCard.className = "col-12 col-sm-6 col-md-12";

        forecastCard.innerHTML = `
            <div class="card shadow">
                <div class="card-header text-center bg-primary text-white">
                    <h5 class="mb-0">${day.date}</h5>
                </div>
                <div class="card-body text-center">
                    <i class="bi ${getWeatherIcon(day.description, "day")} fs-1"></i>
                    <p class="mb-2"><strong>Description:</strong> ${day.description}</p>
                    <p class="mb-1"><i class="bi bi-thermometer-high"></i> <strong>High:</strong> ${day.high} °F</p>
                    <p class="mb-1"><i class="bi bi-thermometer-low"></i> <strong>Low:</strong> ${day.low} °F</p>
                    <p class="mb-1"><i class="bi bi-wind"></i> <strong>Wind:</strong> ${day.wind_speed} mph (${getCardinalDirection(day.wind_deg)})</p>
                    <p class="mb-1"><i class="bi bi-water"></i> <strong>Gust:</strong> ${day.gust || "No Data"} mph</p>
                </div>
            </div>
        `;

        forecastContainer.appendChild(forecastCard);
    });
}