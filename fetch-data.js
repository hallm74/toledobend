const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const SRATX_URL = 'https://www.sratx.org/basin-conditions/lake-levels/';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_API_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const FISHING_REPORT_URL = 'https://tpwd.texas.gov/fishboat/fish/action/reptform2.php?water=Freshwater&lake=TOLEDO+BEND&Submit=View+Report&archive=latest&yearcat=2024';
const LOCATION = 'Many,US';
const LAKE_LEVEL_HISTORY_FILE = 'lakeLevelHistory.json';
const FISHING_REPORT_HISTORY_FILE = 'fishingReportHistory.json';
const HISTORY_LIMIT = 5;
const PAGE_LOAD_TIMEOUT = 120000;

async function fetchLakeLevel() {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    try {
        console.log('Navigating to SRATX URL...');
        await page.goto(SRATX_URL, { waitUntil: 'domcontentloaded', timeout: PAGE_LOAD_TIMEOUT });
        console.log('SRATX page loaded.');

        const lakeLevel = await page.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('tr'));
            for (let row of rows) {
                const link = row.querySelector('td.column-1 a');
                if (link && link.textContent.includes('Toledo Bend')) {
                    const lakeData = row.querySelector('td.column-3');
                    return lakeData ? lakeData.textContent.trim() : null;
                }
            }
            return null;
        });

        if (lakeLevel) {
            console.log('Lake level fetched:', lakeLevel);
            updateHistory(LAKE_LEVEL_HISTORY_FILE, lakeLevel);
            return lakeLevel;
        } else {
            throw new Error('Lake level not found.');
        }
    } catch (error) {
        console.error('Error fetching lake level:', error.message);
        const fallbackLakeLevel = getFallbackFromHistory(LAKE_LEVEL_HISTORY_FILE);
        console.log('Reverting to last known lake level:', fallbackLakeLevel);
        return fallbackLakeLevel;
    } finally {
        await browser.close();
    }
}

function updateHistory(file, newEntry) {
    let history = [];

    if (fs.existsSync(file)) {
        history = JSON.parse(fs.readFileSync(file, 'utf-8'));
    }

    history.push(newEntry);

    if (history.length > HISTORY_LIMIT) {
        history.shift();
    }

    fs.writeFileSync(file, JSON.stringify(history, null, 2));
    console.log(`${file} updated:`, history);
}

function getFallbackFromHistory(file) {
    if (fs.existsSync(file)) {
        const history = JSON.parse(fs.readFileSync(file, 'utf-8'));
        return history.length > 0 ? history[history.length - 1] : 'Unavailable';
    }
    return 'Unavailable';
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

        const currentTime = Math.floor(Date.now() / 1000);
        const dayOrNight = currentTime >= weatherData.sys.sunrise && currentTime < weatherData.sys.sunset ? 'day' : 'night';

        return {
            temp: weatherData.main.temp,
            feels_like: weatherData.main.feels_like,
            description: weatherData.weather[0].description,
            wind_speed: weatherData.wind.speed || 'No Data',
            wind_deg: weatherData.wind.deg || 'No Data',
            gust: weatherData.wind.gust || 'No Data',
            sunrise: formatTime(weatherData.sys.sunrise, weatherData.timezone),
            sunset: formatTime(weatherData.sys.sunset, weatherData.timezone),
            dayOrNight,
        };
    } catch (error) {
        console.error('Error fetching weather:', error.message);
        return {
            temp: 'Unavailable',
            feels_like: 'Unavailable',
            description: 'Unavailable',
            wind_speed: 'Unavailable',
            wind_deg: 'Unavailable',
            gust: 'Unavailable',
            sunrise: 'Unavailable',
            sunset: 'Unavailable',
            dayOrNight: 'Unavailable',
        };
    }
}

async function fetchFiveDayWeather() {
    try {
        const response = await axios.get(FORECAST_API_URL, {
            params: {
                q: LOCATION,
                appid: process.env.WEATHER_API_KEY,
                units: 'imperial',
            },
        });

        const weatherData = response.data;
        const dailyForecasts = [];
        const seenDays = new Set();
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const tomorrowDate = tomorrow.toISOString().split('T')[0];

        weatherData.list.forEach((entry) => {
            const date = entry.dt_txt.split(' ')[0];
            if (date >= tomorrowDate && !seenDays.has(date)) {
                seenDays.add(date);
                dailyForecasts.push({
                    date,
                    high: entry.main.temp_max,
                    low: entry.main.temp_min,
                    description: entry.weather[0].description,
                    wind_speed: entry.wind.speed || 'No Data',
                    wind_deg: entry.wind.deg || 'No Data',
                    gust: entry.wind.gust || 'No Data',
                });
            }
            if (dailyForecasts.length === 5) return;
        });

        return dailyForecasts;
    } catch (error) {
        console.error('Error fetching 5-day weather:', error.message);
        return [];
    }
}

async function fetchFishingReport() {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    try {
        console.log('Navigating to fishing report URL...');
        await page.goto(FISHING_REPORT_URL, { waitUntil: 'domcontentloaded', timeout: PAGE_LOAD_TIMEOUT });
        console.log('Fishing report page loaded.');

        const report = await page.evaluate(() => {
            const header = document.querySelector('h1');
            if (!header || !header.textContent.includes('Toledo Bend Fishing Report')) {
                return { date: 'Unavailable', report: 'Fishing report not found' };
            }

            const dateElement = document.querySelector('dl dt span.title');
            const textElement = document.querySelector('dl dd');

            return {
                date: dateElement ? dateElement.textContent.trim() : 'Unavailable',
                report: textElement ? textElement.textContent.trim() : 'Fishing report content not found',
            };
        });

        console.log('Fishing report fetched:', report);
        updateHistory(FISHING_REPORT_HISTORY_FILE, report);
        return report;
    } catch (error) {
        console.error('Error fetching fishing report:', error.message);
        const fallbackFishingReport = getFallbackFromHistory(FISHING_REPORT_HISTORY_FILE);
        console.log('Reverting to last known fishing report:', fallbackFishingReport);
        return fallbackFishingReport;
    } finally {
        await browser.close();
    }
}

async function main() {
    console.log('Fetching data...');
    const lakeLevel = await fetchLakeLevel();
    const weather = await fetchWeather();
    const fiveDayWeather = await fetchFiveDayWeather();
    const fishingReport = await fetchFishingReport();

    const data = {
        lakeLevel,
        weather,
        fiveDayWeather,
        fishingReport,
    };

    const dataJsContent = `const data = ${JSON.stringify(data, null, 2)};`;
    fs.writeFileSync('data.js', dataJsContent);
    console.log('Data file updated:', data);
}

main();