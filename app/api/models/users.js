const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
//Define a schema
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    // token: {
    //     type: String,
    //     trim: true,
    //    // required: true
    // },
    // refreshToken: {
    //     type: String,
    //     trim: true,
    //    // required: true
    // },
    refreshTokens:
    //[
     { type: [String] }
        //     {
        //     token: {
        //         type: String,
        //         trim: true,
        //      //   required: true
        //     },
        //     refreshToken: {
        //         type: String,
        //         trim: true,
        //       //  required: true
        //     }
        // }
  // ]
});
// hash user password before saving into database
// UserSchema.pre('save', function (next) {
//     this.password = bcrypt.hashSync(this.password, saltRounds);
//     next();
// });
module.exports = mongoose.model('User', UserSchema);