
export function renderFormattedWeatherData(weatherData) {
    const weatherDisplay = document.getElementById("weatherData");
    weatherDisplay.textContent = JSON.stringify(weatherData, null, 2);
}
