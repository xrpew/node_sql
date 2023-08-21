const { Pool } = require('pg');
const express = require('express');
const PORT = 3000;

app = express();

const pool = new Pool({
    host: 'ep-dry-lab-52582492-pooler.us-east-1.postgres.vercel-storage.com',
    port: 5432,
    database: 'verceldb',
    user: 'default',
    password: '6oFt8bZqlmGx',
    ssl: {
        rejectUnauthorized: false
    }
});

app.get('/', (req, res) => {
    res.status(200).send('Welcome to analytics database.');
})

app.get('/usuarios', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios');
        res.json(result.rows);
    } catch (err) {
        console.log('Error en la consulta:', err.stack);
        res.status(500).send('Error interno del servidor.');
    }
});

app.get('/asistencias', async (req, res)=>{
    try{
        const { userid } = req.query;
        if (!userid) {
            return res.status(400).send('Se requiere el parámetro userid.');
        }

        const result = await pool.query('SELECT fecha_visita FROM ingresos WHERE documento = $1', [userid])
        const fechas = result.rows.map(row=> (row.fecha_visita).toLocaleString())
        res.json(fechas)
    } catch (err){
        res.status(500).send('Error interno del servidor.');
    }
})

app.get('/insertday', (req, res) => {
    try {
        const { userid } = req.query;

        pool.query('INSERT INTO ingresos (documento, fecha_visita) VALUES ($1, NOW())', [userid], (err, resp) => {
            res.send('dia agregado')

        });
    } catch {
        res.status(500).send('Error interno del servidor.');
    }
})

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});