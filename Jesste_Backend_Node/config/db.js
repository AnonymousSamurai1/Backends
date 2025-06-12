const mongoose = require('mongoose')
const connectDB = async()=>{
   const conn = await mongoose.connect("mongodb+srv://anonymous:Jesus123@techedem.ol5kcgf.mongodb.net/")
   console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold)
}
 module.exports=connectDB