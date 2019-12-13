const userModel = require('../models/users');
const refreshTokenModel = require('../models/refreshTokens');
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
                    decodedRefreshToken = jwt.verify(refreshToken, req.app.get('refreshTokenSecretKey'));
                    expiredDate = new Date(decodedRefreshToken.exp * 1000)
                    issuedDate = new Date(decodedRefreshToken.iat * 1000)

                 refreshTokenModel.create({  refreshToken: refreshToken,
                                                userID: userInfo._id ,
                                                userName: userInfo.name,
                                                revoke: false,
                                                issuedDate: issuedDate,
                                                expiredDate:expiredDate
                                            }) 
                  //  console.log(issuedDate)
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
                        // refreshTokenModel.insert({ refreshTokens: req.body.refreshToken})
                      // add user id to request
                      // req.body.userId = decoded.id;
                      // const expireDate = Date(0);
                      //   expireDate.setUTCSeconds(token.data.exp);
                      // const date = new Date(0);
                  
                     //console.log(date.setUTCSeconds(decoded.exp))
                     //  console.log(date.setUTCSeconds(decoded.iat))
                     console.log(new Date(decoded.exp * 1000))
                     console.log(new Date(decoded.iat * 1000))
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