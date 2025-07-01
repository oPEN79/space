export function initMapLeaflet() {
    try {
        const map = L.map('map-leaflet').setView([-1.22985, -78.52495], 6);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
        }).addTo(map);

        return map;
    } catch (error) {
        console.error("Error al inicializar el mapa:", error);
        return null;
    }
}

export function addMarker(map, lat, lon, popupText = '') {
    const marker = L.marker([lat, lon]).addTo(map);
    if (popupText) {
        marker.bindPopup(popupText).openPopup();
    }
    return marker;
}

export function moveMapTo(map, lat, lon, zoom = 13) {
    map.setView([lat, lon], zoom);
}

export function delMarker(map, marker) {
    if (marker) {
        map.removeLayer(marker);
    }
}

export function mostrarPopUpLeaflet(map, lat, lng, name) {
    const content = `
        <div style="font-size: 1.1rem; max-width: 200px; line-height: 1.3;">
            <strong>${name}</strong><br>
            <strong>Lat:</strong> ${lat.toFixed(4)}<br>
            <strong>Lon:</strong> ${lng.toFixed(4)}<br>
        </div>
    `;

    L.popup({
        maxWidth: 220,
        className: 'weather-popup' // opcional si quieres aplicar estilos personalizados con CSS
    })
    .setLatLng([lat, lng])
    .setContent(content)
    .openOn(map);
}