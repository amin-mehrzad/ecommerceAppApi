const express = require('express');
const router = express.Router();
const productController = require('../app/api/controllers/products');
var permission = require('express-jwt-permissions')();

router.get('/',  permission.check(['products:read']), productController.getAll);
router.post('/', permission.check(['products:read', 'products:write']), productController.create);
router.get('/:productId',  permission.check(['products:read']), productController.getById);
router.put('/:productId', permission.check(['products:read', 'products:write']), productController.updateById);
router.delete('/:productId', permission.check(['products:read', 'products:write']), productController.deleteById);
module.exports = router;
