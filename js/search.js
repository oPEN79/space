import { moveMapTo, delMarker, addMarker, mostrarPopUpLeaflet } from './map_leaflet.js';
import { fetchWeather } from './weatherService.js';
import { renderFormattedWeatherData } from './ui.js';

let searchMarker = null;

export async function searchLocationAndMove(map, query) {
    const location = await searchLocation(query);
    if (!location) return;

    const { lat, lon, name } = location;
    moveMapTo(map, lat, lon);

    // Eliminar marcador anterior
    delMarker(map, searchMarker);

    // Obtener y mostrar clima
    try {
        const weatherData = await fetchWeather(lat, lon);
        renderFormattedWeatherData(weatherData);

        mostrarPopUpLeaflet(map, lat, lon, weatherData.currentConditions, name);
        searchMarker = addMarker(map, lat, lon, name);
    } catch (error) {
        console.error("Error al obtener clima:", error);
        alert("No se pudo obtener información del clima.");
    }
}

export async function searchLocation(query) {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
    const results = await response.json();

    if (results.length === 0) {
        alert("Localidad no encontrada");
        return null;
    }

    const { lat, lon, display_name } = results[0];
    return {
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        name: display_name
    };
}
