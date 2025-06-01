// Definir la ruta para manejar el inicio de sesión de los usuarios
const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

router.post('/', loginController.loginUser);

module.exports = router;