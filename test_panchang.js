import { getPanchangam, Observer } from '@ishubhamx/panchangam-js';

// Mumbai coordinates
const lat = 19.0760;
const lon = 72.8777;

// Create the observer (latitude, longitude, elevation in meters)
const observer = new Observer(lat, lon, 0);

// Target date (Aug 15, 2026) to test the transition
const date = new Date("2026-08-15T12:00:00+05:30");

// India is UTC+5:30, which equals 330 minutes east of UTC.
const timezoneOffset = 330; 
const panchang = getPanchangam(date, observer, { timezoneOffset });

const formatTime = (d) => {
  return d ? d.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'N/A';
};

const formatDate = (d) => {
  return d ? d.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'N/A';
};

console.log("=========================================");
console.log("        TODAY'S PANCHANG (MUMBAI)        ");
console.log("=========================================");
console.log("Date:           ", date.toDateString());
console.log("Sunrise:        ", formatTime(panchang.sunrise));
console.log("Sunset:         ", formatTime(panchang.sunset));

console.log("\n--- TITHI DETAILS ---");
console.log("Sunrise Tithi Index (1-30):", panchang.tithi);
if (panchang.tithis && panchang.tithis.length > 0) {
  panchang.tithis.forEach((t, idx) => {
    // For the first tithi (active at sunrise), get its actual start time
    // which may be before sunrise (or even the previous day).
    const actualStart = idx === 0 ? panchang.tithiStartTime : t.startTime;
    const actualEnd = idx === 0 ? panchang.tithiEndTime : t.endTime;

    console.log(`* Tithi: ${t.name}`);
    console.log(`  Starts: ${formatTime(actualStart)} (${formatDate(actualStart)})`);
    console.log(`  Ends:   ${formatTime(actualEnd)} (${formatDate(actualEnd)})`);
  });
} else {
  console.log("No Tithi data available.");
}

console.log("\n--- NAKSHATRA DETAILS ---");
console.log("Sunrise Nakshatra Index (0-26):", panchang.nakshatra);
if (panchang.nakshatras && panchang.nakshatras.length > 0) {
  panchang.nakshatras.forEach((n, idx) => {
    // For the first nakshatra (active at sunrise), get its actual start time
    // which may be before sunrise.
    const actualStart = idx === 0 ? panchang.nakshatraStartTime : n.startTime;
    const actualEnd = idx === 0 ? panchang.nakshatraEndTime : n.endTime;

    console.log(`* Nakshatra: ${n.name}`);
    console.log(`  Starts:    ${formatTime(actualStart)} (${formatDate(actualStart)})`);
    console.log(`  Ends:      ${formatTime(actualEnd)} (${formatDate(actualEnd)})`);
  });
} else {
  console.log("No Nakshatra data available.");
}
console.log("=========================================");
