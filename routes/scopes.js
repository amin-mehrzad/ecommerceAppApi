const express = require('express');
const router = express.Router();
const scopeController = require('../app/api/controllers/scopes');
var permissions = require('express-jwt-permissions')();

router.get('/', permissions.check(['users:read','scopes:read']) , scopeController.getAll);
router.get('/:userId', permissions.check(['users:read','scopes:read']) , scopeController.getByUserID);
router.put('/:userId' , permissions.check(['users:read','scopes:read','scopes:write','users:write']), scopeController.updateByUserID);

module.exports = router;