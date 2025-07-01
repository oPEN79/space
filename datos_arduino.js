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

    const fecha_arduino = document.getElementById("fecha_arduino");
    fecha_arduino.innerHTML = `--`; //Limpiar datos anteriores
    fecha_arduino.innerHTML = `<label>${fecha}</lable>`;

    const hora_arduino = document.getElementById("hora_arduino");
    hora_arduino.innerHTML = `--`; //Limpiar datos anteriores
    hora_arduino.innerHTML = `<label>${hora}</lable>`;

    const temp_arduino = document.getElementById("temp_arduino");
    temp_arduino.innerHTML = `--`; //Limpiar datos anteriores
    temp_arduino.innerHTML = `<label>${datos.temperatura}</lable>`;

    const hum_arduino = document.getElementById("hum_arduino");
    hum_arduino.innerHTML = `--`; //Limpiar datos anteriores
    hum_arduino.innerHTML = `<label>${datos.humedad}</lable>`;

    const luz_arduino = document.getElementById("luz_arduino");
    luz_arduino.innerHTML = `--`; //Limpiar datos anteriores
    luz_arduino.innerHTML = `<label>${datos.luz}</lable>`;

    const lluvia_arduino = document.getElementById("lluvia_arduino");
    lluvia_arduino.innerHTML = `--`; //Limpiar datos anteriores
    lluvia_arduino.innerHTML = `<label>${datos.lluvia}</lable>`;

    const presion_arduino = document.getElementById("presion_arduino");
    presion_arduino.innerHTML = `--`; //Limpiar datos anteriores
    presion_arduino.innerHTML = `<label>${datos.presion}</lable>`;

    const viento_arduino = document.getElementById("viento_arduino");
    viento_arduino.innerHTML = `--`; //Limpiar datos anteriores
    viento_arduino.innerHTML = `<label>${datos.viento}</lable>`;

    const aire_arduino = document.getElementById("aire_arduino");
    aire_arduino.innerHTML = `--`; //Limpiar datos anteriores
    aire_arduino.innerHTML = `<label>${datos.aire}</lable>`;

    // Mostrar en la página
    const div = document.getElementById("DataArduino");
    div.innerHTML += `<label style="font-size: 24 !important;">${msg}</lable>`;
    div.innerHTML += `<br>`;
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
