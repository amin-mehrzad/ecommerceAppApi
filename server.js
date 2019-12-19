const express = require('express');
const logger = require('morgan');
const products = require('./routes/products') ;
const scopes = require('./routes/scopes') ;
const users = require('./routes/users');
const bodyParser = require('body-parser');
const mongoose = require('./config/database'); //database configuration
const app = express();

require('dotenv').config();
const port = process.env.PORT;
const secretKey = process.env.SECRET_KEY;
const refreshSecretKey = process.env.REFRESH_SECRET_KEY;


//var jwt = require('jsonwebtoken');
var jwtAuthentication = require('express-jwt');
jwtAuthentication.unless = require('express-unless');


app.set('secretKey', secretKey); // jwt secret token
app.set('refreshTokenSecretKey', refreshSecretKey); // jwt secret refresh token
// connection to mongodb
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
app.use(logger('dev'));
//app.use(bodyParser.urlencoded({extended: false}));
//app.use(bodyParser.json());
app.get('/', function(req, res){
res.json({"tutorial" : "Build REST API with node.js"});
});


// athenticate root API route 
app.use('/API', jwtAuthentication({ secret: 'nodeRestApi'}).unless({ path:[ { url: /\/API\/users/ , methods: ['POST'] } ] }) );
app.use('/API/users', bodyParser.urlencoded({extended: false}) );
app.use('/API', bodyParser.json());

// public route
app.use('/API/users', users);
// private route
// app.use('/products', validateUser, products);                ////verifing jwt using default jwt method
app.use('/API/products', products);
app.use('/API/scopes', scopes);
//app.use('/products', jwtAuthentication({ secret: 'nodeRestApi'}), products);
app.get('/favicon.ico', function(req, res) {
    res.sendStatus(204);
});


/*  
function validateUser(req, res, next) {
  jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function(err, decoded) {
    if (err) {
      res.json({status:"error", message: err.message, data:null});
    }else{
      // add user id to request
      req.body.userId = decoded.id;
      next();
    }
  });  
}      
*/


// express doesn't consider not found 404 as an error so we need to handle 404 explicitly
// handle 404 error
app.use(function(req, res, next) {
 let err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// handle errors
app.use(function(err, req, res, next) {
 console.log(err);
  if(err.status === 404)
   res.status(404).json({message: "Not found"});
  else 
    res.status(500).json({message: "Something looks wrong :( !!!"});
});
app.listen(port, function(){
 console.log(`Node server listening on port ${port}`);
});