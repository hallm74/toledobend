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
    const dayOrNight = data.weather.dayOrNight || "day";
  
    // Apply initial theme and icon
    body.classList.add(dayOrNight === "night" ? "dark-mode" : "light-mode");
    themeToggle.innerHTML = dayOrNight === "night" 
      ? '<i class="bi bi-sun"></i>' 
      : '<i class="bi bi-moon"></i>';
  
    themeToggle.addEventListener('click', toggleTheme);
  
    document.getElementById("lake-level").textContent = data.lakeLevel || "Unavailable";
  
    const weatherData = data.weather || {};
    const dynamicWeatherIcon = document.getElementById("dynamic-weather-icon");
    dynamicWeatherIcon.classList.add(getWeatherIcon(weatherData.description || "", dayOrNight));
  
    document.getElementById("current-temp").textContent = `${weatherData.temp || "Unavailable"} °F`;
    document.getElementById("feels-like").textContent = `${weatherData.feels_like || "Unavailable"} °F`;
    document.getElementById("description").textContent = `${weatherData.description || "Unavailable"}`;
    document.getElementById("wind-speed").textContent = `${weatherData.wind_speed || "Unavailable"} mph`;
  
    const windDeg = weatherData.wind_deg || "Unavailable";
    if (windDeg !== "Unavailable") {
      document.getElementById("wind-deg").textContent = `${windDeg}° (${getCardinalDirection(windDeg)})`;
    } else {
      document.getElementById("wind-deg").textContent = "Unavailable";
    }
  
    document.getElementById("wind-gust").textContent = `${weatherData.gust || "Unavailable"} mph`;
    document.getElementById("sunrise").textContent = `${weatherData.sunrise || "Unavailable"}`;
    document.getElementById("sunset").textContent = `${weatherData.sunset || "Unavailable"}`;
  }