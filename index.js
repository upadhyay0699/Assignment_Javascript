// Import required modules
const fs = require('fs');

// Read clicks data from clicks.json
const clicksData = fs.readFileSync('clicks.json');
const clicks = JSON.parse(clicksData);

// Define function to process clicks
function processClicks(clicks) {
    const clickMap = new Map();
    const ipCount = new Map();

    for (const click of clicks) {
        const { ip, timestamp, amount } = click;

        if ((ipCount.get(ip) || 0) >= 10) continue;

        const hourStart = new Date(timestamp);
        hourStart.setMinutes(0, 0, 0);

        const key = ip + '-' + hourStart.getTime(); // Unique key for IP-hour pair

        if (!clickMap.has(key) || clickMap.get(key).amount < amount) {
            clickMap.set(key, { ip, timestamp, amount });
        }

        ipCount.set(ip, (ipCount.get(ip) || 0) + 1);
    }

    const result = Array.from(clickMap.values());

    return result;
}

// Generate result set
const resultSet = processClicks(clicks);

// just for output in console
console.log(resultSet);

// Write result set to result-set.json
fs.writeFileSync('result-set.json', JSON.stringify(resultSet, null, 2));

module.exports = {processClicks};