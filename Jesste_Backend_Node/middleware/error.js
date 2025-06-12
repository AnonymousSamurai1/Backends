const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
    let error = {...err}
    error.message = err.message
    // Log to console for dev
    console.log(err.stack.red);

    // Mongoose bad ObjectId
    if(err.name=='CastError'){
        const message = `Bootcamp not found with an  id of ${err.value}`;
        error = new ErrorResponse(message, 404)
    }
    
    // Mongoose duplicate key
    if(err.code===11000){
        const message = "Duplicate field value entered"
        error = new ErrorResponse(message, 400)
    }

    // Mongoose validation error
    if(err.name==="ValidationError"){
        
    }


    res.status(err.statusCode||500).json({
        success: false,
        error: err.message || "Sever Error "
    });
}; 
module.exports = errorHandler;