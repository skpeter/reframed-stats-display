document.addEventListener('DOMContentLoaded', () => {
    const ws = new WebSocket(reframed_url); // Replace with your WebSocket URL
    let currentStatIndex = 0;

    ws.onmessage = function(event) {
        const reader = new FileReader();

        reader.onload = function() {
            try {
                const data = JSON.parse(reader.result);

                if (!data.stats || !data.stats.values || !data.stats.names) {
                    console.error('Invalid data structure');
                    return;
                }

                const { names, values } = data.stats;

                // Update the display
                if (currentStatIndex >= names.length) {
                    currentStatIndex = 0;
                }

                document.getElementById('player1').textContent = values[currentStatIndex][0];
                document.getElementById('stat-name').textContent = names[currentStatIndex];
                document.getElementById('player2').textContent = values[currentStatIndex][1];

                currentStatIndex = (currentStatIndex + 1) % names.length;
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
});