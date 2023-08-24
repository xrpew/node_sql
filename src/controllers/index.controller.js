const { Pool } = require('pg')
require('dotenv').config();


const HOST_DB = process.env.HOST
const PASSWORD_DB = process.env.PASSWORD_DB

const pool = new Pool({
    host: HOST_DB,
    port: 5432,
    database: 'verceldb',
    user: 'default',
    password: PASSWORD_DB,
    ssl: {
        rejectUnauthorized: false
    }
});

const getUser =  async (req, res)=>{
    const response = await pool.query('SELECT * FROM usuarios')
    console.log(response.rows)
    res.send('users')
}

const getRoot = async (req, res) => {
    console.log(req.body)
    res.json({ 'message': 'welcome to database analytcs' });
}

const getUsers = async (req, res) => {
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
        const { userid } = req.query;
        if (!userid) {
            return res.status(400).send('Se requiere el parámetro userid.');
        }

        const result = await pool.query('SELECT fecha_visita FROM ingresos WHERE documento = $1', [userid])
        const fechas = result.rows.map(row => (row.fecha_visita).toLocaleString())
        res.json(fechas)
    } catch (err) {
        res.status(500).send('Error interno del servidor.');
    }
}

const insertDay = (req, res) => {
    try {
        const { userid } = req.query;

        pool.query('INSERT INTO ingresos (documento, fecha_visita) VALUES ($1, NOW())', [userid], (err, resp) => {
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

module.exports = {
    getUser,
    getRoot,
    getUsers,
    getAsistencias,
    insertDay,
    getUserByRut
}