const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
//Define a schema
const Schema = mongoose.Schema;
const RefreshTokenSchema = new Schema({
    refreshToken: {
        type: String,
        trim: true,
        required: true,
    },
    userID: {
        type: String,
        trim: true,
        required: true
    },
    userName: {
        type: String,
        trim: true,
        required: true
    },
    revoke: { 
        type: Boolean,
        required: true
    },
    issuedDate:{
        type: Date,
        required: true
    },
    expiredDate:{
        type: Date,
        require: true
    }
});
module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);