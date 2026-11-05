const puppeteer = require('puppeteer');
const fs = require('node:fs');
const assert = require('node:assert/strict');
(async () => {
 const browser=await puppeteer.launch({headless:true});
 try {
 for(const scenario of ['recent','stale','future','legacy','missing','saved']) {
 const page=await browser.newPage(); const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const now=Date.now();const observed=now+(scenario==='future'?60000:scenario==='stale'?-10800000:-60000);
 const snapshot={reading:{station:'USGS-08025350',parameter:'62614',level:167.75,unit:'ft',datum:'NGVD 1929',observedAt:new Date(observed).toISOString()},checkedAt:new Date(now).toISOString(),refreshUnavailable:scenario==='saved'};
 await page.setRequestInterception(true);
 page.on('request',r=>r.respond({status:200,contentType:'text/html',body:fs.readFileSync('index.html','utf8').replace(/<script[\s\S]*?<\/script>/g,'').replace(/<link[^>]*>/g,'')}));
 await page.goto('http://tacklebox.test/');
 await page.evaluate((value)=>{window.data={lakeLevel:value,currentWeather:{},fiveDayWeather:[]};window.__timers=[];window.setInterval=fn=>window.__timers.push(fn)},scenario==='legacy'?'167ft':scenario==='missing'?null:snapshot);
 await page.addScriptTag({path:'lake-data.js'});await page.addScriptTag({path:'script.js'});
 const text=await page.$eval('#lake-level',e=>e.textContent);
 assert(text.includes(scenario==='recent'?'Latest reported':scenario==='saved'?'Saved reading':scenario==='stale'?'Stale reading':'Reading unavailable'),text);
 assert(await page.$eval('#weather-status',e=>e.textContent.includes('unavailable or stale')));
 if(scenario==='recent') {
 await page.evaluate(()=>{const actual=Date.now;Date.now=()=>actual()+3*3600000;window.__timers.forEach(fn=>fn())});
 assert(await page.$eval('#lake-level',e=>e.textContent.includes('Stale reading')));
 }
 assert.deepEqual(errors,[]);await page.close();console.log(`browser: ${scenario} passed`);
 }
 } finally {await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
