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
    if (typeof deg !== 'number' || isNaN(deg)) return 'Unknown';
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(((deg % 360) + 360) % 360 / 45) % 8;
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
    if (typeof phase !== 'number' || isNaN(phase)) return "Unknown Phase";
    
    if (phase === 0 || phase === 1) return "New Moon";
    if (phase > 0 && phase < 0.25) return "Waxing Crescent";
    if (phase === 0.25) return "First Quarter";
    if (phase > 0.25 && phase < 0.5) return "Waxing Gibbous";
    if (phase === 0.5) return "Full Moon";
    if (phase > 0.5 && phase < 0.75) return "Waning Gibbous";
    if (phase === 0.75) return "Last Quarter";
    if (phase > 0.75 && phase < 1) return "Waning Crescent";
    return "Unknown Phase";
}

function getUVIndexDescriptor(uvIndex) {
    if (typeof uvIndex !== 'number' || isNaN(uvIndex)) return "Unknown";
    
    // UV index cannot be negative
    if (uvIndex < 0) return "Invalid";
    
    if (uvIndex <= 2) return "Low";
    if (uvIndex <= 5) return "Moderate";
    if (uvIndex <= 7) return "High";
    if (uvIndex <= 10) return "Very High";
    return "Extreme";
}

function getPressureTrendIcon(currentPressure, previousPressure) {
    if (typeof currentPressure !== 'number' || typeof previousPressure !== 'number' || 
        isNaN(currentPressure) || isNaN(previousPressure)) {
        return "bi-question-circle";
    }

    const PRESSURE_THRESHOLD = 0.5; // mb threshold for significant change
    const difference = currentPressure - previousPressure;

    if (Math.abs(difference) <= PRESSURE_THRESHOLD) {
        return "bi-dash"; // Stable pressure
    }
    return difference > 0 ? "bi-arrow-up" : "bi-arrow-down";
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function populateWeatherAlerts(alerts) {
    const alertsSection = document.getElementById("alerts-section");
    const alertContainer = document.getElementById("weather-alerts");

    if (!alertsSection || !alertContainer) {
        console.error("Weather alerts elements not found");
        return;
    }

    // Clear previous content safely
    while (alertContainer.firstChild) {
        alertContainer.removeChild(alertContainer.firstChild);
    }

    if (!Array.isArray(alerts) || alerts.length === 0) {
        alertsSection.classList.add("d-none");
        return;
    }

    alertsSection.classList.remove("d-none");
    alertsSection.setAttribute("aria-label", "Weather Alerts Section");

    alerts.forEach((alert, index) => {
        if (!alert || typeof alert !== 'object') return;

        const alertCard = document.createElement("div");
        alertCard.className = "card mb-3 border-danger";
        alertCard.setAttribute("role", "alert");
        alertCard.setAttribute("aria-labelledby", `alert-heading-${index}`);

        const header = document.createElement("div");
        header.className = "card-header bg-danger text-white";

        const title = document.createElement("h5");
        title.className = "mb-0";
        title.id = `alert-heading-${index}`;
        title.textContent = alert.event || "Weather Alert";

        const source = document.createElement("small");
        source.textContent = alert.sender ? `From: ${alert.sender}` : "";

        const body = document.createElement("div");
        body.className = "card-body";

        const time = document.createElement("p");
        time.innerHTML = `<strong>Time:</strong> ${escapeHtml(alert.start || "")} - ${escapeHtml(alert.end || "")}`;

        const description = document.createElement("p");
        description.textContent = alert.description || "No description available";

        header.appendChild(title);
        header.appendChild(source);
        body.appendChild(time);
        body.appendChild(description);
        alertCard.appendChild(header);
        alertCard.appendChild(body);

        alertContainer.appendChild(alertCard);
    });
}

async function getPressureHistory() {
    if (typeof data !== "undefined" && Array.isArray(data.barometricPressureHistory)) {
        return data.barometricPressureHistory;
    } else {
        console.error("Barometric pressure history not found in data.js or invalid format");
        return [];
    }
}

function convertMbToInHg(mb) {
    if (typeof mb !== 'number' || isNaN(mb)) {
        return 'Unavailable';
    }
    return (mb * 0.02953).toFixed(2); // Convert and round to 2 decimal places
}

function convertVisibility(visibilityInMeters, format = "mi") {
    if (typeof visibilityInMeters !== 'number' || isNaN(visibilityInMeters)) {
        return "Unavailable";
    }

    if (format === "km") {
        const visibilityInKilometers = (visibilityInMeters / 1000).toFixed(2);
        return `${visibilityInKilometers} km`;
    } else if (format === "mi") {
        const visibilityInMiles = (visibilityInMeters / 1609.34).toFixed(2);
        return `${visibilityInMiles} mi`;
    } else {
        return "Invalid format";
    }
}

async function updatePressureDisplay() {
    const pressureElement = document.getElementById("pressure");
    if (!pressureElement) {
        console.error("Pressure element not found");
        return;
    }

    try {
        const history = await getPressureHistory();
        if (history.length === 0) {
            pressureElement.innerHTML = '<strong>Barometric Pressure:</strong> No Data Available';
            return;
        }

        // Get current and previous pressure readings
        const currentPressure = history[history.length - 1];
        const previousPressure = history.length > 1 ? history[history.length - 2] : null;

        // Convert current pressure to inHg
        const currentPressureInHg = convertMbToInHg(currentPressure);

        // Determine trend icon
        const trendIcon = previousPressure !== null
            ? getPressureTrendIcon(currentPressure, previousPressure)
            : "bi-question-circle";

        // Update the display
        pressureElement.innerHTML = `<strong>Barometric Pressure:</strong> ${currentPressureInHg} inHg <i class="bi ${trendIcon}"></i>`;
    } catch (error) {
        console.error("Error updating pressure display:", error.message);
        pressureElement.innerHTML = '<strong>Barometric Pressure:</strong> Error Loading Data';
    }
}

async function calculateFishingScore(data) {
    let score = 50; // Start with a baseline score

    // Temperature
    if (data.temp < 50) score -= 10;
    else if (data.temp > 75) score -= 5;

    // Weather Description
    if (data.description.includes("clear sky")) score -= 5;

    // Wind
    if (data.wind_speed > 15) score -= 10;
    else if (data.wind_speed > 5) score += 5;
    if (data.wind_gust > 20) score -= 5;

    // Humidity
    if (data.humidity >= 60 && data.humidity <= 80) score += 10;

    // UV Index
    if (data.uv_index <= 2) score += 5;

    // Pressure
    if (data.pressure > 1020 && data.pressure <= 1030) score -= 5;

    // Moon Phase
    if (data.moon_phase >= 0.25 && data.moon_phase <= 0.75) score += 10;

    // Time of Day
    const currentHour = new Date().getHours();
    const sunriseHour = parseInt(data.sunrise.split(':')[0], 10);
    const sunsetHour = parseInt(data.sunset.split(':')[0], 10);
    if (currentHour === sunriseHour || currentHour === sunsetHour) score += 10;

    // Barometric Pressure Trend
    const history = await getPressureHistory();
    if (history.length > 1) {
        const currentPressure = data.pressure;
        const previousPressure = history[history.length - 2];
        if (currentPressure > previousPressure) {
            // Rising pressure
            score -= 5;
        } else if (currentPressure < previousPressure) {
            // Falling pressure
            score += 10;
        } else {
            // Stable pressure
            score += 2;
        }
    }

    return score;
}

async function updateFishingScore(data) {
    try {
        const { score, descriptor } = await calculateFishingScore(data); // Properly destructure the result

        // Update the fishing score in the current weather data section
        const fishingScoreElement = document.getElementById("fishing-score");
        if (fishingScoreElement) {
            fishingScoreElement.innerHTML = `<strong>Fishing Score:</strong> ${score} (${descriptor})`;
        } else {
            console.error("Fishing score element not found.");
        }
    } catch (error) {
        console.error("Error calculating fishing score:", error.message);

        // Handle the error by displaying a fallback message
        const fishingScoreElement = document.getElementById("fishing-score");
        if (fishingScoreElement) {
            fishingScoreElement.innerHTML = `<strong>Fishing Score:</strong> Error calculating`;
        }
    }
}

function calculateFishingScore(day) {
    let score = 50; // Start with a baseline score

    // Temperature
    if (day.high < 50) {
        score -= 10; // Too cold
    } else if (day.high >= 50 && day.high <= 75) {
        score += 10; // Ideal temperature range
    }

    // Wind
    if (day.wind_speed > 15) {
        score -= 10; // Too windy
    } else if (day.wind_speed >= 5 && day.wind_speed <= 10) {
        score += 5; // Moderate wind is favorable
    }
    if (day.wind_gust > 20) {
        score -= 5; // Strong gusts are unfavorable
    }

    // Humidity
    if (day.humidity >= 60 && day.humidity <= 80) {
        score += 10; // Favorable humidity
    } else if (day.humidity < 30 || day.humidity > 90) {
        score -= 10; // Unfavorable humidity
    }

    // UV Index
    if (day.uv_index <= 2) {
        score += 5; // Low UV is favorable
    } else if (day.uv_index > 7) {
        score -= 5; // High UV is less favorable
    }

    // Barometric Pressure
    if (day.pressure >= 1010 && day.pressure <= 1025) {
        score += 10; // Favorable pressure range
    } else if (day.pressure < 1005 || day.pressure > 1030) {
        score -= 10; // Unfavorable pressure range
    }

    // Moon Phase
    if (day.moon_phase >= 0.25 && day.moon_phase <= 0.75) {
        score += 10; // Waxing Gibbous to Full Moon phases are favorable
    } else if (day.moon_phase === 0 || day.moon_phase === 1) {
        score -= 10; // New Moon phases are less favorable
    }

    // Cap score at 100 and ensure it doesn't drop below 0
    if (score > 100) score = 100;
    if (score < 0) score = 0;

    // Determine descriptor
    let descriptor = "Poor";
    if (score > 75) descriptor = "Excellent";
    else if (score > 50) descriptor = "Good";
    else if (score > 25) descriptor = "Fair";

    return { score, descriptor };
}

function initializeTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    
    if (!themeToggle) {
        console.error("Theme toggle button not found");
        return;
    }

    // Set up ARIA attributes
    themeToggle.setAttribute("role", "button");
    themeToggle.setAttribute("aria-label", "Toggle dark mode");

    // Get saved preference or use time of day
    const savedTheme = localStorage.getItem('theme');
    const currentHour = new Date().getHours();
    const isNightTime = currentHour < 6 || currentHour >= 18; // Night time between 6 PM and 6 AM

    // If user has a saved preference, use that. Otherwise, use time of day
    const defaultTheme = savedTheme || (isNightTime ? 'dark' : 'light');

    // Apply initial theme
    body.classList.add(`${defaultTheme}-mode`);
    updateThemeButton(defaultTheme === 'dark');

    // Set up automatic theme switching if no user preference
    if (!savedTheme) {
        // Check time every minute
        setInterval(() => {
            const hour = new Date().getHours();
            const shouldBeDark = hour < 6 || hour >= 18;
            const isDark = body.classList.contains('dark-mode');

            if (shouldBeDark !== isDark) {
                body.classList.remove('dark-mode', 'light-mode');
                body.classList.add(shouldBeDark ? 'dark-mode' : 'light-mode');
                updateThemeButton(shouldBeDark);
            }
        }, 60000); // Check every minute
    }

    function updateThemeButton(isDark) {
        themeToggle.innerHTML = isDark 
            ? '<i class="bi bi-sun"></i>' 
            : '<i class="bi bi-moon"></i>';
        themeToggle.setAttribute("aria-label", `Toggle ${isDark ? 'light' : 'dark'} mode`);
    }

    function toggleTheme() {
        const isDarkMode = body.classList.contains('dark-mode');
        const newTheme = isDarkMode ? 'light' : 'dark';
        
        body.classList.remove('dark-mode', 'light-mode');
        body.classList.add(`${newTheme}-mode`);
        localStorage.setItem('theme', newTheme);
        updateThemeButton(!isDarkMode);
    }

    themeToggle.addEventListener('click', toggleTheme);
    themeToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleTheme();
        }
    });
}

if (typeof data !== "undefined") {
    const weatherData = data.currentWeather || {};
    const dayOrNight = weatherData.dayOrNight || "day";
    
    initializeTheme();

    // Populate Weather Alerts
    if (data.weatherAlerts && data.weatherAlerts.length > 0) {
        populateWeatherAlerts(data.weatherAlerts);
    } else {
        console.log("No weather alerts found.");
    }

    // Populate Lake Level
    const lakeLevelElement = document.getElementById("lake-level");
    if (lakeLevelElement) {
        lakeLevelElement.textContent = data.lakeLevel || "Unavailable";
    }

    // Populate Weather Data
    const dynamicWeatherIcon = document.getElementById("dynamic-weather-icon");
    if (dynamicWeatherIcon) {
        dynamicWeatherIcon.classList.add(getWeatherIcon(weatherData.description || "", dayOrNight));
        dynamicWeatherIcon.setAttribute("aria-label", weatherData.description || "Weather icon");
    }

    // Helper function to safely update element content
    function updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = content;
        } else {
            console.error(`Element with id '${id}' not found`);
        }
    }

    // Update current weather data with proper ARIA attributes
    updateElement("current-temp", `<strong>Current Temperature:</strong> ${weatherData.temp || "Unavailable"} °F`);
    updateElement("feels-like", `<strong>Feels Like:</strong> ${weatherData.feels_like || "Unavailable"} °F`);
    updateElement("description", `<strong>Weather Description:</strong> ${escapeHtml(weatherData.description || "Unavailable")}`);
    updateElement("wind-speed", `<strong>Wind Speed:</strong> ${weatherData.wind_speed || "Unavailable"} mph`);

    const windDeg = weatherData.wind_deg || "Unavailable";
    if (windDeg !== "Unavailable") {
        const direction = getCardinalDirection(windDeg);
        updateElement("wind-deg", 
            `<strong>Wind Direction:</strong> ${windDeg}° (${direction}) <span class="sr-only">Wind direction is ${direction} at ${windDeg} degrees</span>`
        );
    } else {
        updateElement("wind-deg", `<strong>Wind Direction:</strong> Unavailable`);
    }

    updateElement("wind-gust", `<strong>Wind Gust:</strong> ${weatherData.gust || "Unavailable"} mph`);
    updateElement("humidity", `<strong>Humidity:</strong> ${weatherData.humidity || "Unavailable"} %`);

    const uvDesc = getUVIndexDescriptor(weatherData.uv_index);
    updateElement("uvi", 
        `<strong>UV Index:</strong> ${uvDesc} ${weatherData.uv_index != null ? `(${weatherData.uv_index})` : "(Unavailable)"} 
        <span class="sr-only">UV Index is ${uvDesc}</span>`
    );
    updateElement("visibility", '<strong>Visibility:</strong> ' + (weatherData.visibility ? convertVisibility(weatherData.visibility, "mi") : "Unavailable"));
    updateElement("dew-point", `<strong>Dew Point:</strong> ${weatherData.dew_point || "Unavailable"} °F`);
    updatePressureDisplay(weatherData.pressure);
    updateFishingScore(weatherData);
    
    // Update Moon Phase with Icon and Terminology
    const moonPhase = weatherData.moon_phase || "Unavailable";
    if (moonPhase !== "Unavailable") {
        const moonIcon = getMoonPhaseIcon(moonPhase);
        const moonDesc = getMoonPhaseTerminology(moonPhase);
        updateElement("moon_phase", 
            `<i class="bi ${moonIcon} me-2" aria-hidden="true"></i>
            <strong>Moon Phase:</strong> ${moonDesc} (${moonPhase})
            <span class="sr-only">Moon phase is ${moonDesc}</span>`
        );
    } else {
        updateElement("moon_phase", `<strong>Moon Phase:</strong> Unavailable`);
    }

    updateElement("sunrise", `<strong>Sunrise:</strong> ${weatherData.sunrise || "Unavailable"}`);
    updateElement("sunset", `<strong>Sunset:</strong> ${weatherData.sunset || "Unavailable"}`);

    // Populate Fishing Report
    const fishingReport = data.fishingReport || {};
    const reportDate = document.getElementById("fishing-report-date");
    const reportText = document.getElementById("fishing-report-text");

    if (reportDate && reportText) {
        const date = escapeHtml(fishingReport.date || "No date available");
        const report = escapeHtml(fishingReport.report || "No report available");

        reportDate.textContent = date;
        reportText.textContent = report;

        // Add ARIA attributes for better accessibility
        reportDate.setAttribute("aria-label", `Fishing report date: ${date}`);
        reportText.setAttribute("aria-label", "Fishing report content");
        reportText.setAttribute("role", "article");
    } else {
        console.error("Fishing report elements not found");
    }

    // Populate 5-Day Weather Forecast
    const fiveDayForecast = data.fiveDayWeather || [];
    const forecastContainer = document.getElementById("five-day-forecast");
    forecastContainer.innerHTML = ""; // Clear existing content

    fiveDayForecast.forEach((day, index) => {
        if (!day || typeof day !== 'object') return;

        const forecastCard = document.createElement("div");
        forecastCard.className = "col-12 col-sm-6 col-md-12";
        forecastCard.setAttribute("role", "region");
        forecastCard.setAttribute("aria-label", `Weather forecast for ${day.date || 'Unknown date'}`);

        const weatherIcon = getWeatherIcon(day.description || "", "day");
        const windDirection = getCardinalDirection(day.wind_deg);
        const uvDesc = getUVIndexDescriptor(day.uv_index);
        const moonIcon = getMoonPhaseIcon(day.moon_phase);
        const moonPhase = getMoonPhaseTerminology(day.moon_phase);
        const { score, descriptor } = calculateFishingScore(day);

        // Convert barometric pressure to inHg
        const pressureInHg = convertMbToInHg(day.pressure);

        // Convert visibility to miles if available
        const visibility = day.visibility
            ? convertVisibility(day.visibility, "mi")
            : null;

        const cardContent = `
            <div class="card shadow">
                <div class="card-header text-center bg-primary text-white">
                    <h5 class="mb-0" id="forecast-date-${index}">${escapeHtml(day.date || 'Unknown date')}</h5>
                </div>
                <div class="card-body text-center">
                    <i class="bi ${weatherIcon} fs-1" aria-label="${day.description || 'Weather condition'}"></i>
                    <p class="mb-2"><strong>Description:</strong> ${escapeHtml(day.description || 'No description available')}</p>
                    <p class="mb-1"><i class="bi bi-thermometer-high" aria-hidden="true"></i> <strong>High:</strong> ${day.high || 'No Data'} °F</p>
                    <p class="mb-1"><i class="bi bi-thermometer-low" aria-hidden="true"></i> <strong>Low:</strong> ${day.low || 'No Data'} °F</p>
                    <p class="mb-1"><i class="bi bi-wind" aria-hidden="true"></i> <strong>Wind:</strong> ${day.wind_speed || 'No Data'} mph (${windDirection})</p>
                    <p class="mb-1"><i class="bi bi-water" aria-hidden="true"></i> <strong>Gust:</strong> ${day.gust || 'No Data'} mph</p>
                    <p class="mb-1"><i class="bi bi-droplet-half" aria-hidden="true"></i> <strong>Humidity:</strong> ${day.humidity || 'No Data'} %</p>
                    <p class="mb-1"><i class="bi bi-sun" aria-hidden="true"></i> <strong>UV Index:</strong> ${uvDesc} (${day.uv_index || 'No Data'})</p>
                    <p class="mb-1"><i class="bi bi-speedometer" aria-hidden="true"></i> <strong>Barometric Pressure:</strong> ${pressureInHg || 'No Data'} inHg</p>
                    <p class="mb-1"><i class="bi ${moonIcon}" aria-hidden="true"></i> <strong>Moon Phase:</strong> ${moonPhase} (${day.moon_phase || 'No Data'})</p>
                    ${visibility && visibility !== "Unavailable" ? `<p class="mb-1"><i class="bi bi-eye" aria-hidden="true"></i> <strong>Visibility:</strong> ${visibility}</p>` : ""}
                    <p class="mb-1"><i class="bi bi-droplet" aria-hidden="true"></i> <strong>Dew Point:</strong> ${day.dew_point || "No Data"} °F</p>
                    <p class="mb-1"><i class="bi bi-trophy" aria-hidden="true"></i> <strong>Fishing Score:</strong> ${score || 'No Data'} (${descriptor || 'No Data'}) <i class="bi bi-info-circle text-primary" data-bs-toggle="modal" data-bs-target="#instructionModal" title="Click for Instructions"></i></p>
                </div>
            </div>
        `;

        forecastCard.innerHTML = cardContent;
        forecastContainer.appendChild(forecastCard);
    });
}
