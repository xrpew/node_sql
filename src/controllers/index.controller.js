const { Pool } = require('pg')
require('dotenv').config();

const HOST_DB = process.env.HOST
const PASSWORD_DB = process.env.PASSWORD_DB

const pool = new Pool({
    host: HOST_DB,
    port: 5432,
    database: 'gym',
    user: 'default',
    password: PASSWORD_DB,
    ssl: {
        rejectUnauthorized: false
    }
});

const getUser = async (req, res) => {
    const response = await pool.query('SELECT * FROM usuarios')
    console.log(response.rows)
    res.send('users')
}

const getRoot = async (req, res) => {
    console.log(req.body)
    res.json({ 'message': 'welcome to database analytcs' });
}

const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios');
        res.json(result.rows);
    } catch (err) {
        console.error('Error en la consulta:', err.stack);
        res.status(500).send('Error interno del servidor.');
    }
}

const getAsistencias = async (req, res) => {
    try {
        const documento = req.params.documento

        if (!documento) {
            return res.status(400).send('Se requiere el parámetro userid.');
        }

        const result = await pool.query('SELECT fecha_visita FROM ingresos WHERE documento = $1', [documento])
        const fechas = result.rows.map(row => (row.fecha_visita).toLocaleString())
        res.json(fechas)
    } catch (err) {
        res.status(500).send('Error interno del servidor.');
    }
}

const insertDay = async (req, res) => {
    try {
        const { userid } = req.query;
        await pool.query('INSERT INTO ingresos (documento, fecha_visita) VALUES ($1, NOW())', [userid], (err, resp) => {
            res.send('dia agregado')

        });
    } catch {
        res.status(500).send('Error interno del servidor.');
    }
}

const getUserByRut = async (req, res) => {
    const documento = req.params.documento
    const response = await pool.query('SELECT * FROM usuarios WHERE documento = $1', [documento])
    res.send(response.rows)
}

const addUserinDB = async (req, res) => {
    try {
        const { nombre, documento, fecha_inicio, fecha_pago, plan } = req.body;
        const query = 'INSERT INTO usuarios (nombre, documento, fecha_inicio, fecha_pago, plan) VALUES ($1, $2, $3, $4, $5)';
        const values = [nombre, documento, fecha_inicio, fecha_pago, plan];

        const response = await pool.query(query, values);
        console.log(response); // Puedes usar esto para ver la respuesta de la consulta en la consola si lo deseas.

        res.status(200).send('Datos insertados correctamente.');
    } catch (error) {
        if (error.code === '23505') {
            res.status(400).send('Los datos ya existen en la base de datos.');
        } else {
            console.error(error);
            res.status(500).send('Error interno del servidor.');
        }
    }
}

module.exports = {
    getUser,
    getRoot,
    getAllUsers,
    getAsistencias,
    insertDay,
    getUserByRut,
    addUserinDB
}