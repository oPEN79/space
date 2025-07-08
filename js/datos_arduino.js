// ⚙️ CONFIGURA TUS DATOS AQUÍ
const brokerHost = "4861bba361b14626a3407343f1d5b658.s1.eu.hivemq.cloud";
const portWS = 8884; // ← aquí el puerto WebSocket numérico, por ejemplo 8884
const topic = "sensores/estacion1";
const username = "Programa";
const password = "Infraestructura2";

// ID de cliente único
const clientId = "webclient_" + Math.floor(Math.random() * 10000);

// Crear cliente con WebSocket seguro (wss)
const client = new Paho.Client(brokerHost, portWS, clientId);

// Callback al recibir mensaje
client.onMessageArrived = function (message) {
    const datos = JSON.parse(message.payloadString); // Convierte a objeto
    const msg = `${message.payloadString}`;
    const [fecha, hora] = datos.fecha_hora.split(" ");

    console.log("📩 Mensaje recibido:", message.payloadString);
    console.log(msg);

    // Utilidad para actualizar contenido HTML
    function actualizarElemento(id, valor) {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.innerHTML = `<label>${valor}</label>`;
        }
    }

    actualizarElemento("fecha_arduino", fecha);
    actualizarElemento("hora_arduino", hora);
    actualizarElemento("temp_arduino", datos.temperatura);
    actualizarElemento("hum_arduino", datos.humedad);
    actualizarElemento("luz_arduino", datos.luz);
    actualizarElemento("lluvia_arduino", datos.lluvia);
    actualizarElemento("presion_arduino", datos.presion);
    actualizarElemento("viento_arduino", datos.viento);
    actualizarElemento("aire_arduino", datos.aire);
    actualizarElemento("condiciones_arduino", datos.condiciones);
    actualizarElemento("fase_lunar_arduino", datos.fase_lunar);
    actualizarElemento("amanecer_arduino", datos.amanecer);
    actualizarElemento("anochecer_arduino", datos.anochecer);

    // Mostrar el mensaje completo en el historial de mensajes
    // const div = document.getElementById("DataArduino");
    // if (div) {
    //     div.innerHTML += `<label style="font-size: 24px !important;">${msg}</label><br>`;
    // }
};


// Callback si se pierde la conexión
client.onConnectionLost = function (response) {
    const estado = document.getElementById("estado_broker");
    estado.innerHTML += `<lable>🔌 Conexión perdida: ${response.errorMessage}</lable>`;
    console.error("🔌 Conexión perdida:", response.errorMessage);
};

// Conectarse al broker
client.connect({
    onSuccess: function () {
        const estado = document.getElementById("estado_broker");
        estado.innerHTML = `<lable>✅ Conectado al broker</lable>`;
        console.log("✅ Conectado al broker");
        client.subscribe(topic);
        estado.innerHTML += `<lable>📡 Suscrito a: ${topic}</lable>`;
        console.log("📡 Suscrito a:", topic);
    },
    onFailure: function (err) {
        const estado = document.getElementById("estado_broker");
        estado.innerHTML += `<lable>❌ Error al conectar: ${err.errorMessage}</lable>`;
        console.error("❌ Error al conectar:", err.errorMessage);
    },
    userName: username,
    password: password,
    useSSL: true // Siempre true para wss
});
