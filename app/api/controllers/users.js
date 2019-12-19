const userModel = require('../models/users');
//const refreshTokenModel = require('../models/refreshTokens');
const scopeModel = require('../models/scopes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
module.exports = {
    create: function (req, res, next) {

        encryptedPass = bcrypt.hashSync(req.body.password, saltRounds);
        userModel.create({ name: req.body.name, email: req.body.email, password: encryptedPass }, function (err, result) {
            if (err)
                next(err);
            else {
                console.log(result._id)
                //   scopeModel.create({userID: result._id , read:["users","scopes"] , write:["users","movies","scopes"] }, function(error,doc){
                scopeModel.create({ userID: result._id, permissions: ["users:read", "movies:read", "scopes:read", "users:write", "movies:write", "scopes:write"] }, function (error, doc) {
                    if (error)
                        next(error);
                });
                res.json({ status: "success", message: "User added successfully!!!", data: null });
            }
        });
    },
    authenticate: function (req, res, next) {
        userModel.findOne({ email: req.body.email }, function (err, userInfo) {
            if (err) {
                next(err);
            } else {
                if (bcrypt.compareSync(req.body.password, userInfo.password)) {




                    scopeModel.findOne({ userID: userInfo._id }, function (error, scopeInfo) {
                        console.log('!!!!!')
                        console.log(scopeInfo.permissions)
                        // console.log(scopeInfo.permissions)
                        console.log('!!!!!')


                        const token = jwt.sign({ id: userInfo._id, permissions: scopeInfo.permissions }, req.app.get('secretKey'), { expiresIn: 900 });
                        const refreshToken = jwt.sign({ id: userInfo._id, permissions: scopeInfo.permissions }, req.app.get('refreshTokenSecretKey'), { expiresIn: 86400 });


                        /*  save refreshToken to DB removed 
     
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
                        */

                        //  console.log(issuedDate)
                        // userInfo.token = token;
                        // userInfo.refreshToken = refreshToken;
                        // newTokens=[refreshToken]
                        //         userInfo.refreshTokens=userInfo.refreshTokens.concat([refreshToken])
                        // userInfo.tokens =  userInfo.tokens.concat({ token, refreshToken });
                        // userInfo.tokens[refreshToken] =  { token, refreshToken };
                        //userInfo.tokens = userInfo.tokens.concat({ token, refreshToken });
                        //userInfo.tokens.push({ token, refreshToken });
                        console.log(userInfo);
                        //  userInfo.save();
                        res.json({ status: "success", message: "user found!!!", data: { user: userInfo, token: token, refreshToken: refreshToken } });
                    })
                } else {
                    res.json({ status: "error", message: "Invalid email/password!!!", data: null });
                }


            }
        });
    },
    refreshToken: function (req, res, next) {
        // userModel.findOne({ 'tokens.refreshToken' : req.body.refreshToken }, function (err, tokenInfo) {
        //    userModel.findOne({ refreshTokens: req.body.refreshToken}  , function (err, tokenInfo) {
        console.log(req.body)
        //   if (err) { next(err); }
        // if (tokenInfo) {
        jwt.verify(req.body.refreshToken, req.app.get('refreshTokenSecretKey'), function (err, decoded) {
            if (err) {
                res.json({ status: "error", message: err.message, data: null });
            } else {
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
                console.log(decoded.permissions)
                const token = jwt.sign({ id: decoded.id, permissions: decoded.permissions }, req.app.get('secretKey'), { expiresIn: 900 });
                // tokenInfo.tokens.token=token;
                res.json({ status: "success", message: "token refreshed!!!", data: { token: token } });
                //   next();
            }
        });

        ///    }  else {
        //  res.json({ status: "error", message: "token is wrong", data: null });
        //       }
        //    });
    },
    usersList: function (req, res, next) {
        let usersList = [];
        userModel.find({}, function (err, users) {
            if (err) {
                next(err);
            } else {
                for (let user of users) {
                    usersList.push({
                        id: user._id,
                        name: user.name,
                        email: user.email
                    });
                }
                res.json({ status: "success", message: "Users list found!!!", data: { users: usersList } });
            }
        });
    },
    user: function (req, res, next) {
        userModel.findById(req.params.userId, function (err, userInfo) {
            if (err) {
                next(err);
            } else {
                res.json({
                    status: "success", message: "User found!!!", data: {
                        id: userInfo._id,
                        name: userInfo.name,
                        email: userInfo.email
                    }
                });
            }
        });
    },
    deleteUser: (req, res, next) => {
        userModel.findByIdAndRemove(req.params.userId, (error, userInfo) => {
            if (error) {
                next(error);
            } else {
                scopeModel.findOneAndRemove({userID :req.params.userId}, (err, scopeInfo) => {
                    res.json({ status: "success", message: "The user account deleted successfully!!!", data: null });
                })
            }
        })
    }
    // permission: function (req,res,next) {
    //     console.log(req)

    //    // let permissionsList = [];
    //     // scopeModel.find({}, function (err, permissions) {
    //     //     if (err) {
    //     //         next(err);
    //     //     } else {
    //     //         for (let userPermission of permissions) {

    //     //             permissionsList.push({
    //     //                 id: userPermission._id,
    //     //                 userID: userPermission.userID,
    //     //               //  permissions: userPermission.permissions
    //     //             });
    //     //         }
    //     //         res.json({ status: "success", message: "User permission list found!!!", data: { permissions: permissionsList } });
    //     //     }
    //     // });
    // },
    // test: function (req, res, next) {
    // console.log(req.params)
    // }
}