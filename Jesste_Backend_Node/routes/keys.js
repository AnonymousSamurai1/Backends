const express = require("express")
const router = express.Router()
const  Key = require('../models/keys');
const ErrorResponse = require('../utils/errorResponse')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


router.get('/', async(req, res, next)=>{
    try {
        const keys = await Key.find();
        if(!keys){
            return next(new ErrorResponse(`No key was found`, 404));
        }
        res.status(200).json({
            success: true,
            data: keys,
        })
    } catch (err) {
        res.status(400).json({success: false, message: 'No key found'});  
    }
});


router.get('/:id', async(req, res, next)=>{
    try {
        const key = await Key.findById(req.params.id).select('-password');
        if(!key){
            return next(new ErrorResponse(`Key not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({
            success: true,
            data: key,
        });
    } catch (err) {
        next(new ErrorResponse(`Key not found with id of ${req.params.id}`, 404))
    }
});


router.post('/register', async(req, res, next)=>{
    try {
            const hashedPassword = bcrypt.hashSync(req.body.password, 10);
            const newKey = new Key({
                email: req.body.email,
                password: hashedPassword,
            });
            const savedKey = await newKey.save();
            res.status(201).json({
                success: true,
                data: savedKey,
            });   
    } 
    catch (error) {
        res.status(400).json({success: false, message: error.message})
    }
});


router.post('/login', async (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ success: false, message: 'Password is required' });
    }

    try {
        const keys = await Key.find(); // fetch all keys

        for (const key of keys) {
            const isMatch = bcrypt.compareSync(password, key.password);
            if (isMatch) {
                return res.status(200).json({
                    success: true,
                    message: 'Login successful',
                    data: {
                        email: key.email, // or any other identifier you wish to return
                    }
                });
            }
        }

        // If none match
        res.status(401).json({ success: false, message: 'Invalid password' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error: ' + error.message });
    }
});

router.put('/update/:id', async(req, res, next)=>{

    try {
        const  update = await Key.findByIdAndUpdate(
            req.params.id, 
        {
            password: req.body.password,
        },  
        {
            new: true,
            runValidators: true
        });
        if(!update){
            return next(new ErrorResponse(`Key not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({
            success: true,
            data: update,
        });
    } catch (err) {
        next(new ErrorResponse(`Key not found with id of ${req.params.id}`, 404));
    }
});

router.delete('/delete/:id', async(req, res, next)=>{
    try{ 
     const del = await Key.findByIdAndDelete(req.params.id, req.body)
 
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
 });

module.exports = router