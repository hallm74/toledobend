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

function getMoonPhaseIcon(phase) {
    if (phase === 0 || phase === 1) return 'bi-moon'; // New Moon
    if (phase > 0 && phase <= 0.25) return 'bi-moon-stars'; // Waxing Crescent
    if (phase > 0.25 && phase <= 0.5) return 'bi-circle-half'; // First Quarter
    if (phase > 0.5 && phase <= 0.75) return 'bi-circle'; // Full Moon
    if (phase > 0.75 && phase < 1) return 'bi-moon-stars'; // Waning Crescent
    return 'bi-question-circle'; // Unknown
}

function getMoonPhaseTerminology(phase) {
    if (phase === 0 || phase === 1) return "New Moon";
    if (phase > 0 && phase <= 0.25) return "Waxing Crescent";
    if (phase > 0.25 && phase < 0.5) return "First Quarter"; // Edge case for 0.25 or transition to Waxing Gibbous
    if (phase === 0.5) return "Full Moon";
    if (phase > 0.5 && phase <= 0.75) return "Waning Gibbous";
    if (phase > 0.75 && phase < 1) return "Waning Crescent";
    return "Unknown Phase";
}

function getUVIndexDescriptor(uvIndex) {
    if (uvIndex >= 0 && uvIndex <= 2) return "Low";
    if (uvIndex >= 3 && uvIndex <= 5) return "Moderate";
    if (uvIndex >= 6 && uvIndex <= 7) return "High";
    if (uvIndex >= 8 && uvIndex <= 10) return "Very High";
    if (uvIndex >= 11) return "Extreme";
    return "Unknown";
}

function getPressureTrendIcon(currentPressure, previousPressure) {
    //console.log("Current Pressure:", currentPressure);
    //console.log("Previous Pressure:", previousPressure);
    if (currentPressure > previousPressure) {
        return "bi-arrow-up"; // Rising pressure
    } else if (currentPressure < previousPressure) {
        return "bi-arrow-down"; // Falling pressure
    } else {
        return "bi-dash"; // Stable pressure
    }
}

function populateWeatherAlerts(alerts) {
    const alertsSection = document.getElementById("alerts-section");
    const alertContainer = document.getElementById("weather-alerts");

    // Clear previous content
    alertContainer.innerHTML = "";

    if (!alerts || alerts.length === 0) {
        // Hide the alerts section if no alerts exist
        alertsSection?.classList.add("d-none");
        return;
    }

    // Remove the "d-none" class to make alerts section visible
    alertsSection?.classList.remove("d-none");

    // Populate alerts
    alerts.forEach((alert) => {
        const alertCard = document.createElement("div");
        alertCard.className = "card mb-3 border-danger";
        alertCard.innerHTML = `
            <div class="card-header bg-danger text-white">
                <h5 class="mb-0">${alert.event}</h5>
                <small>From: ${alert.sender}</small>
            </div>
            <div class="card-body">
                <p><strong>Time:</strong> ${alert.start} - ${alert.end}</p>
                <p>${alert.description}</p>
            </div>
        `;
        alertContainer.appendChild(alertCard);
    });
}

// Fetch barometric pressure history
async function getPressureHistory() {
    try {
        const response = await fetch('./barometricPressureHistory.json');
        const history = await response.json();
        return history;
    } catch (error) {
        //console.error('Error fetching pressure history:', error);
        return [];
    }
}

async function updatePressureDisplay() {
    const history = await getPressureHistory();
    //console.log("Pressure History:", history);

    if (history.length > 0) {
        const currentPressure = history[history.length - 1]; // Last entry in the array
        const previousPressure = history.length > 1 ? history[history.length - 2] : null; // Second-to-last entry if exists

        //console.log("Current Pressure:", currentPressure);
        //console.log("Previous Pressure:", previousPressure);

        let trendIcon = "bi-question-circle"; // Default icon if no trend can be calculated
        if (previousPressure !== null) {
            trendIcon = getPressureTrendIcon(currentPressure, previousPressure);
        }

        const pressureElement = document.getElementById("pressure");
        pressureElement.innerHTML = `<strong>Barometric Pressure:</strong> ${currentPressure} mb <i class="bi ${trendIcon}"></i>`;
    } else {
        console.warn("No pressure history available.");
    }
}

// Example usage
const uvIndex = 6.5; // Replace with actual UV Index value
//console.log(`UV Index: ${uvIndex}, Descriptor: ${getUVIndexDescriptor(uvIndex)}`); // Output: UV Index: 6.5, Descriptor: High

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

    // Populate Weather Alerts
    if (data.weatherAlerts && data.weatherAlerts.length > 0) {
            populateWeatherAlerts(data.weatherAlerts);
            } else {
                console.log("No weather alerts found.");
            }

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
    document.getElementById("humidity").innerHTML = `<strong>Humidity:</strong> ${weatherData.humidity || "Unavailable"} %`;
    document.getElementById("uvi").innerHTML = `<strong>UV Index:</strong> ${getUVIndexDescriptor(weatherData.uv_index)} (${weatherData.uv_index != null ? weatherData.uv_index : "Unavailable"})`;
    updatePressureDisplay(weatherData.pressure);
    
    // Update Moon Phase with Icon and Terminology
    const moonPhase = weatherData.moon_phase || "Unavailable";
    if (moonPhase !== "Unavailable") {
        const moonIcon = getMoonPhaseIcon(moonPhase);
            document.getElementById("moon_phase").innerHTML = `<i class="bi ${moonIcon} me-2"></i><strong>Moon Phase:</strong> ${getMoonPhaseTerminology(moonPhase)} (${moonPhase})`;
    } else {
        document.getElementById("moon_phase").innerHTML = `<strong>Moon Phase:</strong> Unavailable`;
    }

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
                    <p class="mb-1"><i class="bi bi-droplet-half"></i> <strong>Humidty:</strong> ${day.humidity || "No Data"} %</p>
                    <p class="mb-1"><i class="bi bi-sun"></i> <strong>UV Index:</strong> ${getUVIndexDescriptor(day.uv_index)} ${day.uv_index || "No Data"} </p>
                    <p class="mb-1"><i class="bi bi-speedometer"></i> <strong>Barametric Pressure:</strong> ${day.pressure || "No Data"} mb</p>
                    <p class="mb-1"><i class="bi ${getMoonPhaseIcon(day.moon_phase)}"></i> <strong>Moon Phase:</strong> ${getMoonPhaseTerminology(day.moon_phase)} (${day.moon_phase})</p>
                </div>
            </div>
        `;

        forecastContainer.appendChild(forecastCard);
    });
}