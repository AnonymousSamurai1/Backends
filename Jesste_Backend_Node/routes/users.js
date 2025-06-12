const express = require("express")
const router = express.Router()
const  User = require('../models/users');
const ErrorResponse = require('../utils/errorResponse')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



router.get('/', async(req, res, next)=>{
    try {
        const users = await User.find().select('-password');
        if(!users){
            return next(new ErrorResponse(`No User was found`, 404));
        }
        res.status(200).json({
            success: true,
            data: users,
        })
    } catch (err) {
        res.status(400).json({success: false})
        
    }
});



router.get('/:id', async(req, res, next)=>{
    try {
        const user = await User.findById(req.params.id).select('-password');
        if(!user){
            return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({
            success: true,
            data: user,
        })
    } catch (err) {
        next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404))
    }
});



router.post('/register', async(req, res, next)=>{
    try {
        const user = await User.findOne({email: req.body.email});
        if(user){
            return next(new ErrorResponse(`User with email ${req.body.email} already exists`, 400));
        }
        else{
            const hashedPassword = bcrypt.hashSync(req.body.password, 10);
            const newUser = new User({
                fullname: req.body.fullname,
                email: req.body.email,
                password: hashedPassword,
            });
            const savedUser = await newUser.save();
            res.status(201).json({
                success: true,
                data: savedUser,
            });
        }   
    } 
    catch (error) {
        res.status(400).json({success: false, message: error.message})
    }

});



router.post('/login', async(req, res, next)=>{
    try {
        const user = await User.findOne({email: req.body.email})
        const secret = process.env.secret

        if(!user){
            res.status(400).json({success: false, message: 'The user not found'})
        }

        if(user&&bcrypt.compareSync(req.body.password, user.password)){
            const token = jwt.sign(
                {
                    userId: user.id
                },
                secret,
                {expiresIn:"1d"}
            )
            res.status(201).json({
                user:user.email,
                token: token,
                success: true,
                message: 'user Authenticated',
            }) 
        }
        else{
            res.status(400).json({success: false, message: 'Password is wrong'})
        }

        res.status(201).json({
            success: true,
            data: user,
        })
    } catch (error) {
        next(new ErrorResponse(`The User is not authorized`))
    }
        
   
});



router.put('/update/:id', async(req, res, next)=>{

    try {
        const  update = await User.findByIdAndUpdate(
            req.params.id, 
        {
            fullname: req.body.fullname,
            email: req.body.email,
            password: req.body.password,
        },  
        
        {
            new: true,
            runValidators: true
        });

        if(!update){
            return next(new ErrorResponse(`user not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({
            success: true,
            data: update,
        })
    } catch (err) {
        next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }
});



router.delete('/delete/:id', async(req, res, next)=>{
    try{ 
     const del = await User.findByIdAndDelete(req.params.id, req.body)
 
     if(!del){
         res.status(400).json({success: false})
     }
 
     res.status(200).json({
         success: true,
         data: {}
     })
     } catch (err) {
         res.status(400).json({success: false})
     }
 
 })



module.exports = router