const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const UserController = require('../Controller/UserController')
const UserMW = require('../MiddleWare/UserAuthMW')

router.post('/signup',
    [
        body('Name').notEmpty().withMessage('Name is required'),
        body('Email').isEmail().withMessage('Please enter a valid email'),
        body('Password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('Phone').notEmpty().isLength({ min: 11 }).withMessage('Please enter valid phone number')
    ],
    UserController.Signup
)

router.post('/login', 
    [
        body('Email').isEmail().withMessage('Please enter a valid email'),
        body('Password').notEmpty().withMessage('Password is required')
    ],
    UserController.Login
)

router.get('/get/profile',UserMW.CheckUserAuth ,UserController.GetProfile);

module.exports = router;