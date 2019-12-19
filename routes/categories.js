const express = require('express');
const router = express.Router();
const categoryController = require('../app/api/controllers/categories');
var permission = require('express-jwt-permissions')();

router.get('/',  permission.check([['category:read'],['admin']]), categoryController.getAll);
router.post('/', permission.check([['category:read', 'category:write'],['admin']]), categoryController.create);
router.get('/:categoryId',  permission.check([['category:read'],['admin']]), categoryController.getById);
router.put('/:categoryId', permission.check([['category:read', 'category:write'],['admin']]), categoryController.updateById);
router.delete('/:categoryId', permission.check([['category:read', 'category:write'],['admin']]), categoryController.deleteById);
module.exports = router;
