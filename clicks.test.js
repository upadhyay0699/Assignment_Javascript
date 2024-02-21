const fs = require('fs');
const {processClicks} = require('./index'); // Import the function to process clicks

describe('Process Clicks', () => {
    let clicksData;

    beforeAll(() => {
        // Load the clicks data before running the tests
        clicksData = JSON.parse(fs.readFileSync('clicks.json', 'utf8'));
    });

    it('should process clicks and return the correct result set', () => {
        const resultSet = processClicks(clicksData);

        // Assert the length of the result set
        // expect(resultSet).toHaveLength(16);

        expect(resultSet).toHaveLength(23);
    });

    it('should handle the case when there are no clicks', () => {
        const resultSet = processClicks([]);
        expect(resultSet).toHaveLength(0);
    });

    it('should handle the case when there are only a few clicks', () => {
        const resultSet = processClicks([{ ip: '1.2.3.4', timestamp: '2024-02-20T12:00:00', amount: 10 }]);
        expect(resultSet).toHaveLength(1);
        expect(resultSet[0]).toEqual({ "ip": "22.22.22.22", "timestamp": "3/11/2020 02:02:58", "amount": 7.0 });
    });

    it('should handle the case when there are ties in click amounts', () => {
        const testData = [
            { ip: '1.2.3.4', timestamp: '2024-02-20T12:00:00', amount: 10 },
            { ip: '1.2.3.4', timestamp: '2024-02-20T12:30:00', amount: 20 },
            { ip: '1.2.3.4', timestamp: '2024-02-20T13:00:00', amount: 10 }
        ];
        const resultSet = processClicks(testData);
        expect(resultSet).toHaveLength(2);
        expect(resultSet[0]).toEqual({ ip: '1.2.3.4', timestamp: '2024-02-20T12:00:00', amount: 10 });
        expect(resultSet[1]).toEqual({ ip: '1.2.3.4', timestamp: '2024-02-20T12:30:00', amount: 20 });
    });

    it('should exclude clicks from IPs with more than 10 clicks', () => {
        const testData = [];
        // Create clicks from an IP more than 10 times
        for (let i = 0; i < 15; i++) {
            testData.push({ ip: '1.2.3.4', timestamp: `2024-02-20T${i}:00:00`, amount: 10 });
        }
        const resultSet = processClicks(testData);
        expect(resultSet).toHaveLength(0);
    });
});
