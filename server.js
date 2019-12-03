const express = require('express'); 
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express();
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.get('/', function(req, res){
 res.json({"tutorial" : "Build REST API with node.js"});
});
app.listen(3003, function(){ console.log('Node server listening on port 3003');});