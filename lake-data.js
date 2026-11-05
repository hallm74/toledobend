/* Shared by the static page and scheduled collector. ATS policy: stale after 2h. */
(function (root) {
    const STALE_MS = 2 * 60 * 60 * 1000;
    const SOURCE_URL = 'https://waterdata.usgs.gov/monitoring-location/USGS-08025350/';
    function validReading(r, now = Date.now()) {
        return !!r && r.station === 'USGS-08025350' && r.parameter === '62614' &&
            r.unit === 'ft' && r.datum === 'NGVD 1929' && Number.isFinite(r.level) &&
            r.level > 100 && r.level < 200 && typeof r.observedAt === 'string' &&
            /T.*(?:Z|[+-]\d{2}:\d{2})$/.test(r.observedAt) &&
            Number.isFinite(Date.parse(r.observedAt)) && Date.parse(r.observedAt) <= now;
    }
    function selectSnapshot(payload, previous, now = Date.now()) {
        const prior = validReading(previous?.reading, now) ? previous.reading : null;
        const checked = Date.parse(payload?.checkedAt);
        const accepted = validReading(payload?.reading, now) && typeof payload?.checkedAt === 'string' && /T.*(?:Z|[+-]\d{2}:\d{2})$/.test(payload.checkedAt) && Number.isFinite(checked) &&
            checked <= now && checked >= Date.parse(payload.reading.observedAt) &&
            typeof payload.refreshUnavailable === 'boolean' &&
            (!prior || Date.parse(payload.reading.observedAt) >= Date.parse(prior.observedAt));
        return accepted ? {
            reading: payload.reading, checkedAt: payload.checkedAt,
            refreshUnavailable: payload.refreshUnavailable || now - checked > STALE_MS,
        } : { reading: prior, checkedAt: previous?.checkedAt || null, refreshUnavailable: true };
    }
    function readingState(snapshot, now = Date.now()) {
        if (!validReading(snapshot?.reading, now)) return 'unavailable';
        if (now - Date.parse(snapshot.reading.observedAt) > STALE_MS) return 'stale';
        const checked = Date.parse(snapshot.checkedAt);
        if (snapshot.refreshUnavailable !== false || !Number.isFinite(checked) || checked > now || now - checked > STALE_MS) return 'saved';
        return 'recent';
    }
    function describe(snapshot, now = Date.now()) {
        const state = readingState(snapshot, now);
        if (state === 'unavailable') return 'Reading unavailable. Check the official USGS source.';
        const labels = { recent: 'Latest reported reading', saved: 'Saved reading — update unavailable', stale: 'Stale reading — check the official source' };
        const r = snapshot.reading;
        const observed = new Date(r.observedAt).toLocaleString('en-US', { timeZone: 'America/Chicago', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
        return `${labels[state]}: ${r.level.toFixed(2)} ft above NGVD 1929. Observed ${observed}.${r.provisional ? ' Provisional USGS reading; subject to revision.' : ''}`;
    }
    const api = { STALE_MS, SOURCE_URL, validReading, selectSnapshot, readingState, describe };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.LakeData = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
