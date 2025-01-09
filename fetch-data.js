const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const SRATX_URL = 'https://www.sratx.org/basin-conditions/lake-levels/';
const ONE_CALL_API_URL = 'https://api.openweathermap.org/data/3.0/onecall';
const FISHING_REPORT_URL = 'https://tpwd.texas.gov/fishboat/fish/action/reptform2.php?water=Freshwater&lake=TOLEDO+BEND&Submit=View+Report&archive=latest&yearcat=2024';
const LOCATION_COORDS = { lat: 31.1357, lon: -93.5918 }; // Toledo Bend coordinates
const LAKE_LEVEL_HISTORY_FILE = 'lakeLevelHistory.json';
const FISHING_REPORT_HISTORY_FILE = 'fishingReportHistory.json';
const BAROMETRIC_PRESSURE_HISTORY_FILE = 'barometricPressureHistory.json';
const HISTORY_LIMIT = 5;
const PRESSURE_HISTORY_LIMIT = 6;
const PAGE_LOAD_TIMEOUT = 120000;

function updatePressureHistory(newPressure) {
    if (isNaN(newPressure)) {
        console.error('Invalid pressure value:', newPressure);
        return;
    }

    let history = [];

    if (fs.existsSync(BAROMETRIC_PRESSURE_HISTORY_FILE)) {
        history = JSON.parse(fs.readFileSync(BAROMETRIC_PRESSURE_HISTORY_FILE, 'utf-8'));
    }

    history.push(newPressure);

    if (history.length > PRESSURE_HISTORY_LIMIT) {
        history.shift();
    }

    fs.writeFileSync(BAROMETRIC_PRESSURE_HISTORY_FILE, JSON.stringify(history, null, 2));
    console.log(`${BAROMETRIC_PRESSURE_HISTORY_FILE} updated:`, history);
}

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

async function fetchWeatherAndForecast() {
    try {
        const response = await axios.get(ONE_CALL_API_URL, {
            params: {
                lat: LOCATION_COORDS.lat,
                lon: LOCATION_COORDS.lon,
                appid: process.env.WEATHER_API_KEY,
                units: 'imperial',
                exclude: 'minutely',
            },
        });

        const weatherData = response.data;

        if (!weatherData || !weatherData.current || !weatherData.daily || !weatherData.hourly) {
            throw new Error('Incomplete weather data received from API');
        }

        const barometricPressureHistory = weatherData.hourly
            .slice(0, PRESSURE_HISTORY_LIMIT) // Get the last 6 hourly pressures
            .map(hour => hour.pressure);

        const currentWeather = {
            temp: weatherData.current.temp,
            feels_like: weatherData.current.feels_like,
            description: weatherData.current.weather[0]?.description || 'Unavailable',
            wind_speed: weatherData.current.wind_speed || 'No Data',
            wind_deg: weatherData.current.wind_deg || 'No Data',
            gust: weatherData.current.wind_gust || 'No Data',
            sunrise: new Date(weatherData.current.sunrise * 1000).toLocaleTimeString(),
            sunset: new Date(weatherData.current.sunset * 1000).toLocaleTimeString(),
            dayOrNight: weatherData.current.sunrise < Date.now() / 1000 && weatherData.current.sunset > Date.now() / 1000 ? 'day' : 'night',
            humidity: weatherData.current.humidity,
            uv_index: weatherData.current.uvi,
            pressure: weatherData.current.pressure,
            moon_phase: weatherData.daily[0]?.moon_phase || 'Unavailable',
        };

        const dailyForecasts = weatherData.daily.slice(1, 6).map(day => ({
            date: new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' }),
            high: day.temp.max,
            low: day.temp.min,
            description: day.weather[0]?.description || 'No Data',
            wind_speed: day.wind_speed || 'No Data',
            wind_deg: day.wind_deg || 'No Data',
            gust: day.wind_gust || 'No Data',
            humidity: day.humidity,
            uv_index: day.uvi,
            pressure: day.pressure,
            moon_phase: day.moon_phase,
        }));

        const alerts = weatherData.alerts?.map(alert => ({
            event: alert.event,
            start: new Date(alert.start * 1000).toLocaleTimeString(),
            end: new Date(alert.end * 1000).toLocaleTimeString(),
            description: alert.description,
            sender: alert.sender_name,
        })) || [];

        return { currentWeather, dailyForecasts, alerts, barometricPressureHistory };
    } catch (error) {
        console.error('Error fetching weather and forecast:', error.message);
        return {
            currentWeather: {},
            dailyForecasts: [],
            alerts: [],
            barometricPressureHistory: [],
        };
    }
}

async function main() {
    console.log('Fetching data...');
    const lakeLevel = await fetchLakeLevel();
    const { currentWeather, dailyForecasts, alerts, barometricPressureHistory } = await fetchWeatherAndForecast();
    const fishingReport = await fetchFishingReport();

    const data = {
        lakeLevel,
        currentWeather,
        fiveDayWeather: dailyForecasts,
        weatherAlerts: alerts,
        barometricPressureHistory, // Include the pressure history here
        fishingReport,
    };

    const dataJsContent = `const data = ${JSON.stringify(data, null, 2)};`;
    fs.writeFileSync('data.js', dataJsContent);
    console.log('Data file updated:', data);
}

main();