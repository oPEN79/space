
export function initWindyMap() {
    const options = {
        key: "0Eu8vQiLOG2nq6AH6n6VjvZjC91EF4bx", // API Key válida de Windy
        lat: -0.1807,
        lon: -78.4678,
        zoom: 6,
        overlay: "wind", // overlay inicial
    };

    window.windyInit(options, windyAPI => {
        const { map, store } = windyAPI;

        // Guardamos referencias globales para acceder desde el listener
        window._windyMap = map;
        window._windyStore = store;
    });

}

// Llamar inmediatamente si se usa sin módulos
if (typeof window !== "undefined") {
    initWindyMap();
}

// Escuchar comandos desde la ventana principal
window.addEventListener("message", (event) => {
    const data = event.data;
    if (!data || typeof data !== "object") return;

    if (data.type === "setOverlay" && window._windyStore) {
        window._windyStore.set("overlay", data.layer);
    }

    if (data.type === "showPopup" && window._windyMap) {
        mostrarPopUpWindy(window._windyMap, data.lat, data.lon, data.name)
    }
});

function mostrarPopUpWindy(map, lat, lon, name = '') {
    map.flyTo([lat, lon], 10, {
        animate: true,
        duration: 1.5
    });
    const content = `
        <div style="font-size: 0.75rem; max-width: 200px; line-height: 1.3;">
            <strong>${name}</strong><br>
            <strong>Lat:</strong> ${lat.toFixed(4)}<br>
            <strong>Lon:</strong> ${lon.toFixed(4)}<br>
        </div>
    `;

    L.popup({
        maxWidth: 220,
        className: 'weather-popup'
    })
    .setLatLng([lat, lon])
    .setContent(content)
    .openOn(map);
}
