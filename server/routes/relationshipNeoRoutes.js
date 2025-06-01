// Definir las rutas para manejar las interacciones de "like" y "dislike" de los hobbies y la eliminación de relaciones
const express = require('express');
const router = express.Router();
const relationshipNeo = require('../controllers/relationshipNeo');

router.post('/like', relationshipNeo.like)
router.post('/dislike', relationshipNeo.dislike);

router.post('/deleteLike', relationshipNeo.deleteLike);
router.post('/deleteDislike', relationshipNeo.deleteDislike);

module.exports = router;