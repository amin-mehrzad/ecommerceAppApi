const userModel = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
module.exports = {
    create: function (req, res, next) {
        
        encryptedPass=bcrypt.hashSync(req.body.password, saltRounds);
        userModel.create({ name: req.body.name, email: req.body.email, password: encryptedPass }, function (err, result) {
            if (err)
            next(err);

            else
                res.json({ status: "success", message: "User added successfully!!!", data: null });

        });
    },
    authenticate: function (req, res, next) {
        userModel.findOne({ email: req.body.email }, function (err, userInfo) {
            if (err) {
                next(err);
            } else {
                if (bcrypt.compareSync(req.body.password, userInfo.password)) {
                    const token = jwt.sign({ id: userInfo._id }, req.app.get('secretKey'), { expiresIn: 600 });
                    const refreshToken = jwt.sign({ id: userInfo._id }, req.app.get('refreshTokenSecretKey'), { expiresIn: 86400 });
                   // userInfo.token = token;
                   // userInfo.refreshToken = refreshToken;
                   // newTokens=[refreshToken]
                   userInfo.refreshTokens=userInfo.refreshTokens.concat([refreshToken])
                   // userInfo.tokens =  userInfo.tokens.concat({ token, refreshToken });
                   // userInfo.tokens[refreshToken] =  { token, refreshToken };
                    //userInfo.tokens = userInfo.tokens.concat({ token, refreshToken });
                    //userInfo.tokens.push({ token, refreshToken });
                    console.log(userInfo);
                    userInfo.save();
                    res.json({ status: "success", message: "user found!!!", data: { user: userInfo, token: token, refreshToken: refreshToken } });
                } else {
                    res.json({ status: "error", message: "Invalid email/password!!!", data: null });
                }
            }
        });
    },
    refreshToken: function (req, res, next) {
       // userModel.findOne({ 'tokens.refreshToken' : req.body.refreshToken }, function (err, tokenInfo) {
            userModel.findOne({ refreshTokens: req.body.refreshToken}  , function (err, tokenInfo) {
            console.log(tokenInfo)
            if (err) { next(err); }
            if (tokenInfo) {
                jwt.verify(req.body.refreshToken, req.app.get('refreshTokenSecretKey'), function(err, decoded) {
                    if (err) {
                      res.json({status:"error", message: err.message, data:null});
                    }else{
                      // add user id to request
                     // req.body.userId = decoded.id;
                     console.log(decoded)
                     const token = jwt.sign({ id: tokenInfo._id }, req.app.get('secretKey'), { expiresIn: 600 });
               // tokenInfo.tokens.token=token;
                res.json({ status: "success", message: "token refreshed!!!", data: { token: token } });
                   //   next();
                    }
                  });
                
            }  else {
                res.json({ status: "error", message: "token is wrong", data: null });
            }
        });
    }
}