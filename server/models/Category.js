const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        
    },
    userID:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('Category', CategorySchema);
