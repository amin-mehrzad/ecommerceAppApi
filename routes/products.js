const express = require('express');
const router = express.Router();
const productController = require('../app/api/controllers/products');
var permission = require('express-jwt-permissions')();

router.get('/',  permission.check([['products:read'],['admin']]), productController.getAll);
router.post('/', permission.check([['products:read', 'products:write'],['admin']]), productController.create);
router.get('/:productId',  permission.check([['products:read'],['admin']]), productController.getById);
router.put('/:productId', permission.check([['products:read', 'products:write'],['admin']]), productController.updateById);
router.delete('/:productId', permission.check([['products:read', 'products:write'],['admin']]), productController.deleteById);
module.exports = router;
