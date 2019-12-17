const express = require('express');
const router = express.Router();
const movieController = require('../app/api/controllers/movies');
var guard = require('express-jwt-permissions')();

router.get('/',  guard.check(['movies:read']), movieController.getAll);
router.post('/', guard.check(['movies:read', 'movies:write']), movieController.create);
router.get('/:movieId', movieController.getById);
router.put('/:movieId', movieController.updateById);
router.delete('/:movieId', movieController.deleteById);
module.exports = router;
