const { Router } = require('express')
const { getRoot,
    getAllUsers,
    getAsistencias,
    insertDay,
    getUserByRut, 
    addUserinDB } = require('../controllers/index.controller')
const router = Router()
require('dotenv').config();

const validToken = process.env.VALID_TOKEN; // Token válido desde la variable de entorno

const getToken = (req, res, next) => {
    const authToken = req.header('x-token');
    if (!authToken) {
        return res.status(401).json({ error: 'Token missing' });
    }

    if (authToken !== validToken) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    next();
}
router.get('/', getRoot);

router.get('/usuarios', getToken, getAllUsers);

router.get('/usuarios/:documento', getToken, getUserByRut)

router.get('/insertday', getToken, insertDay)

router.get('/asistencia/:documento', getToken, getAsistencias)

router.post('/nuevo-usuario', addUserinDB)

module.exports = router