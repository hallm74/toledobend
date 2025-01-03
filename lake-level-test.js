const puppeteer = require('puppeteer');

const NOAA_URL = 'https://water.noaa.gov/gauges/bklt2';

async function fetchLakeLevel() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        // Navigate to the NOAA page
        await page.goto(NOAA_URL, { waitUntil: 'networkidle2' });

        // Extract the lake level by targeting the sibling element of "Latest Value"
        const lakeLevel = await page.evaluate(() => {
            const latestValueCell = Array.from(document.querySelectorAll('td')).find(
                td => td.textContent.trim() === 'Latest Value'
            );
            return latestValueCell
                ? latestValueCell.nextElementSibling.textContent.trim()
                : 'Unavailable';
        });

        console.log('Lake Level:', lakeLevel);
    } catch (error) {
        console.error('Error fetching lake level:', error.message);
    } finally {
        await browser.close();
    }
}

fetchLakeLevel();