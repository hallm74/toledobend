const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const lake = require('../lake-data');
const now = Date.parse('2026-11-05T16:45:00Z');
const reading = {station:'USGS-08025350',parameter:'62614',level:167.75,unit:'ft',datum:'NGVD 1929',observedAt:'2026-11-05T16:30:00Z',provisional:true};
const payload = {reading, checkedAt:'2026-11-05T16:40:00Z',refreshUnavailable:false};
test('recent, exact freshness boundary and stale observations', () => {
 const s=lake.selectSnapshot(payload,null,now);
 assert.equal(lake.readingState(s,now),'recent');
 assert.equal(lake.readingState(s,Date.parse(reading.observedAt)+lake.STALE_MS),'recent');
 assert.equal(lake.readingState(s,Date.parse(reading.observedAt)+lake.STALE_MS+1),'stale');
 assert.match(lake.describe(s,now),/167.75 ft above NGVD 1929/);
 assert.match(lake.describe(s,now),/CST/);
});
for (const patch of [{level:NaN},{level:'167.75'},{level:0},{level:200},{station:'other'},{parameter:'00065'},{datum:'NAVD 88'},{unit:'m'},{observedAt:'invalid'},{observedAt:'2026-11-05T16:30:00'},{observedAt:'2026-11-05T16:45:00.001Z'}]) {
 test(`invalid reading ${JSON.stringify(patch)} never current`,()=>{
 const s=lake.selectSnapshot({...payload,reading:{...reading,...patch}},null,now);
 assert.equal(lake.readingState(s,now),'unavailable');
 assert.doesNotMatch(lake.describe(s,now),/167.75/);
 });
}
test('bad payloads retain only timestamped valid fallback and label it saved',()=>{
 for(const bad of [null,{}, {reading:null}, {...payload,checkedAt:'bad'}, {...payload,checkedAt:'2027-01-01T00:00:00Z'}, {...payload,refreshUnavailable:undefined}, {...payload,reading:{...reading,observedAt:'2026-11-05T16:00:00Z'}}]) {
 const s=lake.selectSnapshot(bad,payload,now);
 assert.deepEqual(s.reading,reading);
 assert.equal(lake.readingState(s,now),'saved');
 }
 assert.equal(lake.selectSnapshot(null,'167.99ft 12:30pm',now).reading,null);
 assert.equal(lake.readingState(lake.selectSnapshot({...payload,refreshUnavailable:true},null,now),now),'saved');
});
test('collector failure, corrupt and legacy history, success and regression',async()=>{
 const {fetchLakeLevel}=require('../fetch-data');
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'tacklebox-test-')); const file=path.join(dir,'history.json');
 try {
 const fail=async()=>{throw Error('offline')};
 for(const content of ['broken',JSON.stringify(['167ft'])]) {
 fs.writeFileSync(file,content);
 assert.equal((await fetchLakeLevel({get:fail,now:()=>now,file})).reading,null);
 }
 let options;
 const s=await fetchLakeLevel({get:async(url,o)=>{assert.equal(url,'https://news.allthingssabine.com/api/lake-level');options=o;return {data:payload}},now:()=>now,file});
 assert(options.timeout>0);assert(options.maxContentLength>0);assert.equal(lake.readingState(s,now),'recent');
 const fallback=await fetchLakeLevel({get:fail,now:()=>now,file});assert.equal(lake.readingState(fallback,now),'saved');
 assert.deepEqual(JSON.parse(fs.readFileSync(file))[0],fallback);
 } finally {fs.rmSync(dir,{recursive:true,force:true});}
});
test('weather missing credentials and fishing browser launch errors return explicit failure',async()=>{
 const collector=require('../fetch-data');const puppeteer=require('puppeteer');
 const original=puppeteer.launch;const key=process.env.WEATHER_API_KEY;
 delete process.env.WEATHER_API_KEY;
 try {
 assert.equal((await collector.fetchWeatherAndForecast()).weatherStatus,'unavailable');
 puppeteer.launch=async()=>{throw Error('browser unavailable')};
 assert.equal((await collector.fetchFishingReport()).status,'unavailable');
 } finally {puppeteer.launch=original;if(key!==undefined)process.env.WEATHER_API_KEY=key;}
});
test('weather successful response preserves zero values and forecasts',async()=>{
 const axios=require('axios');const original=axios.get;const key=process.env.WEATHER_API_KEY;
 process.env.WEATHER_API_KEY='test';
 try {
 axios.get=async(url,options)=>{assert.equal(options.timeout,10000);return {data:{timezone_offset:0,current:{dt:now/1000,temp:0,feels_like:0,weather:[{description:'clear sky'}],wind_speed:0,wind_deg:0,wind_gust:0,sunrise:now/1000,sunset:now/1000,humidity:0,uvi:0,pressure:1000,visibility:0,dew_point:0},daily:[{moon_phase:0}],hourly:[{pressure:1000}]}}};
 const result=await require('../fetch-data').fetchWeatherAndForecast();
 assert.equal(result.weatherStatus,'available');assert.equal(result.currentWeather.moon_phase,0);assert.equal(result.currentWeather.wind_speed,0);assert.equal(result.currentWeather.dew_point,0);assert.equal(result.weatherObservedAt,new Date(now).toISOString());assert.deepEqual(result.dailyForecasts,[]);
 }finally {axios.get=original;if(key===undefined)delete process.env.WEATHER_API_KEY;else process.env.WEATHER_API_KEY=key;}
});
test('fishing source hold is retained and browser closes',async()=>{
 const p=require('puppeteer');const original=p.launch;let closed=false;
 try {p.launch=async()=>({newPage:async()=>({goto:async()=>{},evaluate:async()=>({date:'Reports on hold',report:'TPWD weekly fishing reports are currently on hold.',status:'on-hold'})}),close:async()=>{closed=true}});
 const result=await require('../fetch-data').fetchFishingReport();assert.equal(result.status,'on-hold');assert(closed);
 }finally{p.launch=original}
});
