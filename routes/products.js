const express = require('express');
const router = express.Router();
const productController = require('../app/api/controllers/products');
var guard = require('express-jwt-permissions')();

router.get('/',  guard.check(['products:read']), productController.getAll);
router.post('/', guard.check(['products:read', 'products:write']), productController.create);
router.get('/:productId', productController.getById);
router.put('/:productId', productController.updateById);
router.delete('/:productId', productController.deleteById);
module.exports = router;
