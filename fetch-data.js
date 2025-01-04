const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const NOAA_URL = 'https://water.noaa.gov/gauges/bklt2';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const LOCATION = 'Many,US'; // Location for weather data
const LAKE_LEVEL_HISTORY_FILE = 'lakeLevelHistory.json';
const HISTORY_LIMIT = 5; // Keep the last 5 valid lake levels
const PAGE_LOAD_TIMEOUT = 120000; // Maximum time to wait for the page to load

async function fetchLakeLevel() {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    try {
        console.log('Navigating to NOAA URL...');
        await page.goto(NOAA_URL, { waitUntil: 'domcontentloaded', timeout: PAGE_LOAD_TIMEOUT });
        console.log('NOAA page loaded.');

        const lakeLevel = await page.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('tr'));
            for (let row of rows) {
                if (row.textContent.includes('Latest Value')) {
                    const cells = row.querySelectorAll('td');
                    if (cells.length > 1) {
                        return cells[1].textContent.trim();
                    }
                }
            }
            return null;
        });

        if (lakeLevel) {
            console.log('Lake level fetched:', lakeLevel);
            updateLakeLevelHistory(lakeLevel);
            return lakeLevel;
        } else {
            throw new Error('Lake level not found.');
        }
    } catch (error) {
        console.error('Error fetching lake level:', error.message);
        const fallbackLakeLevel = getFallbackLakeLevel();
        console.log('Reverting to last known lake level:', fallbackLakeLevel);
        return fallbackLakeLevel;
    } finally {
        await browser.close();
    }
}

function getFallbackLakeLevel() {
    if (fs.existsSync(LAKE_LEVEL_HISTORY_FILE)) {
        const data = JSON.parse(fs.readFileSync(LAKE_LEVEL_HISTORY_FILE, 'utf-8'));
        return data.length > 0 ? data[data.length - 1] : 'Unavailable';
    }
    return 'Unavailable';
}

function updateLakeLevelHistory(newLevel) {
    let history = [];

    if (fs.existsSync(LAKE_LEVEL_HISTORY_FILE)) {
        history = JSON.parse(fs.readFileSync(LAKE_LEVEL_HISTORY_FILE, 'utf-8'));
    }

    history.push(newLevel);

    if (history.length > HISTORY_LIMIT) {
        history.shift();
    }

    fs.writeFileSync(LAKE_LEVEL_HISTORY_FILE, JSON.stringify(history, null, 2));
    console.log('Lake level history updated:', history);
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

        const formatTime = (timestamp, offset) => {
            const localTime = new Date((timestamp + offset) * 1000);
            return localTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: process.env.TZ || 'UTC',
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
            sunrise: formatTime(weatherData.sys.sunrise, weatherData.timezone),
            sunset: formatTime(weatherData.sys.sunset, weatherData.timezone),
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

    const dataJsContent = `const data = ${JSON.stringify(data, null, 2)};`;
    fs.writeFileSync('data.js', dataJsContent);
    console.log('Data file updated:', data);
}

main();