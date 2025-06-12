const mongoose = require('mongoose');

const AdminSchema = mongoose.Schema({
    
    fullname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true
    },
    secretcode:{
        type: String,
        required: true,
        unique: true,
    }
})

module.exports = mongoose.model('Admins', AdminSchema);