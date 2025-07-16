export function generarTabla(data, tipo, nombre_ubicacion) {
  switch (tipo) {
    case "dia":
      return generarTablaDia(data);
    case "condicionesActuales":
      return generarTablaCondicionesActuales(data, nombre_ubicacion);
    case "horas":
      return generarTablaHoras(data);
    case "estaciones":
      return generarTablaEstaciones(data);
    case "recomendaciones":
      return generarRecomendaciones();
    case "estacionesPropias":
      return generarTablaEstacionesPropias(data);
    default:
      return "<p>Tipo de tabla no reconocido</p>";
  }
}

function generarRecomendaciones() {
  const panel = document.createElement('div');
  panel.className = 'weather-panel-hora-actual';

  const titulo = document.createElement('h2');
  titulo.textContent = '📝 Recomendaciones Meteorológicas';

  const meta = document.createElement('p');
  meta.className = 'weather-meta';
  meta.textContent = 'Basado en condiciones actuales y datos locales';

  const cuerpo = document.createElement('div');
  cuerpo.className = 'weather-details';
  cuerpo.id = 'recomendaciones';

  const lista = document.createElement('ul');

  const recomendaciones = [
    'Evite exposición prolongada al sol entre 11:00 y 15:00.',
    'Riesgo de lluvia: lleve paraguas o impermeable.',
    'La visibilidad es buena para observación astronómica esta noche.'
  ];

  recomendaciones.forEach(texto => {
    const item = document.createElement('li');
    item.textContent = texto;
    lista.appendChild(item);
  });

  cuerpo.appendChild(lista);
  panel.appendChild(titulo);
  panel.appendChild(meta);
  panel.appendChild(cuerpo);

  return panel;
}

function generarTablaCondicionesActuales(data, name_location) {
  const contenedor = document.createElement('div');
  contenedor.className = 'weather-tables-grid';

  // Título general
  const titulo = document.createElement('h2');
  titulo.textContent = '🌤️ Condiciones actuales del clima';
  titulo.className = 'titulo-condiciones';
  contenedor.appendChild(titulo);

  // Secciones con emojis incluidos
  const secciones = {
    '📍 Información general': [
      ['📍 Ubicación Aprox.', name_location],
      ['📅 Fecha', data.days[0].datetime],
      ['⏰ Hora', data.currentConditions.datetime],
      ['🌐 Latitud', data.latitude],
      ['🌐 Longitud', data.longitude],
      ['🕒 Zona horaria', `${data.timezone} (UTC${data.tzoffset})`],
    ],
    '🌡️ Condiciones actuales': [
      ['🌡️ Temperatura actual', `${data.currentConditions.temp} °C`],
      ['🥶 Sensación térmica', `${data.currentConditions.feelslike} °C`],
      ['💧 Humedad', `${data.currentConditions.humidity} %`],
      ['🌡️ Presión atmosférica', `${data.currentConditions.pressure} hPa`],
      ['☁️ Cobertura nubosa', `${data.currentConditions.cloudcover} %`],
      ['👀 Visibilidad', `${data.currentConditions.visibility} km`],
      ['🔆 Índice UV', `${data.currentConditions.uvindex}`],
      ['🌥️ Condiciones', data.currentConditions.conditions],
    ],
    '🌧️ Precipitaciones y viento': [
      ['🌧️ Precipitación', `${data.currentConditions.precip || 0} mm`],
      ['❄️ Prob. precipitacón', `${data.currentConditions.precipprob || 0} %`],
      ['⛄ Nieve acumulada', `${data.currentConditions.snow || 0} mm`],
      ['🌬️ Velocidad del viento', `${data.currentConditions.windspeed} km/h`],
      ['🧭 Dirección del viento', `${data.currentConditions.winddir}°`],
    ],
    '🌅 Información solar y lunar': [
      ['🌅 Amanecer', data.currentConditions.sunrise],
      ['🌇 Anochecer', data.currentConditions.sunset],
      ['🌙 Fase lunar', data.days[0].moonphase],
    ],
  };

  // Crear tablas por sección
  for (const [tituloSeccion, filas] of Object.entries(secciones)) {
    const seccionDiv = document.createElement('div');
    seccionDiv.className = 'tabla-wrapper';

    const subtitulo = document.createElement('h2');
    subtitulo.textContent = tituloSeccion;
    subtitulo.className = 'subtitulo-tabla';

    const tabla = document.createElement('table');
    tabla.className = 'weather-table';

    for (const [label, value] of filas) {
      const row = document.createElement('tr');
      const tdLabel = document.createElement('td');
      const tdValue = document.createElement('td');
      tdLabel.innerHTML = label;
      tdValue.innerHTML = value;
      row.appendChild(tdLabel);
      row.appendChild(tdValue);
      tabla.appendChild(row);
    }

    seccionDiv.appendChild(subtitulo);
    seccionDiv.appendChild(tabla);
    contenedor.appendChild(seccionDiv);
  }

  return contenedor;
}

function generarTablaDia(data) {
  const wrapper = document.createElement('div');
  wrapper.className = 'tabla-dia-wrapper';

  // Título fuera de la tabla
  const titulo = document.createElement('h2');
  titulo.textContent = `📅 Resumen del día ${data.days[0].datetime}`;
  titulo.className = 'titulo-tabla';
  wrapper.appendChild(titulo);

  // Definir campos con unidades
  const campos = [
    ['🌡️ Temp máx', 'tempmax', '°C'],
    ['🌤️ Temp promedio', 'temp', '°C'],
    ['❄️ Temp mín', 'tempmin', '°C'],
    ['🔥 Sensación térmica máx', 'feelslikemax', '°C'],
    ['🥶 Sensación térmica mín', 'feelslikemin', '°C'],
    ['💧 Humedad', 'humidity', '%'],
    ['🌧️ Precipitación total', 'precip', 'mm'],
    ['❄️ Prob. precipitación/nieve', 'precipprob', '%'],
    ['🌦️ % del día con lluvia', 'precipcover', '%'],
    ['⛄ Nieve total', 'snow', 'mm'],
    ['💨 Ráfaga máx', 'windgust', 'km/h'],
    ['🌬️ Viento promedio', 'windspeed', 'km/h'],
    ['🧭 Dirección del viento', 'winddir', '°'],
    ['🌡️ Presión', 'pressure', 'hPa'],
    ['☁️ Cielo nublado prom.', 'cloudcover', '%'],
    ['👀 Visibilidad prom.', 'visibility', 'km'],
    ['🔆 Radiación solar prom.', 'solarradiation', 'W/m²'],
    ['⚡ Energía solar total', 'solarenergy', 'MJ/m²'],
    ['🌞 UV máx', 'uvindex', ''],
    ['🌥️ Condiciones', 'conditions', ''],
    ['🌅 Amanecer', 'sunrise', ''],
    ['🌇 Atardecer', 'sunset', ''],
    ['🌙 Fase lunar', 'moonphase', ''],
    ['📝 Descripción', 'description', ''],
  ];

  const tabla = document.createElement('table');
  tabla.className = 'tabla-horizontal';

  // Crear fila de encabezado
  const encabezado = document.createElement('tr');
  // Primera celda: título de la columna de etiquetas
  const thEtiqueta = document.createElement('th');
  thEtiqueta.textContent = '📅 Fecha';  // <- Aquí se muestra "Fecha"
  encabezado.appendChild(thEtiqueta);
  // Columnas por cada día
  data.days.forEach(day => {
    const th = document.createElement('th');
    th.textContent = day.datetime; // Puedes formatearla si quieres
    encabezado.appendChild(th);
  });
  // Última columna con "..." para simular más fechas
  const thFinal = document.createElement('th');
  thFinal.textContent = '...';
  encabezado.appendChild(thFinal);

  tabla.appendChild(encabezado);

  // Crear filas por campo
  campos.forEach(([etiqueta, clave, unidad]) => {
    const fila = document.createElement('tr');
    const tdEtiqueta = document.createElement('td');
    tdEtiqueta.innerHTML = etiqueta;
    fila.appendChild(tdEtiqueta);

    data.days.forEach(day => {
      const td = document.createElement('td');
      let valor = day[clave];

      if (valor === undefined || valor === null || valor === '') {
        valor = '—';
      } else {
        valor += unidad ? ` ${unidad}` : '';
      }

      td.innerHTML = valor;
      fila.appendChild(td);
    });

    // Celda final "..."
    const tdFinal = document.createElement('td');
    tdFinal.innerHTML = '...';
    fila.appendChild(tdFinal);

    tabla.appendChild(fila);
  });

  wrapper.appendChild(tabla);
  return wrapper;
}

function generarTablaHoras(data) {
  const day = data.days[0];

  const wrapper = document.createElement('div');
  wrapper.className = 'tabla-dia-wrapper';

  // Título fuera de la tabla
  const titulo = document.createElement('h2');
  titulo.textContent = `📅 Pronóstico por horas del día ${data.days[0].datetime}`;
  titulo.className = 'titulo-tabla';
  wrapper.appendChild(titulo);

  const table = document.createElement('table');
  table.className = 'weather-horizontal-table';

  // Cabecera
  const header = document.createElement('tr');
  header.appendChild(createHeaderCell('⏰ Hora'));

  day.hours.forEach(hour => {
    const cell = document.createElement('th');
    cell.innerText = hour.datetime;
    header.appendChild(cell);
  });

  table.appendChild(header);

  // Lista de campos con emojis
  const rows = [
    ['🌡️ Temp (°C)', h => `${h.temp} °C`],
    ['🥶 Sensación térmica', h => `${h.feelslike} °C`],
    ['💧 Humedad', h => `${h.humidity} %`],
    ['🌧️ Precipitación', h => `${h.precip || 0} mm`],
    ['❄️ Prob. precip/nieve', h => `${h.precipprob || 0} %`],
    ['🌨️ Tipo precip.', h => h.preciptype ? h.preciptype.join(', ') : 'N/A'],
    ['⛄ Nieve', h => `${h.snow || 0} mm`],
    ['🌬️ Viento', h => `${h.windspeed} km/h`],
    ['🧭 Dirección viento', h => `${h.winddir}°`],
    ['🌡️ Presión', h => `${h.pressure} hPa`],
    ['☁️ Nubosidad', h => `${h.cloudcover} %`],
    ['👀 Visibilidad', h => `${h.visibility} km`],
    ['🔆 UV', h => h.uvindex],
    ['🌥️ Condición', h => h.conditions],
    ['🖼️ Ícono', h => `<img src="https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/4th%20Set%20-%20Color/${h.icon}.png" height="24">`],
  ];

  rows.forEach(([label, getValue]) => {
    const row = document.createElement('tr');
    row.appendChild(createHeaderCell(label));

    day.hours.forEach(hour => {
      const td = document.createElement('td');
      td.innerHTML = getValue(hour);
      row.appendChild(td);
    });

    table.appendChild(row);
  });

  wrapper.appendChild(table);
  return wrapper;

  function createHeaderCell(text) {
    const th = document.createElement('th');
    th.innerHTML = text;
    th.style.position = 'sticky';
    th.style.left = '0';
    th.style.background = '#fff';
    th.style.zIndex = 2;
    return th;
  }
}

export function generarTablaEstaciones(data) {
  const stations = data.stations;

  const wrapper = document.createElement('div');
  wrapper.className = 'tabla-scroll-wrapper';

  // Título fuera de la tabla
  const titulo = document.createElement('h2');
  titulo.textContent = `🛰️ Estaciones meteorológicas cercanas`;
  titulo.className = 'titulo-tabla';
  wrapper.appendChild(titulo);

  if (!stations || Object.keys(stations).length === 0) {
    const p = document.createElement('p');
    p.textContent = '❌ No se encontraron estaciones meteorológicas.';
    wrapper.appendChild(p);
    return wrapper;
  }

  const table = document.createElement('table');
  table.className = 'stations-table';

  // Encabezados
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>📍 Estación</th>
      <th>📏 Distancia (km)</th>
      <th>🧭 Latitud</th>
      <th>🧭 Longitud</th>
      <th>📊 Calidad</th>
      <th>🔗 Contribución</th>
    </tr>
  `;
  table.appendChild(thead);

  // Cuerpo
  const tbody = document.createElement('tbody');

  for (const key in stations) {
    const st = stations[key];

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${st.name || key}</td>
      <td>${(st.distance || 0).toFixed(2)}</td>
      <td>${st.latitude}</td>
      <td>${st.longitude}</td>
      <td>${st.quality || 'N/A'}</td>
      <td>${st.contribution || 'N/A'}</td>
    `;
    tbody.appendChild(row);
  }

  table.appendChild(tbody);
  wrapper.appendChild(table);
  return wrapper;
}

export function generarTablaEstacionesPropias(data) {
  const stations = data.stations;

  const wrapper = document.createElement('div');
  wrapper.className = 'tabla-scroll-wrapper';

  // Título de la tabla
  const titulo = document.createElement('h2');
  titulo.textContent = '📋 Estaciones Propias';
  titulo.className = 'titulo-tabla';
  wrapper.appendChild(titulo);

  // Validación si no hay estaciones
  if (!stations || Object.keys(stations).length === 0) {
    const p = document.createElement('p');
    p.textContent = '❌ No hay estaciones disponibles.';
    wrapper.appendChild(p);
    return wrapper;
  }

  const table = document.createElement('table');
  table.className = 'stations-table';

  // Encabezados
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>📍 Estación</th>
      <th>🧭 Latitud</th>
      <th>🧭 Longitud</th>
      <th>🌎 Ubicación</th>
      <th>⚙️ Estado estación</th>
      <th>📡 Suscrito a</th>
    </tr>
  `;
  table.appendChild(thead);

  // Cuerpo de la tabla
  const tbody = document.createElement('tbody');

  for (const key in stations) {
    const st = stations[key];

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${st.name || key}</td>
      <td>${st.latitude || 'N/A'}</td>
      <td>${st.longitude || 'N/A'}</td>
      <td>${st.ubicacion || 'N/A'}</td>
      <td>${st.estado || 'Desconocido'}</td>
      <td>${st.suscritoA || 'No'}</td>
    `;
    tbody.appendChild(row);
  }

  table.appendChild(tbody);
  wrapper.appendChild(table);
  return wrapper;
}




