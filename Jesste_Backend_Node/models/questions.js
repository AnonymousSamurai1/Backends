const mongoose = require('mongoose')
const QuestionSchema =  mongoose.Schema({
    fullname: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    message: {
        type: String,
        require: true,
    }
})
module.exports = mongoose.model('Question', QuestionSchema)