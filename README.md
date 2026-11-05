# Toledo Bend Tacklebox

Static site with an hourly GitHub Actions collector. No build or TypeScript step is required. Changes in this workspace are local; the existing workflow publishes data only when run in GitHub.

## Local checks

Use Node 22 or newer. Run `npm ci`, `npm run check`, and `npm test`. Browser regressions are separate: `node scripts/check-browser.cjs` (requires Puppeteer's Chrome). `node fetch-data.js` updates local generated data and requires `WEATHER_API_KEY` for live OpenWeather; do not commit credentials. Without the key, weather is explicitly unavailable and lake/fishing collection continues.

## Lake source and freshness

The collector reads https://news.allthingssabine.com/api/lake-level with a 10-second timeout and 100 KB response bound. Verified November 5, 2026: JSON fields `reading`, `checkedAt`, `refreshUnavailable`, `sourceUrl`; reading fields `station`, `parameter`, `level`, `unit`, `datum`, `observedAt`, `provisional`. Observed live response: station USGS-08025350, parameter 62614, 167.75 ft above NGVD 1929, observation 2026-11-05T16:30:00+00:00, check 2026-11-05T16:36:59.406Z, provisional, refresh available.

ATS's local implementation at `/Users/hallm/programming/django/goodneighbor/frontend/lib/lake-data.mjs` defines STALE_MS = 2 hours and CACHE_MS = 15 minutes. Its Netlify function (`frontend/netlify/functions/lake-level.mjs`) returns the same contract and caches at the CDN for 900 seconds. These were verified in source, not inferred from response age.

Tacklebox shares the 2-hour stale boundary. It strictly rejects future observations (ATS permits five minutes clock skew), wrong station/parameter/unit/datum, nonnumeric or implausible elevations (must be above 100 and below 200 ft), undated readings, malformed check timestamps, and backwards observations. Failed/invalid refreshes preserve only a previously validated timestamped reading and always mark it saved or stale. Legacy string history has no trustworthy observation date and is not reused. The history file now contains one structured snapshot. The browser recomputes freshness each minute, so static/generated data and long-open pages cannot remain current indefinitely. Display dates use America/Chicago with a timezone label. The official USGS link is fixed locally rather than trusted from upstream.

The site still collects hourly; it does not directly call ATS cross-origin. Thus latest reported does not mean instantaneous. ATS data itself may be cached for 15 minutes. On a first failed refresh after upgrade, undated legacy data displays unavailable.

## Other sources

OpenWeather One Call 3.0 remains the weather source. Requests have a 10-second timeout, observation timestamps and explicit failure metadata. The UI warns about missing, future, or older-than-two-hour weather, including possibly outdated alerts/forecasts/scores. Missing weather does not produce a default fishing score. Legitimate zero values survive collection/display.

TPWD remains the fishing source, with a 30-second navigation bound, browser launch/cleanup error handling, and rejection of missing report content. The hardcoded 2024 archive filter was removed. Live inspection November 5, 2026 found TPWD says weekly reports are on hold while it improves collection methods; no current report is returned. Tacklebox now exposes that hold and links to TPWD's archive. Source failure produces an explicit unavailable message rather than a fabricated report. No alternate fishing provider was selected.

Known existing limitations outside this bounded update: pressure “history” is hourly forecast data, fishing scores are a heuristic, and the legacy explanatory modal overstates what weather visibility measures. The old score algorithm and weather layout were not redesigned. A future improvement should reconsider the score and pressure interpretation.

## Validation record

- `npm run check`: passed JavaScript syntax checks.
- `npm test`: passed 17 regressions, including freshness boundaries, invalid/future/legacy data, failure fallback/history persistence, weather zeros/missing credentials, and fishing launch failure/source hold.
- `node scripts/check-browser.cjs`: six browser scenarios (recent, stale, future, legacy, missing, saved), open-page aging, weather failure messaging and no page JavaScript errors.
- Live ATS collector check: passed; temporary history only, generated repository data unchanged.
- Live TPWD check: on hold confirmed, surfaced as `on-hold`.
- `git diff --check`: passed.
- No configured lint, typecheck, or build commands exist; not run. Live authenticated OpenWeather fetch not run; mocked success/failure covered.
- Locked dependency installation reports 15 existing audit findings (2 moderate, 11 high, 2 critical). Dependency upgrades require a separate compatibility pass; no automated forced fixes applied.

No push, PR, merge, deployment, app retirement, or data deletion performed.
