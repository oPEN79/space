import express from 'express';
import fs from 'fs';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());

// Servir archivos estáticos (HTML, JS, CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Recibir datos desde Arduino
app.post('/api/sensores', (req, res) => {
    const data = req.body;
    fs.writeFile('datos.json', JSON.stringify(data, null, 2), err => {
        if (err) return res.status(500).json({ ok: false, error: 'No se pudo guardar' });
        console.log("Datos recibidos:", data);
        res.json({ ok: true });
    });
});

// Leer los últimos datos
app.get('/api/sensores', (req, res) => {
    fs.readFile('datos.json', 'utf-8', (err, content) => {
        if (err) return res.status(500).json({ ok: false, error: 'No se pudo leer' });
        res.json(JSON.parse(content || '{}'));
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
});
