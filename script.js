document.addEventListener('DOMContentLoaded', () => {
    const ws = new WebSocket(reframed_url); // Replace with your WebSocket URL
    let currentStatIndex = 0;
    statsData = { names: [], values: [] }; // To store the latest stats data

    const updateDisplay = () => {
        if (currentStatIndex >= statsData.names.length) {
            currentStatIndex = 0;
        }

        if (statsData.names.length > 0 && statsData.values.length > 0) {
            document.getElementById('player1').textContent = statsData.values[currentStatIndex][0];
            document.getElementById('stat-name').textContent = statsData.names[currentStatIndex];
            document.getElementById('player2').textContent = statsData.values[currentStatIndex][1];
        }

        currentStatIndex = (currentStatIndex + 1) % statsData.names.length;
    };

    ws.onmessage = function(event) {
        const reader = new FileReader();

        reader.onload = function() {
            try {
                const data = JSON.parse(reader.result);

                if (!data.stats || !data.stats.values || !data.stats.names) {
                    console.error('Invalid data structure');
                    return;
                }

                // Update statsData with the latest data
                statsData = data.stats;
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        };

        reader.readAsText(event.data);
    };

    ws.onerror = function(error) {
        console.error('WebSocket Error:', error);
    };

    ws.onclose = function() {
        console.log('WebSocket connection closed');
    };

    // Set interval to update the display every 10 seconds
    setInterval(updateDisplay, 10000);
});