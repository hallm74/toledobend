const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const { selectSnapshot } = require('./lake-data');
const LAKE_API_URL = 'https://news.allthingssabine.com/api/lake-level';
const ONE_CALL_API_URL = 'https://api.openweathermap.org/data/3.0/onecall';
const FISHING_REPORT_URL = 'https://tpwd.texas.gov/fishboat/fish/action/reptform2.php?water=Freshwater&lake=TOLEDO+BEND&Submit=View+Report&archive=latest';
const LOCATION_COORDS = { lat: 31.1357, lon: -93.5918 }; // Toledo Bend coordinates
const LAKE_LEVEL_HISTORY_FILE = 'lakeLevelHistory.json';
const PRESSURE_HISTORY_LIMIT = 6;
const PAGE_LOAD_TIMEOUT = 30000;

async function fetchLakeLevel({ get = axios.get, now = Date.now, file = LAKE_LEVEL_HISTORY_FILE } = {}) {
    let previous = null;
    try {
        const history = JSON.parse(fs.readFileSync(file, 'utf8'));
        previous = Array.isArray(history) ? history[history.length - 1] : null;
    } catch { /* Missing/corrupt/legacy history cannot prove an observation time. */ }
    let payload = null;
    try {
        const response = await get(LAKE_API_URL, { timeout: 10000, maxContentLength: 100000 });
        payload = response.data;
    } catch (error) { console.error('Lake update unavailable:', error.message); }
    const snapshot = selectSnapshot(payload, previous, now());
    fs.writeFileSync(file, JSON.stringify([snapshot], null, 2));
    return snapshot;
}

async function fetchFishingReport() {
    let browser;
    try {
        browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        console.log('Navigating to fishing report URL...');
        await page.goto(FISHING_REPORT_URL, { waitUntil: 'domcontentloaded', timeout: PAGE_LOAD_TIMEOUT });
        console.log('Fishing report page loaded.');

        const report = await page.evaluate(() => {
            const header = document.querySelector('h1');
            if (!header || !header.textContent.includes('Toledo Bend Fishing Report')) {
                return { date: 'Unavailable', report: 'Fishing report not found' };
            }

            if (document.body.innerText.includes('Weekly fishing reports are currently on hold')) return { date: 'Reports on hold', report: 'TPWD weekly fishing reports are currently on hold while the agency updates its data collection methods. Past reports remain available at TPWD.', status: 'on-hold' };

            const dateElement = document.querySelector('dl dt span.title');
            const textElement = document.querySelector('dl dd');

            return {
                date: dateElement ? dateElement.textContent.trim() : 'Unavailable',
                report: textElement ? textElement.textContent.trim() : 'Fishing report content not found',
            };
        });

        if (report.date === 'Unavailable' || !report.report || report.report.includes('not found')) throw new Error('Incomplete fishing report');
        report.checkedAt = new Date().toISOString();
        report.status = report.status || 'available';
        console.log('Fishing report fetched:', report);
        return report;
    } catch (error) {
        console.error('Error fetching fishing report:', error.message);
        return { date: 'Unavailable', report: 'Fishing report unavailable. Check TPWD for the latest report.', status: 'unavailable' };
    } finally {
        await browser?.close().catch(error => console.error('Browser cleanup failed:', error.message));
    }
}

const formatTime = (timestamp, offset) => {
    const localTime = new Date((timestamp + offset) * 1000);
    return localTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: process.env.TZ || 'UTC',
    });
};

async function fetchWeatherAndForecast() {
    try {
        if (!process.env.WEATHER_API_KEY) throw new Error('WEATHER_API_KEY missing');
        const response = await axios.get(ONE_CALL_API_URL, {
            timeout: 10000,
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
            description: weatherData.current.weather[0]?.description ?? 'Unavailable',
            wind_speed: weatherData.current.wind_speed ?? 'No Data',
            wind_deg: weatherData.current.wind_deg ?? 'No Data',
            gust: weatherData.current.wind_gust ?? 'No Data',
            sunrise: formatTime(weatherData.current.sunrise, weatherData.timezone_offset), // Use formatTime
            sunset: formatTime(weatherData.current.sunset, weatherData.timezone_offset),   // Use formatTime
            dayOrNight: weatherData.current.sunrise < Date.now() / 1000 && weatherData.current.sunset > Date.now() / 1000 ? 'day' : 'night',
            humidity: weatherData.current.humidity,
            uv_index: weatherData.current.uvi,
            pressure: weatherData.current.pressure,
            moon_phase: weatherData.daily[0]?.moon_phase ?? 'Unavailable',
            visibility: weatherData.current.visibility ?? 'Unavailable',
            dew_point: weatherData.current.dew_point ?? 'Unavailable',
        };

        const dailyForecasts = weatherData.daily.slice(1, 6).map((day, index) => {
            // Extract the hourly visibility for the current day
            const startHour = index * 24; // Calculate the start index for the current day
            const endHour = startHour + 24; // Calculate the end index for the current day
            const hourlyDataForDay = weatherData.hourly.slice(startHour, endHour);
        
            // Calculate the average visibility for the day
            const visibilityValues = hourlyDataForDay
                .filter(hour => hour.visibility != null) // Ensure visibility is not null or undefined
                .map(hour => hour.visibility);
                const averageVisibility = visibilityValues.length > 0
                ? Math.round(visibilityValues.reduce((sum, val) => sum + val, 0) / visibilityValues.length)
                : 'Unavailable';

                console.log(`Visibility values for day ${index + 1}:`, visibilityValues);
                console.log(`Average visibility for day ${index + 1}:`, averageVisibility);
        
            return {
                date: new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' }),
                high: day.temp.max,
                low: day.temp.min,
                description: day.weather[0]?.description ?? 'No Data',
                wind_speed: day.wind_speed ?? 'No Data',
                wind_deg: day.wind_deg ?? 'No Data',
                gust: day.wind_gust ?? 'No Data',
                humidity: day.humidity,
                uv_index: day.uvi,
                pressure: day.pressure,
                moon_phase: day.moon_phase,
                dew_point: day.dew_point ?? 'No Data',
                visibility: averageVisibility ?? 'Unavailable', // Use calculated visibility or fallback
            };
        });

        const alerts = weatherData.alerts?.map(alert => ({
            event: alert.event,
            start: new Date(alert.start * 1000).toLocaleTimeString(),
            end: new Date(alert.end * 1000).toLocaleTimeString(),
            description: alert.description,
            sender: alert.sender_name,
        })) || [];

        return { currentWeather, dailyForecasts, alerts, barometricPressureHistory, weatherStatus: 'available', weatherObservedAt: new Date(weatherData.current.dt * 1000).toISOString() };
    } catch (error) {
        console.error('Error fetching weather and forecast:', error.message);
        return {
            weatherStatus: 'unavailable',
            weatherObservedAt: null,
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
    const { currentWeather, dailyForecasts, alerts, barometricPressureHistory, weatherStatus, weatherObservedAt } = await fetchWeatherAndForecast();
    const fishingReport = await fetchFishingReport();

    const data = {
        lakeLevel,
        weatherStatus,
        weatherObservedAt,
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

if (require.main === module) main().catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { fetchLakeLevel, fetchWeatherAndForecast, fetchFishingReport };