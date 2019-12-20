const mongoose = require('mongoose');
//Define a schema
const Schema = mongoose.Schema;
const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,

        index: {
            unique: true,
            collation: { locale: 'en', strength: 2 }
          }
            
    }
});
module.exports = mongoose.model('Category', CategorySchema)