const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const NOAA_URL = 'https://water.noaa.gov/gauges/bklt2';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const LOCATION = 'Many,US'; // Location for weather data

async function fetchLakeLevel() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await page.goto(NOAA_URL, { waitUntil: 'networkidle2' });

        const lakeLevel = await page.evaluate(() => {
            const latestValueCell = Array.from(document.querySelectorAll('td')).find(
                td => td.textContent.trim() === 'Latest Value'
            );
            return latestValueCell
                ? latestValueCell.nextElementSibling.textContent.trim()
                : 'Unavailable';
        });

        return lakeLevel;
    } catch (error) {
        console.error('Error fetching lake level:', error.message);
        return 'Unavailable';
    } finally {
        await browser.close();
    }
}

async function fetchWeather() {
    try {
        const response = await axios.get(WEATHER_API_URL, {
            params: {
                q: LOCATION,
                appid: process.env.WEATHER_API_KEY,
                units: 'imperial',
            },
        });

        const weatherData = response.data;

        // Use the timezone offset from the API to calculate local times
        const timezoneOffset = weatherData.timezone * 1000;

        const formatTime = (timestamp) => {
            const localTime = new Date((timestamp + timezoneOffset) * 1000);
            return localTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
            });
        };

        return {
            temp: weatherData.main.temp,
            feels_like: weatherData.main.feels_like,
            description: weatherData.weather[0].description,
            icon: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`,
            wind_speed: weatherData.wind.speed || 'No Data',
            wind_deg: weatherData.wind.deg || 'No Data',
            gust: weatherData.wind.gust || 'No Data',
            sunrise: formatTime(weatherData.sys.sunrise),
            sunset: formatTime(weatherData.sys.sunset),
        };
    } catch (error) {
        console.error('Error fetching weather:', error.message);
        return {
            temp: 'Unavailable',
            feels_like: 'Unavailable',
            description: 'Unavailable',
            icon: '',
            wind_speed: 'Unavailable',
            wind_deg: 'Unavailable',
            gust: 'Unavailable',
            sunrise: 'Unavailable',
            sunset: 'Unavailable',
        };
    }
}

async function main() {
    console.log('Fetching data...');
    const lakeLevel = await fetchLakeLevel();
    const weather = await fetchWeather();

    const data = {
        lakeLevel,
        weather,
    };

    // Save as a JavaScript file
    const dataJsContent = `const data = ${JSON.stringify(data, null, 2)};`;
    fs.writeFileSync('data.js', dataJsContent);
    console.log('Data file updated:', data);
}

main();