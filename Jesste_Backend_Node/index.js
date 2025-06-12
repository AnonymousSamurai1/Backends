const express = require('express')
const app = express();
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const bp = require('body-parser');
const path = require('path');
const Colors = require('colors');
const cors = require('cors');

//Env connection
dotenv.config({path: './config/config.env'})

//Database connection
connectDB();

//Middleware
app.use(morgan('dev'));
app.use(bp.json());
app.use(cors());
app.use(express.json());
app.use(bp.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'assets')));

//Route 
const userRoute = require('./routes/users');
const keyRoute = require('./routes/keys');
const AdminRoute = require('./routes/admins');
const QuestionRoute = require('./routes/questions')

//Mount routers
app.use('/jesste/api/users', userRoute);
app.use('/jesste/api/keys', keyRoute);
app.use('/jesste/api/admins', AdminRoute);
app.use('/jesste/api/questions', QuestionRoute);

//Port connection
const PORT = process.env.PORT || 6570

app.listen(PORT, () =>{
    console.log(`Listening on port ${PORT}`.yellow.bold);
})
