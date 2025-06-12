const mongoose = require('mongoose');

const KeySchema = mongoose.Schema({
    email:{
        type: String,
    },
    password:{
        type: String,
        required: true
    }

})

module.exports = mongoose.model('Key', KeySchema);