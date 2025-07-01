const API_KEY = 'RCM8EZZKBW6R6RVFH3SJXTNKC'; // <-- coloca tu clave aquí
const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

export async function fetchWeather(lat, lon) {
    const url = `${BASE_URL}/${lat},${lon}/today?unitGroup=metric&lang=es&include=current,hours,days&key=${API_KEY}&contentType=json`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('No se pudo obtener datos del clima');
    }

    const data = await response.json();
    return data;
}
