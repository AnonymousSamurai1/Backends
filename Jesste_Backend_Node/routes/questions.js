const express = require("express")
const router = express.Router()
const  Question = require('../models/questions');
const ErrorResponse = require('../utils/errorResponse')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.get('/', async(req, res, next)=>{
    try {
        const questions = await Question.find().select('-password');
        if(!questions){
            return next(new ErrorResponse(`No Questionfound`, 404));
        }
        res.status(200).json({
            success: true,
            data: admins,
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: "Problem getting questions",
        })
        
    }
})
router.get('/:id', async(req, res, next)=>{
    try {
        const question = await Question.findById(req.params.id).select('-password');
        if(!question){
            return next(new ErrorResponse(`Question not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({
            success: true,
            data: admin,
        })
    } catch (err) {
        next(new ErrorResponse(`Question not found with id of ${req.params.id}`, 404))
    }
});

router.post('/register', async(req, res, next)=>{
    try {
            const newQuestion = new Question({
                fullname: req.body.fullname,
                email: req.body.email,
                message: req.body.message,
            });
            const savedQuestion = await newQuestion.save();
            res.status(201).json({
                success: true,
                data: savedQuestion,
            }); 
    } 
    catch (error) {
        res.status(400).json({success: false, message: error.message})
    }

});

router.delete('/delete/:id', async(req, res, next)=>{
    try{ 
     const del = await Question.findByIdAndDelete(req.params.id, req.body)
 
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
