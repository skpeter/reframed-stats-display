document.addEventListener('DOMContentLoaded', () => {
    const ws = new WebSocket(reframed_url); // Replace with your WebSocket URL
    document.getElementById("copyright").innerText = suffix_text
    let currentStatIndex = 0;
    statsData = { names: [], values: [] }; // To store the latest stats data

    const updateDisplay = () => {
        document.getElementsByClassName("box")[0].classList.add('show')
        const elements = [document.getElementById('player1'), document.getElementById('stat-name'), document.getElementById('player2')];
        elements.forEach(el => el.classList.add('fade-animation'));

        setTimeout(() => {
            if (currentStatIndex >= statsData.names.length) {
                currentStatIndex = 0;
            }

            for (statname in statsData.names) {
                if (include_stats.length == 0 || include_stats.includes(statsData.names[currentStatIndex])) break;
                currentStatIndex = (currentStatIndex + 1) % statsData.names.length;
            }

            try {
                if (statsData.names.length > 0 && statsData.values.length > 0) {
                    if (remove_complimentary_data) {
                        if (statsData.values[currentStatIndex][0].split("/").length > 1) {
                            statsData.values[currentStatIndex][0] = statsData.values[currentStatIndex][0].split("/")[1]
                            statsData.values[currentStatIndex][1] = statsData.values[currentStatIndex][1].split("/")[1]
                        }
                    }
                    document.getElementById('player1').textContent = statsData.values[currentStatIndex][0];
                    document.getElementById('stat-name').textContent = statsData.names[currentStatIndex];
                    document.getElementById('player2').textContent = statsData.values[currentStatIndex][1];
                }
                currentStatIndex = (currentStatIndex + 1) % statsData.names.length;
            } catch {
                currentStatIndex = 0;
            }


        }, 1000)

        // Remove the fade animation class after the animation ends
        elements.forEach(el => {
            el.addEventListener('animationend', () => {
                el.classList.remove('fade-animation');
            }, { once: true });
        });

        if (statsData.values.ended) setTimeout(() => {
            document.getElementsByClassName("box")[0].classList.remove('show')
        }, 90000)
    };

    ws.onmessage = function (event) {
        const reader = new FileReader();

        reader.onload = function () {
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

    ws.onerror = function (error) {
        console.error('WebSocket Error:', error);
    };

    ws.onclose = function () {
        console.log('WebSocket connection closed');
    };

    // Set interval to update the display every 10 seconds
    setInterval(updateDisplay, 10000);
});