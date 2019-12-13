const mongoose = require('mongoose');
//const bcrypt = require('bcryptjs');
//const saltRounds = 10;

//Define a schema
const Schema = mongoose.Schema;
const ScopesSchema = new Schema({
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
    read: {
        type: [String],
        trim: true,
        required: true
    },
    write: {
        type: [String],
        trim: true,
        required: true
    }
});
module.exports = mongoose.model('Scopes', ScopesSchema);