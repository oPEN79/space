export async function getPointForecast(lat, lon) {
    const apiKey = "melTJdhIXVTxXKr1bL95dQrlKV79odcE"; //  API key para Point Forecast
    const url = "https://api.windy.com/api/point-forecast/v2";

    if (typeof lat !== "number" || typeof lon !== "number") {
        console.error("Latitud o longitud inválida");
        return;
    }

    const body = {
        lat,
        lon,
        model: "gfs",
        parameters: ["wind"],
        key: apiKey
    };

    // Solo agregamos levels si el parámetro lo necesita
    const parametersConLevels = ["wind", "temp", "rh", "dewpoint", "gh"];
    if (parametersConLevels.includes("wind")) {
        body.levels = ["surface"];
    }

    try {
        const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
        });

        if (!res.ok) throw new Error(`Error API: ${res.status} ${res.statusText}`);

        const data = await res.json();
        alert(data);
        return data;
    } catch (error) {
        console.error("Error al obtener datos:", error);
        return null;
    }

}
