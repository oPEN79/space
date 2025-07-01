import { initMapLeaflet, mostrarPopUpLeaflet } from './map_leaflet.js';
import { fetchWeather } from './weatherService.js';
import { searchLocationAndMove } from './search.js';
import { generarTabla } from './tablas.js';
//import { mostrarPopUpWindy } from './map_windy.js';


const map = initMapLeaflet();

if (!map || typeof map.setView !== 'function') {
    console.error("❌ Error: el mapa no se inicializó correctamente.");
    alert("No se pudo cargar el mapa. Verifica tu conexión o revisa errores en la consola.");
}


// Evento para obtener clima al hacer clic en el boton buscar
document.getElementById('searchBtn').addEventListener('click', async () => {
    const query = document.getElementById('locationInput').value.trim();
    if (query !== "") {
        const results = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
        const data = await results.json();
        if (data.length > 0) {
            const { lat, lon, display_name } = data[0];
            //Zoom al mapa leaflet
            map.flyTo([lat, lon], 10, {
                animate: true,
                duration: 1.5
            });
            obtenerClimaYMostrar(parseFloat(lat), parseFloat(lon), display_name);
        } else {
            alert("No se encontró la ubicación.");
        }
    }
});

// Evento para obtener clima al hacer clic en el mapa
map.on('click', (e) => {
    const { lat, lng } = e.latlng;
    obtenerClimaYMostrar(lat, lng);
    //Zoom al mapa leaflet
    map.flyTo([lat, lng], 10, {
        animate: true,
        duration: 1.5
    });
});


async function obtenerClimaYMostrar(lat, lng, name_location = null) {
    try {
        // Obtener datos mediante Visual Crossing
        const weatherDataVisualCrossing = await fetchWeather(lat, lng);

        if (!name_location) {
        // Obtener zona con Nominatim
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        name_location = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        }

        //Generar tablas
        mostrarTablaSeleccionada(weatherDataVisualCrossing, name_location);
        condicionesActualHora(weatherDataVisualCrossing, name_location);

        //Generar Popup sobre el Mapa Leaflet
        mostrarPopUpLeaflet(map, lat, lng, name_location);
        //Generar Popup sobre el Mapa Windy
        const iframe = document.getElementById("map-windy");
            iframe.contentWindow.postMessage({
                type: 'showPopup',
                lat: lat,
                lon: lng,
                name: name_location
            }, '*');

        // Mostrar JSON completo en pantalla
        //mostrarDatosJSON(data, 'json-output');
        //mostrarDatosJSON(weatherDataVisualCrossing, 'visualCrossingt');

    } catch (error) {
        console.error('Error al obtener datos del clima:', error);
        alert("No se pudo obtener información del clima.");
    }
}


function mostrarTablaSeleccionada(weatherData, name_location) {
    const tablaSelector = document.querySelectorAll("#tablaSelector li");

    const tablaMap = {
        condicionesActuales: "weather-table",
        dia: "weather-horizontal-table_days",
        horas: "weather-horizontal-table_hours",
        estaciones: "stations-table",
        recomendaciones: "recomendaciones-txt"
    };

    tablaSelector.forEach(item => {
        item.addEventListener("click", () => {
        const tipo = item.dataset.tabla;

        // Limpiar contenedores
        Object.values(tablaMap).forEach(id => {
            const contenedor = document.getElementById(id);
            contenedor.innerHTML = "";
            contenedor.style.display = "none";
        });

        // Marcar activo
        tablaSelector.forEach(li => li.classList.remove("active"));
        item.classList.add("active");

        // Generar y mostrar tabla
        const contenedorID = tablaMap[tipo];
        const contenedor = document.getElementById(contenedorID);
        const tabla = generarTabla(weatherData, tipo, name_location);
        contenedor.appendChild(tabla);
        contenedor.style.display = "block";
        });
    });
}

function mostrarDatosJSON(data, containerId = 'json-output') {
    const container = document.getElementById(containerId);

    if (!container) {
        console.error(`Elemento con id "${containerId}" no encontrado.`);
        return;
    }

    try {
        const prettyJSON = JSON.stringify(data, null, 2);
        container.textContent = prettyJSON;
    } catch (err) {
        container.textContent = '⚠️ Error al convertir JSON: ' + err.message;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const overlayItems = document.querySelectorAll("#overlayList li");

    overlayItems.forEach(item => {
        item.addEventListener("click", () => {
        const overlayName = item.dataset.overlay;
        cambiarOverlayWindy(overlayName);

        // Marcar visualmente la opción seleccionada
        overlayItems.forEach(li => li.classList.remove("active"));
        item.classList.add("active");
        });
    });
});

function cambiarOverlayWindy(overlayName) {
    const iframe = document.getElementById("map-windy");

    if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({
        type: "setOverlay",
        layer: overlayName
        }, "*");
    } else {
        console.error("❌ No se encontró el iframe del mapa Windy.");
    }
}

function condicionesActualHora(data, name_location) {
    const current = data.currentConditions;
    const day = data.days[0];

    document.getElementById("ubicacion_nombre").textContent = name_location;
    document.getElementById("fecha_actual").textContent = day.datetime;
    document.getElementById("hora_actual").textContent = current.datetime;
    document.getElementById("latitud").textContent = data.latitude;
    document.getElementById("longitud").textContent = data.longitude;
    document.getElementById("zona_horaria").textContent = `${data.timezone} (UTC ${data.tzoffset})`;

    document.getElementById("condiciones").textContent = current.conditions;
    document.getElementById("temperatura").textContent = current.temp;
    document.getElementById("sensacion").textContent = current.feelslike;
    document.getElementById("humedad").textContent = current.humidity;
    document.getElementById("viento").textContent = current.windspeed;
    document.getElementById("nubosidad").textContent = current.cloudcover;
    document.getElementById("visibilidad").textContent = current.visibility;
    document.getElementById("presion").textContent = current.pressure;
    document.getElementById("uv").textContent = current.uvindex;
    document.getElementById("amanecer").textContent = current.sunrise;
    document.getElementById("anochecer").textContent = current.sunset;
    document.getElementById("fase_lunar").textContent = day.moonphase;

}

async function mostrarDatosArduino() {
    const res = await fetch('/api/sensores');
    const data = await res.json();
    
    document.getElementById('datosArduino').textContent = JSON.stringify(data, null, 2);
}

document.addEventListener("DOMContentLoaded", () => {
    mostrarDatosArduino();
});

/*12:50:47: {"fecha_hora":"2025-06-28 12:50:45","temperatura":21.2,"humedad":68.4,"luz":17.4,"lluvia":23.8,"presion":1012.5,"viento":263,"aire":0.0}
📥 12:50:52: {"fecha_hora":"2025-06-28 12:50:50","temperatura":19.2,"humedad":77.6,"luz":17.3,"lluvia":24.2,"presion":1011.2,"viento":197,"aire":0.0}
📥 12:50:57: {"fecha_hora":"2025-06-28 12:50:55","temperatura":24.2,"humedad":72.8,"luz":16.5,"lluvia":19.6,"presion":1012.5,"viento":269,"aire":0.0}
📥 12:51:02: {"fecha_hora":"2025-06-28 12:51:00","temperatura":21.9,"humedad":80.3,"luz":17.2,"lluvia":23.5,"presion":1011.3,"viento":240,"aire":0.0}
📥 12:51:07: {"fecha_hora":"2025-06-28 12:51:05","temperatura":20.4,"humedad":70.1,"luz":16.8,"lluvia":21.0,"presion":1012.1,"viento":218,"aire":0.0} */