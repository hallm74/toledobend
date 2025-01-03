const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const NOAA_URL = 'https://water.noaa.gov/gauges/bklt2';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const LOCATION = 'Many,US'; // Location for weather data

async function fetchLakeLevel() {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Add this for better CI/CD compatibility
    });
    const page = await browser.newPage();

    try {
        await page.goto(NOAA_URL, { waitUntil: 'networkidle2' });
        console.log('Successfully navigated to NOAA URL.');

        // Debugging: Print page content
        const pageContent = await page.content();
        console.log('Page content loaded.');

        const lakeLevel = await page.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('tr')); // Select all rows
            for (let row of rows) {
                if (row.textContent.includes('Latest Value')) {
                    const cells = row.querySelectorAll('td');
                    if (cells.length > 1) {
                        return cells[1].textContent.trim(); // Assume the second cell contains the lake level
                    }
                }
            }
            return 'Unavailable';
        });

        console.log('Lake level fetched:', lakeLevel);
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

        // Adjust sunrise and sunset times using the API's timezone offset
        const formatTime = (timestamp, offset) => {
            const localTime = new Date((timestamp + offset) * 1000);
            return localTime.toLocaleTimeString('en-US', {
                timeZone: process.env.TZ || 'UTC', // Respect the TZ variable for environment compatibility
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

    // Save as a JavaScript file
    const dataJsContent = `const data = ${JSON.stringify(data, null, 2)};`;
    fs.writeFileSync('data.js', dataJsContent);
    console.log('Data file updated:', data);
}

main();