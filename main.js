const { Pool } = require('pg');
const express = require('express');
require('dotenv').config();

const PORT = process.env.PORT;
const HOST_DB = process.env.HOST
const password = process.env.PASSWORD_DB

console.log(PORT, HOST_DB, password)
app = express();

const pool = new Pool({
    host: `${HOST_DB}`,
    port: 5432,
    database: 'verceldb',
    user: 'default',
    password: `${password}`,
    ssl: {
        rejectUnauthorized: false
    }
});

const getToken = (req, res, next) => {

    const authToken = req.header('x-token');
    if (!authToken) {
        return res.status(401).json({ error: 'Token missing' });
      }
    
      const validToken = process.env.VALID_TOKEN; // Token válido desde la variable de entorno
      if (authToken !== validToken) {
        return res.status(401).json({ error: 'Invalid token' });
      }
    
    
    next();
}

app.get('/', getToken, (req, res) => {
    res.json({ 'message': 'welcome to database analytcs' });
  });

app.get('/usuarios', getToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios');
        res.json(result.rows);
    } catch (err) {
        console.error('Error en la consulta:', err.stack);
        res.status(500).send('Error interno del servidor.');
    }
});

app.get('/asistencias', getToken, async (req, res)=>{
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
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});