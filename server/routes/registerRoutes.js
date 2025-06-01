// Definir la ruta para manejar el registro de nuevos usuarios
const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');

router.post('/', registerController.registerUser);

module.exports = router;