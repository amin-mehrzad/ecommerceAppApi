const express = require('express');
const router = express.Router();
const userController = require('../app/api/controllers/users');
var permissions = require('express-jwt-permissions')();

router.get('/', permissions.check([['users:read'],['admin']]) , userController.usersList);
router.get('/:userId', permissions.check( [['users:read'],['admin']]) , userController.user);
router.delete('/:userId', permissions.check( [['users:read', 'users:write'],['admin']]), userController.deleteUser);

router.post('/register', userController.create);
router.post('/authenticate', userController.authenticate);
router.post('/refreshToken', userController.refreshToken);
module.exports = router;