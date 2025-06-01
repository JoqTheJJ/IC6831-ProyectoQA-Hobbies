// Definir las rutas relacionadas con los hobbies, incluyendo obtener hobbies, recomendaciones, likes y dislikes
const express = require('express');
const router = express.Router();
const hobbiesController = require('../controllers/hobbiesController');

router.post('/getHobbies', hobbiesController.getHobbies);
router.post('/getRecommendations', hobbiesController.getRecommendations);
router.post('/getLikesByUser', hobbiesController.getLikesByUser);
router.post('/getDislikesByUser', hobbiesController.getDislikesByUser);

module.exports = router;